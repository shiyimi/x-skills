# Agent Prompt Merge VNext Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a merged vNext system prompt plus supporting design docs without overwriting the two already modified source prompts.

**Architecture:** Preserve `ai-engineering-partner.md` as the primary skeleton, selectively import conflict-resolution, host-adaptation, and test-decision rules from `ai-prompt.md`, then add examples and availability-aware Skill routing. Create new files instead of editing the existing dirty prompt files.

**Tech Stack:** Markdown, repository prompt docs, PowerShell, git status, static review

---

### Task 1: Create the design artifact

**Files:**
- Create: `docs/plans/2026-04-07-agent-prompt-merge-design.md`

**Step 1: Confirm source inputs**

Run: `Get-Content -Raw prompts/ai-prompt.md` and `Get-Content -Raw prompts/ai-engineering-partner.md`

Expected: both files are readable and their role, workflow, and hard-constraint sections are visible.

**Step 2: Record the chosen merge direction**

Write the design doc with:

- chosen approach A
- rationale for using `ai-engineering-partner.md` as base
- the three areas imported from `ai-prompt.md`
- the decision to add examples
- the decision to create a new file instead of overwriting source files

**Step 3: Review the design doc**

Run: `Get-Content -Raw docs/plans/2026-04-07-agent-prompt-merge-design.md`

Expected: the file clearly states goals, decisions, non-goals, validation strategy, and output paths.

**Step 4: Optional commit**

Only if the user explicitly requests a commit:

```bash
git add docs/plans/2026-04-07-agent-prompt-merge-design.md
git commit -m "docs: add prompt merge design"
```

### Task 2: Create the implementation plan artifact

**Files:**
- Create: `docs/plans/2026-04-07-agent-prompt-merge.md`

**Step 1: Write the plan header**

Add the required header with:

- Goal
- Architecture
- Tech Stack

**Step 2: Break work into small execution tasks**

Include tasks for:

- writing the design doc
- creating the merged prompt file
- reviewing the merged prompt for contradictions
- running static validation

**Step 3: Review the plan file**

Run: `Get-Content -Raw docs/plans/2026-04-07-agent-prompt-merge.md`

Expected: the file is readable, action-oriented, and includes exact file paths.

**Step 4: Optional commit**

Only if the user explicitly requests a commit:

```bash
git add docs/plans/2026-04-07-agent-prompt-merge.md
git commit -m "docs: add prompt merge implementation plan"
```

### Task 3: Create the merged vNext prompt

**Files:**
- Create: `prompts/ai-engineering-consultant-vnext.md`
- Reference: `prompts/ai-prompt.md`
- Reference: `prompts/ai-engineering-partner.md`

**Step 1: Draft the merged structure**

Create sections for:

- role and positioning
- priority and conflict resolution
- hard constraints
- default strategy
- routing, grading, and test decisions
- workflow
- Skill routing
- host adaptation and output rules
- examples
- rule hardening

**Step 2: Merge only high-value rules**

Keep:

- concise role and tone from `ai-engineering-partner.md`
- conflict-resolution ordering from `ai-prompt.md`
- capability degradation and host adaptation from `ai-prompt.md`
- test-decision logic from `ai-prompt.md`

Do not re-import every detailed workflow phrase from the source files.

**Step 3: Add boundary examples**

Write examples for:

- missing information
- debugging before fixing
- findings-first review output
- high-risk action confirmation

**Step 4: Review wording for prompt fitness**

Check that the merged prompt reads like a usable system prompt, not a bloated SOP.

**Step 5: Optional commit**

Only if the user explicitly requests a commit:

```bash
git add prompts/ai-engineering-consultant-vnext.md
git commit -m "docs: add merged engineering consultant prompt"
```

### Task 4: Run static validation

**Files:**
- Review: `prompts/ai-engineering-consultant-vnext.md`
- Review: `docs/plans/2026-04-07-agent-prompt-merge-design.md`
- Review: `docs/plans/2026-04-07-agent-prompt-merge.md`

**Step 1: Validate the prompt sections**

Run:

```bash
rg -n "^## |^### " prompts/ai-engineering-consultant-vnext.md
```

Expected: all major sections exist and appear in a coherent order.

**Step 2: Validate key boundary terms**

Run:

```bash
rg -n "未执行项|残余风险|禁止编造|高风险|Skill|示例" prompts/ai-engineering-consultant-vnext.md
```

Expected: the merged prompt includes explicit verification language, hard constraints, Skill routing, and examples.

**Step 3: Validate no source file overwrite**

Run:

```bash
git status --short
```

Expected: the new files are added, and the original prompt files remain untouched by this task.

**Step 4: Report residual risk**

Document that no live model A/B test was run, so the result is statically reviewed but not behaviorally proven.
