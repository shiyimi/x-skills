# Agnes AI Media Skill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and verify a Codex skill that generates Agnes images and videos, downloads artifacts locally, and emits a stable provider result contract.

**Architecture:** A lean `SKILL.md` routes media intents into one dependency-free CommonJS CLI. The CLI exports testable pure mapping/error functions and injected I/O workflows while its direct-execution path reads JSON, resolves credentials, calls the fixed Agnes API, polls videos, downloads artifacts, and prints one normalized JSON result.

**Tech Stack:** Node.js 18+ built-ins (`fetch`, `node:test`, `fs`, `stream`, `crypto`), CommonJS, Markdown skill resources, OpenAI skill validator.

## Global Constraints

- Use `https://api.agnes-ai.cn` as the fixed API root.
- Support only image generation/editing and video generation/status/waiting in the first release.
- Resolve `AGNES_API_KEY` before `~/.config/agnes/api_key`; never accept a key in CLI arguments.
- Use no third-party runtime or test dependencies.
- Never automatically retry image-generation or video-creation POST requests.
- Download outputs locally and never send the Agnes authorization header to artifact URLs.
- Keep all provider execution logic in `skills/agnes-ai/scripts/agnes_api.cjs`; do not create shared runtime code.

---

### Task 1: Skill Skeleton, Credentials, And Request Mapping

**Files:**
- Create: `skills/agnes-ai/SKILL.md`
- Create: `skills/agnes-ai/agents/openai.yaml`
- Create: `skills/agnes-ai/scripts/agnes_api.cjs`
- Create: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Produces: `resolveCredentials({ env, homeDir, platform, fsApi }) -> string`
- Produces: `buildImageRequest(request, { readFile, stat }) -> Promise<object>`
- Produces: `buildVideoRequest(request) -> object`
- Produces: `normalizeStatus(status) -> "queued"|"running"|"succeeded"|"failed"`

- [ ] **Step 1: Initialize the skill skeleton**

Run the system `init_skill.py` with name `agnes-ai`, output directory `skills`, resources `scripts,references`, and UI fields:

```powershell
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\init_skill.py agnes-ai --path skills --resources scripts,references --interface "display_name=Agnes AI Media" --interface "short_description=Generate and download images and videos with Agnes AI" --interface "default_prompt=Use Agnes AI to generate the requested image or video and save the result locally."
```

Expected: `skills/agnes-ai/SKILL.md` and `skills/agnes-ai/agents/openai.yaml` exist; no Agnes API call occurs.

- [ ] **Step 2: Write failing credential and mapping tests**

Create tests using `node:test` and `node:assert/strict` that assert:

```js
const envCredentialDeps = makeCredentialDeps({ envValue: ' env-key ', fileValue: 'file-key' });
const fileCredentialDeps = makeCredentialDeps({ envValue: undefined, fileValue: 'file-key' });
assert.equal(resolveCredentials(envCredentialDeps), 'env-key');
assert.equal(resolveCredentials(fileCredentialDeps), 'file-key');
await assert.rejects(() => buildImageRequest(localImageRequest, deps), /unsupported image type/i);
assert.deepEqual((await buildImageRequest(textToImageRequest, deps)).extra_body, { response_format: 'url' });
assert.equal(buildVideoRequest(defaultVideoRequest).num_frames, 121);
assert.throws(
  () => buildVideoRequest(Object.assign({}, defaultVideoRequest, { parameters: { num_frames: 120 } })),
  /8n \+ 1/
);
assert.equal(normalizeStatus('in_progress'), 'running');
```

Define `makeCredentialDeps({ envValue, fileValue })` in the test file to return explicit `env`, `homeDir`, `platform`, and `fsApi.readFileSync/statSync` fixtures. Use temporary directories and injected `fsApi`; never read the user's real credential file.

- [ ] **Step 3: Run the test and verify RED**

Run:

```powershell
node --test skills/agnes-ai/tests/agnes_api.test.cjs
```

Expected: FAIL because `scripts/agnes_api.cjs` does not yet export the required functions.

- [ ] **Step 4: Implement the minimal credential and mapping functions**

Implement constants and exports in `agnes_api.cjs`:

```js
const API_ROOT = 'https://api.agnes-ai.cn';
const IMAGE_MODELS = new Set(['agnes-image-2.0-flash', 'agnes-image-2.1-flash']);
const VIDEO_MODEL = 'agnes-video-v2.0';

module.exports = {
  resolveCredentials,
  buildImageRequest,
  buildVideoRequest,
  normalizeStatus
};
```

Map image inputs under `extra_body.image`, place `response_format: "url"` under `extra_body`, convert local PNG/JPEG/WEBP bytes to Data URIs, and reject local video inputs. Enforce non-empty prompts and video frame/rate boundaries only at the request boundary.

- [ ] **Step 5: Run the test and verify GREEN**

Run `node --test skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: all Task 1 tests PASS with no warnings.

- [ ] **Step 6: Commit Task 1**

```powershell
git add skills/agnes-ai
git commit -m "feat: add Agnes media request mapping"
```

### Task 2: HTTP Boundary And Error Contract

**Files:**
- Modify: `skills/agnes-ai/scripts/agnes_api.cjs`
- Modify: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Consumes: request bodies from Task 1
- Produces: `classifyHttpError(status, body) -> ProviderError`
- Produces: `requestJson({ method, path, apiKey, body, fetchImpl }) -> Promise<object>`
- Produces: `withTransientRetry(operation, options) -> Promise<any>` for idempotent GET operations only

- [ ] **Step 1: Write failing HTTP/error tests**

Add table-driven assertions:

```js
assert.equal(classifyHttpError(401, {}).kind, 'authentication');
assert.equal(classifyHttpError(402, {}).kind, 'quota_exhausted');
assert.equal(classifyHttpError(429, {}).retryable, true);
assert.equal(classifyHttpError(503, {}).kind, 'provider_unavailable');
```

Use an injected fetch function to assert `requestJson` sends bearer auth only to `https://api.agnes-ai.cn`, parses JSON once, and does not retry a POST whose fetch throws. Test an idempotent retry operation that fails twice with a retryable error and succeeds on the third call.

- [ ] **Step 2: Run the focused tests and verify RED**

Run `node --test --test-name-pattern="HTTP|retry|error" skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: FAIL because the HTTP/error functions are missing.

- [ ] **Step 3: Implement HTTP and sanitized errors**

Implement `ProviderError extends Error` with `kind`, `retryable`, `httpStatus`, and sanitized `details`. `requestJson` must build URLs from the fixed `API_ROOT`, set `Authorization` and JSON content type, classify non-2xx responses, and turn malformed success bodies into `invalid_response`. `withTransientRetry` must accept an injected sleep/random function and must never be called around generation POSTs.

- [ ] **Step 4: Run the complete test file and verify GREEN**

Run `node --test skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: all tests PASS and no output contains the injected secret value.

- [ ] **Step 5: Commit Task 2**

```powershell
git add skills/agnes-ai/scripts/agnes_api.cjs skills/agnes-ai/tests/agnes_api.test.cjs
git commit -m "feat: add Agnes API error handling"
```

### Task 3: Artifact Download And Image Workflow

**Files:**
- Modify: `skills/agnes-ai/scripts/agnes_api.cjs`
- Modify: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Produces: `downloadArtifact(source, destination, deps) -> Promise<Artifact>`
- Produces: `saveBase64Artifact(base64, destination, mimeType, deps) -> Promise<Artifact>`
- Produces: `runImage(request, deps) -> Promise<ProviderResult>`

- [ ] **Step 1: Write failing artifact and image workflow tests**

Test that URL downloads use a second fetch call with no `Authorization` header, write `result-01.png.part`, rename atomically, and report MIME type and byte count. Test Base64 decoding and rejection of HTML content. Test two-image output where the first artifact remains in the returned error details when the second download fails.

Use real temporary files and Web `Response` objects; inject only network responses and time.

- [ ] **Step 2: Verify RED**

Run `node --test --test-name-pattern="artifact|image workflow" skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: FAIL because download and image workflow functions are missing.

- [ ] **Step 3: Implement atomic artifact storage and image execution**

Stream URL bodies through `Readable.fromWeb(response.body)` into a `.part` file, then rename. Map only supported image/video content types to extensions. For Base64, decode into a buffer and reject empty data. Create directories under `<output>/agnes/<UTC>-<safe-id>`. `runImage` must make exactly one generation POST and process every `data[]` entry containing either `url` or `b64_json`.

- [ ] **Step 4: Verify GREEN**

Run `node --test skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: all tests PASS; temporary `.part` files are absent after both success and handled failure.

- [ ] **Step 5: Commit Task 3**

```powershell
git add skills/agnes-ai/scripts/agnes_api.cjs skills/agnes-ai/tests/agnes_api.test.cjs
git commit -m "feat: download Agnes image artifacts"
```

### Task 4: Resumable Video State Machine

**Files:**
- Modify: `skills/agnes-ai/scripts/agnes_api.cjs`
- Modify: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Produces: `createVideo(request, deps) -> Promise<ProviderResult>`
- Produces: `getVideoStatus(videoId, deps) -> Promise<ProviderResult>`
- Produces: `waitForVideo(request, deps) -> Promise<ProviderResult>`
- Produces: `runVideo(request, deps) -> Promise<ProviderResult>`

- [ ] **Step 1: Write failing state-machine tests**

Cover:

```text
queued -> in_progress -> completed -> download metadata.url
queued -> failed -> task_failed
queued -> local timeout -> wait_timeout with reusable video_id
create response without video_id -> invalid_response
```

Assert `runVideo` calls video creation once even when polling encounters retryable failures. Assert status polling uses `/agnesapi?video_id=` and preserves returned `size`, `seconds`, and `metadata.size_mapping`.

- [ ] **Step 2: Verify RED**

Run `node --test --test-name-pattern="video" skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: FAIL because video workflow functions are missing.

- [ ] **Step 3: Implement create, status, wait, and combined generation**

Create video with one POST. Poll via retryable GET using `video_id`, normalize provider states, and use injected clock/sleep/random functions. On completion, download `metadata.url`; on local timeout, return an error envelope containing the latest task state and `video_id` without throwing away recovery data.

- [ ] **Step 4: Verify GREEN**

Run `node --test skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: all tests PASS, including the assertion that the create POST count is exactly one.

- [ ] **Step 5: Commit Task 4**

```powershell
git add skills/agnes-ai/scripts/agnes_api.cjs skills/agnes-ai/tests/agnes_api.test.cjs
git commit -m "feat: add resumable Agnes video generation"
```

### Task 5: CLI Contract

**Files:**
- Modify: `skills/agnes-ai/scripts/agnes_api.cjs`
- Modify: `skills/agnes-ai/tests/agnes_api.test.cjs`

**Interfaces:**
- Produces: `parseCli(argv) -> { domain, action, requestPath }`
- Produces: `readRequest({ requestPath, stdin, fsApi }) -> Promise<object>`
- Produces: `exitCodeForError(error) -> number`
- Produces: direct execution through `main()`

- [ ] **Step 1: Write failing CLI tests**

Spawn the CLI for `capabilities` and invalid command cases. Test request-file and stdin JSON parsing without making network calls. Assert stdout contains exactly one parseable JSON object, diagnostics never contain a supplied secret, and the documented exit code is used for each error category.

- [ ] **Step 2: Verify RED**

Run `node --test --test-name-pattern="CLI|capabilities|exit code" skills/agnes-ai/tests/agnes_api.test.cjs`.

Expected: FAIL because direct CLI execution and parsing are incomplete.

- [ ] **Step 3: Implement CLI dispatch**

Dispatch exactly these forms:

```text
capabilities
image generate
video create
video status
video wait
video generate
```

Accept only `--request <path>` as an option; otherwise read stdin. Print one JSON object with `JSON.stringify(result)` and set `process.exitCode` instead of calling `process.exit`. Convert thrown errors to normalized envelopes before printing.

- [ ] **Step 4: Verify GREEN**

Run:

```powershell
node --test skills/agnes-ai/tests/agnes_api.test.cjs
node skills/agnes-ai/scripts/agnes_api.cjs capabilities
```

Expected: tests PASS and `capabilities` prints an `ok: true` JSON result listing all five media capabilities.

- [ ] **Step 5: Commit Task 5**

```powershell
git add skills/agnes-ai/scripts/agnes_api.cjs skills/agnes-ai/tests/agnes_api.test.cjs
git commit -m "feat: expose Agnes media CLI"
```

### Task 6: Skill Instructions, References, Evals, And Validation

**Files:**
- Modify: `skills/agnes-ai/SKILL.md`
- Modify: `skills/agnes-ai/agents/openai.yaml`
- Create: `skills/agnes-ai/references/api.md`
- Create: `skills/agnes-ai/references/provider-contract.md`
- Create: `skills/agnes-ai/evals/evals.json`

**Interfaces:**
- Consumes: CLI command and JSON contracts from Tasks 1-5
- Produces: discoverable skill instructions and three realistic evaluation prompts

- [ ] **Step 1: Write SKILL.md and progressive references**

Keep frontmatter to `name` and `description`. Make the description trigger on Agnes requests and image/video generation where Agnes is selected. In the body, route intents to the exact CLI commands, require local artifact reporting, explain credential setup, and link directly to both reference files. Put detailed model fields and current endpoint facts in `api.md`; put normalized request/result/error shapes in `provider-contract.md`.

- [ ] **Step 2: Generate and verify UI metadata**

Run the skill-creator metadata generator with the approved interface values:

```powershell
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\generate_openai_yaml.py skills/agnes-ai --interface "display_name=Agnes AI Media" --interface "short_description=Generate and download images and videos with Agnes AI" --interface "default_prompt=Use Agnes AI to generate the requested image or video and save the result locally."
```

- [ ] **Step 3: Add realistic eval prompts**

Create `evals/evals.json` containing requests for a local-file image edit, a text-to-video job, and resuming a known `video_id`. Expected outputs must require the appropriate CLI workflow, a normalized JSON result, and locally downloaded artifacts where the task completes.

- [ ] **Step 4: Run structural and behavioral validation**

Run:

```powershell
python C:\Users\Administrator\.codex\skills\.system\skill-creator\scripts\quick_validate.py skills/agnes-ai
node --test skills/agnes-ai/tests/agnes_api.test.cjs
node skills/agnes-ai/scripts/agnes_api.cjs capabilities
git diff --check
```

Expected: validator succeeds, all offline tests pass, capabilities JSON is valid, and diff check is clean.

- [ ] **Step 5: Commit Task 6**

```powershell
git add skills/agnes-ai
git commit -m "docs: complete Agnes AI media skill"
```

### Task 7: Completion Audit

**Files:**
- Inspect: `docs/superpowers/specs/2026-07-30-agnes-ai-media-skill-design.md`
- Inspect: `skills/agnes-ai/**`

**Interfaces:**
- Consumes: all implementation artifacts and test output
- Produces: evidence that every acceptance criterion is satisfied or an explicit residual-risk report

- [ ] **Step 1: Review the final diff for contract and security regressions**

Confirm the API host is `.cn`, no key is accepted on argv, artifact downloads omit authorization, POST workflows have no retry wrapper, video timeouts preserve `video_id`, and no unrelated working-tree paths are staged.

- [ ] **Step 2: Re-run the complete verification set from a clean process**

Run the four Task 6 validation commands again and inspect their actual exit codes and output.

- [ ] **Step 3: Record live-test status accurately**

If no real `AGNES_API_KEY` call was explicitly authorized, state that API behavior is verified offline against current official documentation and fixtures, but no quota-consuming live generation was run.

- [ ] **Step 4: Commit any review fixes with their regression tests**

For each discovered bug, first add a test that fails for the bug, then implement the fix, rerun the complete suite, and commit only the scoped Agnes files.
