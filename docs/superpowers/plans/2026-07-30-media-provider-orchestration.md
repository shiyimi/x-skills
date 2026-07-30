# Media Provider Orchestration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Agnes-only skill with a compact `media` skill that selects registered image/video Providers by a unique fixed global priority and preserves Agnes generation, polling, and safe artifact handling.

**Architecture:** `core/media.cjs` owns the CLI and workflow, `core/contract.cjs` owns stable cross-Provider validation and errors, and `core/artifacts.cjs` owns credential-free artifact materialization. `providers/manifest.cjs` is the only registry and coarse capability source; `providers/agnes.cjs` owns every Agnes-specific detail.

**Tech Stack:** Node.js 18+, CommonJS, built-in `node:test`, built-in `fetch`, zero third-party runtime dependencies.

## Global Constraints

- Work directly on `main`, as explicitly approved by the user.
- Preserve unrelated staged changes in `.gitignore`, `AGENTS.md`, `skills/ms-frontend-code-review.zip`, and `tools/ai-copilot-template/AGENTS.md`.
- Commit task paths only with `git commit --only --no-verify <paths> -m <message>`; verify each commit with `git diff-tree --no-commit-id --name-status -r HEAD` and `git status --short`.
- Runtime structure contains only `skills/media/core` and `skills/media/providers`; do not create `agents`, `scripts`, `orchestration`, base classes, dependency-injection containers, automatic discovery, generic HTTP frameworks, or old-CLI wrappers.
- Each Provider has one finite integer priority shared by all capabilities; lower numbers run first and enabled priorities may not collide.
- `providers/manifest.cjs` is the sole source for IDs, enabled state, priority, and coarse capability lists.
- Automatic fallback after a Provider call is allowed only for a normalized error with `accepted: false`; explicit Provider selection never falls back.
- Status and wait require `provider` and `task.id` and never reselect a Provider.
- Never expose credentials in output and never run a live, quota-consuming Agnes request during implementation.

---

### Task 1: Stable Contract And Provider Registry

**Files:**
- Create: `skills/media/tests/media.test.cjs`
- Create: `skills/media/core/contract.cjs`
- Create: `skills/media/providers/manifest.cjs`

**Interfaces:**
- Produces: `CAPABILITIES`, `ProviderError`, `validateManifest(manifest)`, `validateRequest(command, request)`, `normalizeOutcome(outcome)`, and `exitCodeFor(error)` from `contract.cjs`.
- Produces: the manifest array from `manifest.cjs`, with Agnes registered as `id: 'agnes'`, `enabled: true`, `priority: 100`, and the five approved capabilities.

- [ ] **Step 1: Write failing contract and manifest tests**

Add `node:test` cases which use literal fixture Providers and prove that `validateManifest` rejects duplicate enabled IDs, duplicate enabled priorities, unknown/duplicate capabilities, and missing Provider methods; prove that disabled priorities may collide and that sorted enabled entries are independent of manifest order. Add request cases proving new work requires a supported capability and prompt, while status/wait require an explicit Provider plus `task.id`.

```js
const fixtureProvider = {
  isConfigured: () => true,
  supports: () => ({ supported: true }),
  create: async () => ({ status: 'succeeded', artifact_sources: [] })
};

assert.throws(
  () => validateManifest([
    entry('first', 10, fixtureProvider),
    entry('second', 10, fixtureProvider)
  ]),
  (error) => error.kind === 'configuration_error'
);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: FAIL because `../core/contract.cjs` does not exist.

- [ ] **Step 3: Implement the minimal stable contract and explicit manifest**

Implement plain functions and one `ProviderError` class. Validate only public/IO boundaries. Require `isConfigured`, `supports`, and `create`; require `status` only when actually polling an asynchronous Provider outcome. Export the literal Agnes manifest, requiring `./agnes.cjs` even though that Provider is added in Task 3.

```js
class ProviderError extends Error {
  constructor(kind, message, options = {}) {
    super(message);
    this.name = 'ProviderError';
    this.kind = kind;
    this.accepted = options.accepted;
    this.details = options.details;
  }
}

function validateManifest(manifest) {
  // Validate shape, known capabilities, unique enabled IDs/priorities,
  // and required Provider functions; return a priority-sorted copy.
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: PASS for all Task 1 cases.

- [ ] **Step 5: Commit only Task 1 paths**

Run: `git commit --only --no-verify skills/media/tests/media.test.cjs skills/media/core/contract.cjs skills/media/providers/manifest.cjs -m "feat: define media provider contract"`

### Task 2: Fixed-Priority Orchestration And CLI

**Files:**
- Modify: `skills/media/tests/media.test.cjs`
- Create: `skills/media/core/media.cjs`

**Interfaces:**
- Consumes: `validateManifest`, `validateRequest`, `normalizeOutcome`, `ProviderError`, and `exitCodeFor` from Task 1.
- Produces: `createMedia(request, context)`, `statusMedia(request, context)`, `waitMedia(request, context)`, `generateMedia(request, context)`, `listCapabilities(manifest)`, and `runCli(argv, io)`.
- Context injection: `{ manifest, saveArtifacts, now, sleep, signal, cwd }`; production defaults use the real manifest, artifact saver, clock, and stdin/stdout.

- [ ] **Step 1: Write failing selection, fallback, task-pinning, and CLI tests**

Add fixture-Provider tests proving automatic selection sorts `10` before `20`, skips unconfigured/unsupported Providers, falls back after `new ProviderError(..., { accepted: false })`, and stops on missing/true/unknown acceptance. Prove explicit selection calls only the named Provider. Prove status and wait invoke only the pinned Provider, timeout returns `wait_timeout` with the same task ID, output preflight occurs before `create`, and `capabilities` is manifest-derived without credentials or network.

```js
const result = await createMedia(request, {
  manifest: [entry('slow', 20, slow), entry('fast', 10, fast)],
  saveArtifacts: async () => []
});
assert.equal(result.provider, 'fast');
assert.deepEqual(calls, ['fast']);
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: FAIL because `createMedia` and the new CLI workflow are absent.

- [ ] **Step 3: Implement local orchestration functions and the single-file CLI entry**

Keep selection and execution in `media.cjs`. For automatic creation, gather sanitized skip reasons and throw `no_provider_available` only when no candidate was remotely accepted. For `generate`, call `create` once, poll the same Provider when queued/running, then save sources. For status/wait, select by exact manifest ID only. Accept JSON solely from stdin or `--request <path>`, print exactly one JSON object, and map stable errors to exit codes.

```js
async function createMedia(request, context = {}) {
  const entries = validateManifest(context.manifest || manifest);
  const explicit = request.provider !== undefined;
  const candidates = selectCandidates(entries, request, explicit);
  // Check configuration/support, call each eligible automatic candidate once,
  // and continue only when ProviderError.accepted === false.
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: PASS for Task 1 and Task 2 cases with no live network calls.

- [ ] **Step 5: Commit only Task 2 paths**

Run: `git commit --only --no-verify skills/media/tests/media.test.cjs skills/media/core/media.cjs -m "feat: orchestrate media providers"`

### Task 3: Shared Artifacts And Agnes Provider

**Files:**
- Modify: `skills/media/tests/media.test.cjs`
- Create: `skills/media/core/artifacts.cjs`
- Create: `skills/media/providers/agnes.cjs`
- Read/migrate: `skills/agnes-ai/scripts/agnes_api.cjs`
- Read/migrate: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Produces from `artifacts.cjs`: `preflightOutput(request, context)` and `saveArtifacts(sources, options, context)`.
- Produces from `agnes.cjs`: `{ isConfigured, supports, create, status }`.
- Agnes context injection retains controlled `fetch`, clock, filesystem/home/config inputs, and abort signals needed by offline tests.

- [ ] **Step 1: Write failing artifact and Agnes migration tests**

Port behavior-focused cases from the 58-test Agnes suite. Cover environment/file credential precedence and POSIX permission rejection; all five `.cn` request mappings; image/video response normalization; one-shot POST ambiguity with no retry and no fallback-safe acceptance claim; task status mapping; public HTTPS URL and redirect validation; private/localhost/credential URL rejection; Base64/bytes; `.part` plus atomic rename; non-overwrite paths; bounded idempotent download retry; partial failure cleanup; deadlines and abort signals.

```js
const outcome = await agnes.create({
  capability: 'text-to-image',
  prompt: 'studio product',
  inputs: [],
  parameters: {}
}, contextWithFetch(recordingFetch));
assert.equal(outcome.status, 'succeeded');
assert.equal(recorded.url, 'https://api.agnes-ai.cn/v1/images/generations');
```

- [ ] **Step 2: Run the focused test and verify RED**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: FAIL because `artifacts.cjs` and `providers/agnes.cjs` do not yet implement the migrated contracts.

- [ ] **Step 3: Extract artifact behavior and adapt Agnes behind the Provider contract**

Move only Provider-independent file and public-download behavior to `artifacts.cjs`. Adapt the existing `.cn` credentials, mappings, fetch boundaries, polling response parsing, timeout/abort behavior, and redaction into `agnes.cjs`. Do not retain a second orchestration flow or duplicate the coarse capability list inside Agnes.

```js
module.exports = {
  isConfigured,
  supports,
  create,
  status
};
```

- [ ] **Step 4: Run migration tests and the old suite for comparison**

Run: `node --test skills/media/tests/media.test.cjs`

Expected: PASS with meaningful coverage equal to or greater than the old behaviors; no live network requests.

Run before deleting the old directory: `node --test skills/agnes-ai/tests/agnes_api.test.cjs`

Expected: PASS, documenting that the source behavior being migrated remains understood.

- [ ] **Step 5: Commit only Task 3 paths**

Run: `git commit --only --no-verify skills/media/tests/media.test.cjs skills/media/core/artifacts.cjs skills/media/providers/agnes.cjs -m "feat: add Agnes media provider"`

### Task 4: Skill Migration, Documentation, And Final Verification

**Files:**
- Create: `skills/media/SKILL.md`
- Create: `skills/media/references/provider-contract.md`
- Create: `skills/media/references/agnes-api.md`
- Delete: `skills/agnes-ai/SKILL.md`
- Delete: `skills/agnes-ai/agents/openai.yaml`
- Delete: `skills/agnes-ai/evals/evals.json`
- Delete: `skills/agnes-ai/references/api.md`
- Delete: `skills/agnes-ai/references/provider-contract.md`
- Delete: `skills/agnes-ai/scripts/agnes_api.cjs`
- Delete: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Documents the commands `capabilities`, `generate`, `create`, `status`, and `wait`, stdin/`--request` request transport, the public request/result contract, credentials, Provider registration, priority uniqueness, and accepted-before-fallback rule.
- Removes the old Agnes CLI and all obsolete `agents/`, `scripts/`, and parallel skill metadata.

- [ ] **Step 1: Write concise skill and reference documents**

Make `SKILL.md` route image/video requests through `core/media.cjs`, show safe stdin/file examples, require explicit Provider/task pinning for status/wait, and state that live generation consumes quota. Document the four-function Provider API and literal manifest registration in `provider-contract.md`; retain verified Agnes `.cn` endpoint and credential details in `agnes-api.md`.

- [ ] **Step 2: Remove the old Agnes skill tree without a compatibility wrapper**

Delete only `skills/agnes-ai`. Confirm no runtime file imports the old path:

Run: `rg -n "skills/agnes-ai|agnes_api\.cjs|agents/openai\.yaml" skills/media`

Expected: no matches.

- [ ] **Step 3: Run complete offline verification**

Run:

```powershell
node --test skills/media/tests/media.test.cjs
node --check skills/media/core/contract.cjs
node --check skills/media/core/artifacts.cjs
node --check skills/media/core/media.cjs
node --check skills/media/providers/manifest.cjs
node --check skills/media/providers/agnes.cjs
node skills/media/core/media.cjs capabilities
git diff --check
rg -n "api[_-]?key|authorization|console\.(log|error)" skills/media
```

Expected: tests and syntax checks pass; capabilities returns Agnes at priority `100` plus the five capabilities; diff check is clean; security search contains only intentional credential resolution/header construction and controlled CLI output.

- [ ] **Step 4: Run available repository Skill validators**

Discover validators with `rg --files | rg "(validate|quick_validate).*skill|skill.*(validate|check)"`, run each applicable validator against `skills/media`, and record any validator that is unavailable rather than claiming it passed.

- [ ] **Step 5: Commit migration paths and verify commit isolation**

Run: `git commit --only --no-verify skills/media skills/agnes-ai -m "refactor: migrate Agnes to media providers"`

Run:

```powershell
git diff-tree --no-commit-id --name-status -r HEAD
git status --short
```

Expected: the commit includes only `skills/media` additions/changes and `skills/agnes-ai` deletions; the four unrelated user-staged changes remain staged and unmodified.

### Task 5: Independent Review And Closeout

**Files:**
- Review: all files under `skills/media`
- Review: deletion of `skills/agnes-ai`

**Interfaces:**
- Confirms the implementation matches the approved design and contains no correctness, fallback, security, or regression issue.

- [ ] **Step 1: Request an independent code review**

Ask the available review worker to inspect the final diff with emphasis on duplicate priority enforcement, explicit Provider behavior, acceptance ambiguity, task pinning, safe output preflight/downloads, Agnes `.cn` mappings, secret redaction, and missing regression tests.

- [ ] **Step 2: Resolve every actionable finding through TDD**

For each behavioral defect, add a focused failing `node:test` case, observe the expected RED, implement the smallest correction, and rerun the focused plus full suite. For documentation-only findings, edit only the affected prose.

- [ ] **Step 3: Re-run final verification and report residual risk**

Repeat Task 4 Steps 3-4 and inspect `git status --short --branch`. Report that all verification was offline and that a live quota-consuming Agnes smoke test was intentionally not run.
