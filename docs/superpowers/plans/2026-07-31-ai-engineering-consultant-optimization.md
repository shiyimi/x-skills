# AI Engineering Consultant Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine `prompts/ai-engineering-consultant.md` into one domain-neutral engineering prompt that controls complexity, defines global/module boundaries, preserves key information, and applies risk-matched verification.

**Architecture:** Keep one prompt file. Retain its S/M/L risk model, approval gate, and verification discipline; incorporate the approved boundary and abstraction principles from historical sources; remove fixed output templates and all MOM/React, RIPER, skill-automation, and Git-operation behavior.

**Tech Stack:** Markdown prompt engineering; PowerShell static validation; Git whitespace checks.

## Global Constraints

- Modify only `prompts/ai-engineering-consultant.md` during implementation.
- Do not delete, rename, stage, commit, push, or otherwise alter other historical prompt files.
- The prompt must remain domain-neutral and must not prescribe a framework, library, or product domain.
- User and repository instructions remain above this prompt; this prompt remains above default technical preferences.
- Do not require a fixed response template, fixed number of alternatives, explicit modes, process documents, or automatic Git actions.

---

### Task 1: Rewrite the engineering consultant prompt

**Files:**
- Modify: `prompts/ai-engineering-consultant.md`

**Interfaces:**
- Consumes: `docs/superpowers/specs/2026-07-31-ai-engineering-consultant-design.md` and the current `prompts/ai-engineering-consultant.md`.
- Produces: A single self-contained domain-neutral consultant prompt organized from user value through risk, boundaries, minimal units/interfaces, and verification evidence.

- [ ] **Step 1: Read the approved design and source prompts**

Run:

```powershell
Get-Content -Raw 'docs\superpowers\specs\2026-07-31-ai-engineering-consultant-design.md'
Get-Content -Raw 'prompts\ai-engineering-consultant.md'
```

Expected: The implementation source is limited to the approved design and the current consultant prompt.

- [ ] **Step 2: Replace the prompt with the approved five-part structure**

Write these sections in order after the role and scope preamble:

```text
1. User goals and product value
2. Correctness and risk
3. Global/module boundaries
4. Minimal functional units and stable interfaces
5. Implementation, verification, and delivery evidence
```

The five sections must state: clarify user value before choosing a path; lower complexity through effective encapsulation; classify global coordination separately from module internals; use minimal complete functional/testable units; expose stable minimal data contracts; avoid over-abstraction; keep key contracts and verification evidence visible while hiding local implementation details; preserve product usability.

The execution section must route review, debugging, planning, explanation, and implementation; it must use risk- and task-matched verification rather than blanket testing policy.

- [ ] **Step 3: Review the rewritten prompt against the approved design**

Check each requirement in the design document has a corresponding prompt rule, and verify the final prompt does not include MOM/MES, React, library preferences, RIPER modes, automatic Git operations, fixed response templates, or compulsory skill creation.

Expected: Every approved requirement is represented once, with no conflicting ownership between sections.

### Task 2: Validate prompt structure and scope

**Files:**
- Verify: `prompts/ai-engineering-consultant.md`

**Interfaces:**
- Consumes: The rewritten consultant prompt and its approved design.
- Produces: Static evidence that the prompt is structurally valid, has no prohibited legacy directives, and covers the agreed scenario set.

- [ ] **Step 1: Run static prohibited-content and required-concept checks**

Run:

```powershell
rg -n "MOM|MES|React|Zustand|Jotai|React Query|Tailwind|AntD|RIPER|\[MODE:|git add|git commit|git checkout|任务文件|固定.*Header" prompts/ai-engineering-consultant.md
rg -n "降低复杂度|有效封装|分类|全局|模块|最小.*功能|最小.*测试|数据接口|AI 编码|产品视角|分级|批准|验证" prompts/ai-engineering-consultant.md
```

Expected: The prohibited-content scan returns no matches; the required-concept scan returns evidence for every named concept.

- [ ] **Step 2: Run formatting and scenario checks**

Run:

```powershell
git diff --check -- prompts/ai-engineering-consultant.md
```

Manually map the prompt against the eleven cases in the approved design: simple configuration, reversible cross-module work, breaking public API, pure-function regression, UI copy, review, uncertain root cause, scope expansion, minimal module contract, AI-generated cross-module change, and user-visible flow.

Expected: No whitespace errors; each case maps to a task-routing, boundary, product, or verification rule.

- [ ] **Step 3: Report verification without committing**

Run:

```powershell
git status --short -- prompts/ai-engineering-consultant.md docs/superpowers
```

Expected: Only the consultant prompt and the approved planning/specification documents are changed or untracked. Do not stage, commit, or push.
