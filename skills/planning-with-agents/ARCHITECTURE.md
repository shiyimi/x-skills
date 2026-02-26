# Planning-with-Agents: Architecture Design

**Version**: 1.0.0
**Last Updated**: 2026-01-06
**Status**: Implementation Complete (Phase 1-3)

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Core Components](#core-components)
3. [Data Flow](#data-flow)
4. [File System Architecture](#file-system-architecture)
5. [State Management](#state-management)
6. [Scheduling Algorithm](#scheduling-algorithm)
7. [Error Handling](#error-handling)
8. [Resource Management](#resource-management)
9. [Observability](#observability)
10. [Design Decisions](#design-decisions)
11. [Future Enhancements](#future-enhancements)

---

## System Overview

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Master Agent                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Task Planner │→│  Decomposer  │→│   Scheduler  │          │
│  └──────────────┘  └──────────────┘  └──────┬───────┘          │
│                                              ↓                   │
│                                    ┌─────────────────┐          │
│                                    │ Resource Manager│          │
│                                    └────────┬────────┘          │
└─────────────────────────────────────────────┼──────────────────┘
                                              ↓
                        ┌─────────────────────────────────┐
                        │    Sub-Agent Orchestration      │
                        └─────────┬───────────────────────┘
                                  ↓
        ┌─────────────────────────┼─────────────────────────┐
        ↓                         ↓                         ↓
┌───────────────┐         ┌───────────────┐        ┌───────────────┐
│ Sub-Agent 1   │         │ Sub-Agent 2   │        │ Sub-Agent 3   │
│               │         │               │        │               │
│ ┌───────────┐ │         │ ┌───────────┐ │        │ ┌───────────┐ │
│ │ Executor  │ │         │ │ Executor  │ │        │ │ Executor  │ │
│ └───────────┘ │         │ └───────────┘ │        │ └───────────┘ │
│ ┌───────────┐ │         │ ┌───────────┐ │        │ ┌───────────┐ │
│ │  Status   │ │         │ │  Status   │ │        │ │  Status   │ │
│ │  Tracker  │ │         │ │  Tracker  │ │        │ │  Tracker  │ │
│ └───────────┘ │         │ └───────────┘ │        │ └───────────┘ │
└───────────────┘         └───────────────┘        └───────────────┘
        ↓                         ↓                         ↓
        └─────────────────────────┼─────────────────────────┘
                                  ↓
                        ┌─────────────────┐
                        │ Debug Agent     │
                        │ (on failure)    │
                        └─────────────────┘
```

### Key Principles

1. **Separation of Concerns**: Master handles orchestration, subs handle execution
2. **State-Based Communication**: YAML status files as contract between agents
3. **DAG Scheduling**: Dependency-aware execution order
4. **Context Isolation**: Each agent has independent workspace
5. **Fail-Safe Design**: Errors isolated, debug agents for recovery

---

## Core Components

### 1. Master Agent

**Responsibilities**:
- Overall task planning and decomposition
- Dependency graph creation and validation
- Sub-agent lifecycle management
- Result aggregation
- Resource limit enforcement

**Key Files**:
- `.memory/task_plan.md`: Master's planning document
- `.memory/notes.md`: Research and findings
- `.memory/dependencies.yaml`: Execution graph
- `.memory/deliverable.md`: Final aggregated output

### 2. Sub-Agent Trigger System

**Components**:

#### a. Semantic Matcher
```python
class SemanticMatcher:
    def matches(self, task_description, config):
        # Keyword matching
        for keyword in config.keywords:
            if keyword.lower() in task_description.lower():
                return True, f"Keyword: {keyword}"

        # Regex pattern matching
        for pattern in config.patterns:
            if re.search(pattern, task_description, re.IGNORECASE):
                return True, f"Pattern: {pattern}"

        return False, None
```

#### b. Complexity Analyzer
```python
class ComplexityAnalyzer:
    def analyze(self, task_plan, config):
        metrics = {
            "phase_count": count_phases(task_plan),
            "estimated_hours": estimate_duration(task_plan),
            "file_count": estimate_files(task_plan),
            "description_tokens": count_tokens(task_description)
        }

        exceeds_threshold = (
            metrics["phase_count"] > config.max_phases or
            metrics["estimated_hours"] > config.estimated_hours or
            metrics["file_count"] > config.file_count
        )

        return exceeds_threshold, metrics
```

#### c. AI Fallback Judge
```python
class AIJudge:
    def should_decompose(self, task_description, metrics):
        prompt = config.ai_fallback.prompt_template.format(
            task_description=task_description,
            phase_count=metrics["phase_count"],
            file_count=metrics["file_count"]
        )

        response = query_claude(prompt)
        decision = parse_decision(response)  # Extract yes/no + rationale

        return decision
```

### 3. Task Decomposer

**Functionality**:
- Break complex tasks into sub-tasks
- Identify dependencies between sub-tasks
- Generate unique agent IDs
- Create dependency graph

**Algorithm**:
```python
class TaskDecomposer:
    def decompose(self, task_description, task_plan):
        # 1. Identify major components
        components = extract_components(task_description, task_plan)

        # 2. For each component, create a sub-task
        sub_tasks = []
        for component in components:
            agent_id = generate_agent_id(component.description)
            sub_task = {
                "agent_id": agent_id,
                "task": component.description,
                "depends_on": component.dependencies,
                "priority": component.priority,
                "estimated_duration_minutes": component.estimate
            }
            sub_tasks.append(sub_task)

        # 3. Validate dependencies
        validate_dependencies(sub_tasks)

        # 4. Generate execution plan
        execution_plan = compute_execution_plan(sub_tasks)

        return sub_tasks, execution_plan
```

### 4. DAG Scheduler

**Core Algorithm**: Topological Sort + Parallel Execution

```python
import graphlib
import asyncio
from typing import List, Dict

class DAGScheduler:
    def __init__(self, dependencies: List[Dict], config):
        self.dependencies = dependencies
        self.config = config
        self.graph = self._build_graph()

    def _build_graph(self):
        """Build dependency graph for topological sort"""
        graph = {}
        for dep in self.dependencies:
            agent_id = dep["agent_id"]
            depends_on = dep["depends_on"]
            graph[agent_id] = set(depends_on)
        return graph

    def validate(self):
        """Detect circular dependencies"""
        try:
            ts = graphlib.TopologicalSorter(self.graph)
            ts.prepare()
            return True, None
        except graphlib.CycleError as e:
            return False, f"Circular dependency: {e}"

    async def execute(self):
        """Execute agents in dependency order with parallelism"""
        ts = graphlib.TopologicalSorter(self.graph)
        ts.prepare()

        active_agents = []
        results = {}

        while ts.is_active():
            # Get agents ready to run (all dependencies met)
            ready = ts.get_ready()

            # Launch up to max_concurrent_agents
            for agent_id in ready:
                if len(active_agents) < self.config.max_concurrent_agents:
                    task = asyncio.create_task(
                        self.launch_agent(agent_id)
                    )
                    active_agents.append((agent_id, task))

            # Wait for at least one to complete
            if active_agents:
                done, pending = await asyncio.wait(
                    [task for _, task in active_agents],
                    return_when=asyncio.FIRST_COMPLETED
                )

                for task in done:
                    # Find which agent completed
                    agent_id, _ = next(
                        (aid, t) for aid, t in active_agents if t == task
                    )

                    result = await task
                    results[agent_id] = result

                    # Mark as done in topological sorter
                    ts.done(agent_id)

                    # Remove from active list
                    active_agents = [
                        (aid, t) for aid, t in active_agents if t != task
                    ]

        return results

    async def launch_agent(self, agent_id):
        """Launch a single sub-agent"""
        # Read task info from dependencies.yaml
        task_info = self.get_task_info(agent_id)

        # Prepare context
        context = self.prepare_context(agent_id)

        # Use Task tool to launch agent
        result = await invoke_task_tool(
            subagent_type=self.determine_agent_type(task_info),
            description=task_info["task"],
            prompt=self.build_agent_prompt(agent_id, task_info, context)
        )

        return result
```

### 5. Status File Manager

**Purpose**: Manage state communication between agents

```python
class StatusFileManager:
    def __init__(self, agent_id, workspace_path):
        self.agent_id = agent_id
        self.status_file = f"{workspace_path}/.agent_status.yaml"

    def create(self, task_description, parent_id, depth):
        """Initialize status file"""
        status = {
            "agent_id": self.agent_id,
            "task_description": task_description,
            "status": "pending",
            "parent_agent": parent_id,
            "depth": depth,
            "created_at": datetime.utcnow().isoformat() + "Z",
            "updated_at": datetime.utcnow().isoformat() + "Z",
            # ... rest of template
        }
        write_yaml(self.status_file, status)

    def update_status(self, new_status):
        """Update agent status"""
        status = read_yaml(self.status_file)
        status["status"] = new_status
        status["updated_at"] = datetime.utcnow().isoformat() + "Z"

        if new_status == "in-progress":
            status["started_at"] = status["updated_at"]
        elif new_status == "completed":
            status["completed_at"] = status["updated_at"]
            status["execution_time_seconds"] = self.calculate_duration(status)

        write_yaml(self.status_file, status)

    def add_artifact(self, path, type, description, size_bytes):
        """Record output artifact"""
        status = read_yaml(self.status_file)
        artifact = {
            "path": path,
            "type": type,
            "description": description,
            "size_bytes": size_bytes
        }
        status["artifacts"].append(artifact)
        write_yaml(self.status_file, status)

    def record_error(self, error_type, message, stack_trace=None):
        """Record execution error"""
        status = read_yaml(self.status_file)
        error = {
            "error_type": error_type,
            "message": message,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "stack_trace": stack_trace
        }
        status["errors"].append(error)
        status["status"] = "failed"
        write_yaml(self.status_file, status)
```

### 6. Debug Agent System

**Trigger Logic**:
```python
def handle_agent_failure(agent_id, status):
    if not config.failure_handling.debug_agent_enabled:
        return retry_or_fail(agent_id, status)

    if status.depth >= config.resource_limits.max_depth:
        log_warning(f"Cannot debug: max depth reached")
        return retry_or_fail(agent_id, status)

    # Launch debug agent
    debug_agent_id = f"{agent_id}-debug"
    debug_result = launch_debug_agent(debug_agent_id, agent_id, status)

    if debug_result.retry_suggested:
        # Apply suggested fixes
        apply_fixes(debug_result.recommendations)

        # Retry original agent
        return retry_agent(agent_id)
    else:
        return mark_as_failed(agent_id)
```

**Debug Agent Prompt Template**:
```python
def build_debug_prompt(failed_agent_id, status):
    return f"""
    Agent {failed_agent_id} has failed with the following error:

    **Error Type**: {status.errors[0].error_type}
    **Error Message**: {status.errors[0].message}

    **Failed Agent's Context**:
    - Task: {status.task_description}
    - Workspace: .memory/agent-{failed_agent_id}/
    - Files available:
      - .agent_status.yaml (status and errors)
      - task_plan.md (agent's plan)
      - notes.md (agent's notes)
      - Any partial output files

    **Your Mission**:
    1. Read and analyze all available context
    2. Identify the root cause of the failure
    3. Determine if this is:
       - A dependency issue (missing packages, tools)
       - A code error (syntax, logic)
       - A configuration issue
       - A resource issue (timeout, memory)
       - Other
    4. Provide specific, actionable recommendations
    5. Indicate if retry is recommended after fixes

    **Output Format**:
    Update your .agent_status.yaml with:
    - diagnosis.error_type
    - diagnosis.root_cause
    - diagnosis.affected_files
    - recommendations (list of fix actions)
    - retry_suggested (true/false)

    **Constraints**:
    - You CANNOT create sub-agents
    - Timeout: {config.debug_agent_timeout_minutes} minutes
    - Focus on diagnosis, not implementation

    Begin analysis now.
    """
```

### 7. Context Builder

**Purpose**: Prepare context for sub-agents

```python
class ContextBuilder:
    def build_context(self, agent_id, config):
        context = {
            "global_context": self.get_global_context(),
            "parent_decisions": self.get_parent_decisions(),
            "sibling_results": self.get_sibling_results(agent_id),
            "research_notes": self.get_research_notes(),
            "technical_stack": self.get_technical_stack(),
            "project_structure": self.get_project_structure(),
            "agent_instructions": self.get_specific_instructions(agent_id)
        }

        # Enforce size limits
        context_size = estimate_tokens(context)
        if context_size > config.max_context_size_tokens:
            context = self.summarize_context(
                context,
                target_tokens=config.summary_target_tokens
            )

        return context

    def get_sibling_results(self, agent_id):
        """Get results from agents this one depends on"""
        deps = read_yaml(".memory/dependencies.yaml")
        agent_deps = next(
            d for d in deps["dependencies"] if d["agent_id"] == agent_id
        )

        sibling_results = []
        for dep_id in agent_deps["depends_on"]:
            dep_status = read_yaml(f".memory/agent-{dep_id}/.agent_status.yaml")

            if config.sibling_results_format == "summary_only":
                sibling_results.append({
                    "agent_id": dep_id,
                    "task": dep_status["task_description"],
                    "status": dep_status["status"],
                    "summary": dep_status["summary"],
                    "artifacts": [a["path"] for a in dep_status["artifacts"]]
                })
            else:
                # Full details
                sibling_results.append(dep_status)

        return sibling_results
```

---

## Data Flow

### 1. Task Submission to Completion

```
┌──────────────────────────────────────────────────────────────┐
│ 1. User submits task                                         │
│    "Build full-stack e-commerce app"                         │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. Master creates task_plan.md                               │
│    - Analyze task                                            │
│    - Research requirements                                   │
│    - Document in notes.md                                    │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. Trigger Evaluation                                        │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│    │ Semantic     │→│ Complexity   │→│ AI Fallback  │     │
│    │ Matcher      │  │ Analyzer     │  │ Judge        │     │
│    └──────────────┘  └──────────────┘  └──────────────┘     │
│    Decision: ACTIVATE sub-agents                             │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. Task Decomposition                                        │
│    - Identify: Frontend, Backend, Database, Tests            │
│    - Create dependencies.yaml                                │
│    - Validate: No cycles                                     │
│    - Generate execution plan                                 │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. Workspace Setup                                           │
│    For each sub-agent:                                       │
│    - Generate agent ID (hash)                                │
│    - Create .memory/agent-{id}/ directory                    │
│    - Initialize .agent_status.yaml (status: pending)         │
│    - Prepare context.yaml                                    │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 6. DAG Scheduling                                            │
│    Level 0: [Backend API design] (no deps)                   │
│       ↓                                                       │
│    Level 1: [Frontend, Database] (parallel, depend on L0)    │
│       ↓                                                       │
│    Level 2: [Integration Tests] (depends on L1)              │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 7. Parallel Execution                                        │
│    - Launch Level 0 agents                                   │
│    - Poll status files                                       │
│    - When L0 completes → launch L1 (parallel)                │
│    - Continue until all levels complete                      │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 8. Result Aggregation                                        │
│    - Read all .agent_status.yaml files                       │
│    - Collect deliverables from each agent                    │
│    - Synthesize into master deliverable.md                   │
│    - Generate performance report                             │
└───────────────────────┬──────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────────────────┐
│ 9. Completion                                                │
│    - Update master task_plan.md (all phases ✓)               │
│    - Generate agent tree view                                │
│    - Generate Mermaid diagram                                │
│    - Present final deliverable to user                       │
└──────────────────────────────────────────────────────────────┘
```

### 2. Error Recovery Flow

```
Agent Execution
    ↓
  Error Occurs
    ↓
Update .agent_status.yaml
  - status: failed
  - errors: [error details]
    ↓
Master detects failure
    ↓
Debug Agent Enabled? ─NO→ Retry or Fail
    ↓ YES
Launch Debug Agent
    ↓
Debug Agent analyzes:
  - Reads failed agent's files
  - Identifies root cause
  - Generates recommendations
    ↓
Debug Agent completes
  - diagnosis: {...}
  - recommendations: [...]
  - retry_suggested: true/false
    ↓
User Confirmation
    ↓ (if approved)
Apply Fixes
    ↓
Retry Failed Agent
    ↓
Success → Continue
```

---

## File System Architecture

### Directory Layout

```
.memory/                          # Base directory (configurable)
│
├── task_plan.md                  # Master's task plan
├── notes.md                      # Master's research notes
├── deliverable.md                # Final output
├── dependencies.yaml             # DAG definition
├── execution.log                 # Unified log
│
├── agent-a3b2c1/                 # Sub-agent workspace
│   ├── .agent_status.yaml        # Status tracking
│   ├── context.yaml              # Context from master
│   ├── task_plan.md              # Agent's plan
│   ├── notes.md                  # Agent's notes
│   └── deliverable.md            # Agent's output
│
├── agent-4f8e2d/                 # Another sub-agent
│   └── ...
│
├── agent-4f8e2d-debug/           # Debug agent (if needed)
│   └── .agent_status.yaml
│
└── agent-user/                   # Level 1 agent (can have subs)
    ├── .agent_status.yaml
    ├── dependencies.yaml         # Sub's own DAG
    ├── agent-user-a1/            # Level 2 agent
    ├── agent-user-a2/
    └── agent-user-a3/
```

### File Formats

#### .agent_status.yaml
```yaml
agent_id: string          # Unique ID
status: enum              # pending | in-progress | completed | failed | blocked
task_description: string
parent_agent: string
depth: integer
timestamps: ...
summary: string
artifacts: array
errors: array
metadata: object
```

#### dependencies.yaml
```yaml
version: string
generated_at: timestamp
dependencies: array
  - agent_id: string
    task: string
    depends_on: array[string]
    priority: enum
    estimated_duration_minutes: integer
execution_plan: object
  levels: array
validation: object
```

#### context.yaml
```yaml
global_context: object
parent_decisions: array
sibling_results: array
research_notes: string
technical_stack: object
project_structure: object
agent_instructions: string
```

---

## State Management

### State Transitions

```
      ┌─────────┐
      │ pending │  Initial state
      └────┬────┘
           │ launch_agent()
           ↓
   ┌──────────────┐
   │ in-progress  │  Agent executing
   └───┬─────┬────┘
       │     │
       │     │ error occurs
       │     ↓
       │  ┌────────┐
       │  │ failed │  Error state
       │  └────┬───┘
       │       │ debug + retry
       │       ↓
       │  ┌─────────┐
       │  │ pending │  Reset for retry
       │  └─────────┘
       │
       │ normal completion
       ↓
  ┌───────────┐
  │ completed │  Terminal state
  └───────────┘

  ┌─────────┐
  │ blocked │  Waiting for dependencies
  └─────────┘  (optional state)
```

### State Consistency

**Guarantees**:
1. Each agent owns its `.agent_status.yaml` (exclusive write)
2. Master only reads status files (no modification)
3. Atomic YAML writes (temp file + rename)
4. Status transitions are logged

**Potential Issues**:
- **Stale reads**: Master reads old status before agent updates
  - **Mitigation**: Poll at regular intervals, timestamps for freshness
- **Orphaned agents**: Agent crashes without updating status
  - **Mitigation**: Timeout enforcement, mark as failed after timeout

---

## Scheduling Algorithm

### Topological Sort Implementation

```python
def topological_sort(dependencies):
    """
    Returns levels of agents that can run in parallel.

    Example:
        dependencies = {
            'A': [],         # No deps
            'B': ['A'],      # Depends on A
            'C': ['A'],      # Depends on A
            'D': ['B', 'C']  # Depends on B and C
        }

        Returns:
        [
            ['A'],        # Level 0
            ['B', 'C'],   # Level 1 (parallel)
            ['D']         # Level 2
        ]
    """
    import graphlib

    # Build graph
    graph = {}
    for dep in dependencies:
        agent_id = dep["agent_id"]
        depends_on = dep["depends_on"]
        graph[agent_id] = set(depends_on)

    # Topological sort
    ts = graphlib.TopologicalSorter(graph)
    ts.prepare()

    levels = []
    while ts.is_active():
        ready = list(ts.get_ready())
        levels.append(ready)

        # Mark all as done
        for agent_id in ready:
            ts.done(agent_id)

    return levels
```

### Parallelism Strategy

**Max concurrent agents**: 3 (default, configurable)

**Scheduling**:
- Within a level, launch up to `max_concurrent_agents`
- Wait for at least one to complete
- Launch next from queue
- Move to next level when current level empty

**Example**:
```
Level 1: [A, B, C, D]  (4 agents, max_concurrent=3)

Time 0:   Launch A, B, C
Time 10:  B completes → Launch D
Time 15:  A completes
Time 20:  C completes
Time 25:  D completes → Level 1 done
```

---

## Error Handling

### Error Categories

1. **Dependency Errors**
   - Missing packages
   - Tool not available
   - **Strategy**: Debug agent → install → retry

2. **Code Errors**
   - Syntax errors
   - Type errors
   - **Strategy**: Debug agent → suggest fix → retry

3. **Resource Errors**
   - Timeout
   - Disk full
   - Memory limit
   - **Strategy**: Log error, manual intervention

4. **Logic Errors**
   - Incorrect implementation
   - Failed tests
   - **Strategy**: Debug agent → analyze → suggest rewrite

### Retry Logic

```python
def retry_agent(agent_id, max_retries=2):
    retries = 0

    while retries < max_retries:
        result = launch_agent(agent_id)

        if result.status == "completed":
            return result

        if result.status == "failed":
            # Launch debug agent
            debug_result = debug_agent(agent_id)

            if not debug_result.retry_suggested:
                return result  # Give up

            # Apply fixes
            apply_fixes(debug_result.recommendations)

            # Retry
            retries += 1
            reset_agent_status(agent_id)
        else:
            break

    return mark_as_failed(agent_id, "Max retries exceeded")
```

---

## Resource Management

### 1. Agent Count Limits

```python
class AgentCountLimiter:
    def __init__(self, max_total, max_depth):
        self.max_total = max_total
        self.max_depth = max_depth
        self.current_count = 0
        self.agent_depths = {}

    def can_create(self, parent_id):
        # Check total count
        if self.current_count >= self.max_total:
            return False, "Max total agents reached"

        # Check depth
        parent_depth = self.agent_depths.get(parent_id, 0)
        child_depth = parent_depth + 1

        if child_depth > self.max_depth:
            return False, f"Max depth ({self.max_depth}) exceeded"

        return True, None

    def register(self, agent_id, parent_id):
        self.current_count += 1
        parent_depth = self.agent_depths.get(parent_id, 0)
        self.agent_depths[agent_id] = parent_depth + 1
```

### 2. Timeout Management

```python
async def execute_with_timeout(agent_id, timeout_minutes):
    try:
        async with asyncio.timeout(timeout_minutes * 60):
            result = await launch_agent(agent_id)
            return result
    except asyncio.TimeoutError:
        log_error(f"Agent {agent_id} timed out after {timeout_minutes}m")
        mark_as_failed(agent_id, "Execution timeout")
        return None
```

### 3. Cost Tracking

```python
class CostTracker:
    def __init__(self, config):
        self.config = config
        self.total_tokens = {"input": 0, "output": 0}
        self.total_cost = 0.0

    def estimate_cost(self, context_tokens):
        estimated_input = context_tokens + 5000
        estimated_output = 10000

        cost = (
            estimated_input / 1000 * self.config.token_price_per_1k.input +
            estimated_output / 1000 * self.config.token_price_per_1k.output
        )

        return cost

    def track(self, agent_id, input_tokens, output_tokens):
        self.total_tokens["input"] += input_tokens
        self.total_tokens["output"] += output_tokens

        cost = (
            input_tokens / 1000 * self.config.token_price_per_1k.input +
            output_tokens / 1000 * self.config.token_price_per_1k.output
        )

        self.total_cost += cost

        # Check limits
        self.check_limits()

    def check_limits(self):
        if self.total_cost >= self.config.cost_controls.hard_limit_usd:
            raise CostLimitExceeded(
                f"Cost ${self.total_cost:.2f} exceeds hard limit "
                f"${self.config.cost_controls.hard_limit_usd}"
            )

        if self.total_cost >= self.config.cost_controls.warning_threshold_usd:
            log_warning(
                f"Cost warning: ${self.total_cost:.2f} / "
                f"${self.config.cost_controls.hard_limit_usd}"
            )
```

---

## Observability

### 1. Agent Tree View

**Generation**:
```python
def generate_agent_tree():
    tree = []
    master_status = "in-progress"  # or "completed"

    tree.append(f"master [{master_status}] - {master_task}")

    # Recursively build tree
    for agent_id in list_sub_agents():
        add_agent_to_tree(tree, agent_id, indent=1)

    return "\n".join(tree)

def add_agent_to_tree(tree, agent_id, indent):
    status = read_agent_status(agent_id)

    status_icon = {
        "completed": "✓",
        "in-progress": "⚙",
        "pending": "⏸",
        "failed": "✗"
    }[status.status]

    duration = format_duration(status.execution_time_seconds)

    tree.append(
        f"{'  ' * indent}├── agent-{agent_id} [{status.status}] - "
        f"{status.task_description} ({duration}) {status_icon}"
    )

    # Recursively add sub-agents (if any)
    for sub_id in status.sub_agents:
        add_agent_to_tree(tree, sub_id, indent + 1)
```

### 2. Mermaid Diagram Generation

```python
def generate_mermaid_diagram():
    deps = read_yaml(".memory/dependencies.yaml")

    mermaid = ["graph TB"]

    # Add master node
    mermaid.append(f"    master[Master Agent<br/>{master_task}<br/>✓ Completed]")

    # Add all agent nodes
    for dep in deps["dependencies"]:
        agent_id = dep["agent_id"]
        task = dep["task"]
        status = read_agent_status(agent_id)

        node_label = f"{agent_id}<br/>{task}<br/>{status.status}"
        mermaid.append(f"    {agent_id}[{node_label}]")

    # Add edges
    for dep in deps["dependencies"]:
        agent_id = dep["agent_id"]
        mermaid.append(f"    master --> {agent_id}")

        for dep_id in dep["depends_on"]:
            mermaid.append(f"    {agent_id} -.depends.-> {dep_id}")

    # Add styling
    for dep in deps["dependencies"]:
        agent_id = dep["agent_id"]
        status = read_agent_status(agent_id)

        color = {
            "completed": "#90EE90",
            "in-progress": "#FFD700",
            "pending": "#D3D3D3",
            "failed": "#FF6B6B"
        }[status.status]

        mermaid.append(f"    style {agent_id} fill:{color}")

    return "\n".join(mermaid)
```

### 3. Performance Metrics

```python
class PerformanceMetrics:
    def collect(self):
        agents = list_all_agents()

        metrics = {
            "total_duration_seconds": 0,
            "total_tokens": {"input": 0, "output": 0},
            "total_cost": 0.0,
            "agent_count": len(agents),
            "max_depth": 0,
            "peak_concurrent": 0,
            "success_rate": 0.0,
            "agent_breakdown": []
        }

        for agent_id in agents:
            status = read_agent_status(agent_id)

            metrics["total_duration_seconds"] += status.execution_time_seconds
            metrics["total_tokens"]["input"] += status.metadata.token_usage.input
            metrics["total_tokens"]["output"] += status.metadata.token_usage.output
            metrics["total_cost"] += status.metadata.estimated_cost_usd
            metrics["max_depth"] = max(metrics["max_depth"], status.depth)

            metrics["agent_breakdown"].append({
                "agent_id": agent_id,
                "task": status.task_description,
                "duration_seconds": status.execution_time_seconds,
                "tokens": status.metadata.token_usage.total,
                "cost": status.metadata.estimated_cost_usd,
                "status": status.status
            })

        # Calculate success rate
        completed = sum(1 for a in agents if read_agent_status(a).status == "completed")
        metrics["success_rate"] = completed / len(agents) if agents else 0.0

        return metrics
```

---

## Design Decisions

### 1. Why Flat Directory Structure with Hashing?

**Decision**: Use `.memory/agent-{hash}/` instead of `.memory/sub1/sub1.1/`

**Rationale**:
- Avoids path length limits on Windows/macOS (255 chars)
- Simplifies file operations (no deep recursion)
- Hash ensures uniqueness without collisions

**Trade-off**:
- Loses visual hierarchy
- **Mitigation**: Maintain mapping table in master's task_plan.md

### 2. Why YAML Instead of JSON for Status Files?

**Decision**: Use YAML for `.agent_status.yaml` and `dependencies.yaml`

**Rationale**:
- Human-readable (supports comments, multi-line strings)
- Consistent with existing planning-with-files patterns
- Easier to manually inspect and debug

**Trade-off**:
- Slightly slower parsing than JSON
- **Mitigation**: File sizes are small (<10KB), performance impact negligible

### 3. Why Separate dependencies.yaml File?

**Decision**: Use dedicated `dependencies.yaml` instead of embedding in task_plan.md

**Rationale**:
- Programmatic parsing without Markdown extraction
- Clear separation of concerns (planning vs execution)
- Easier validation and graph algorithms

**Trade-off**:
- One more file to manage
- **Mitigation**: Templates and clear documentation

### 4. Why Debug Agents Instead of Auto-Retry?

**Decision**: Launch debug agent on failure rather than blind retry

**Rationale**:
- Provides diagnostic value (understand why it failed)
- Suggests actionable fixes
- Avoids wasting tokens on doomed retries

**Trade-off**:
- Additional complexity and cost
- **Mitigation**: Configurable, can disable debug agents

### 5. Why Not Use Database for State?

**Decision**: Use file-based state (YAML) instead of database

**Rationale**:
- Simplicity: No external dependencies
- Portability: Works anywhere with filesystem
- Inspectability: Users can view/edit files directly
- Consistency: Matches planning-with-files philosophy

**Trade-off**:
- No ACID transactions
- **Mitigation**: Atomic writes (temp file + rename), single-writer per file

---

## Future Enhancements

### Phase 4: Smart Diagnostics (Planned)

1. **Enhanced Debug Agents**
   - Pattern recognition from past failures
   - Suggested fixes library
   - Auto-apply common fixes

2. **Predictive Failure Detection**
   - Analyze task complexity before launch
   - Warn about likely failures
   - Suggest preventive measures

### Phase 5: Advanced Features (Long-term)

1. **CLI Tools**
   ```bash
   claude-agents tree                    # View agent tree
   claude-agents info a3b2c1             # Agent details
   claude-agents viz-deps --output png   # Visualize dependencies
   claude-agents analyze-perf            # Performance analysis
   ```

2. **Task Templates Library**
   - Pre-defined decomposition patterns
   - Common architecture templates
   - Best practice examples

3. **Cost Optimization**
   - Recommend cheaper models for sub-tasks
   - Identify over-engineered decompositions
   - Suggest consolidation opportunities

4. **Dynamic Re-planning**
   - Agents can request plan changes
   - Master can re-evaluate decomposition mid-execution
   - Adaptive parallelism based on resource availability

---

## Appendix: Key Algorithms

### A. Cycle Detection (DFS-based)

```python
def has_cycle(graph):
    """Detect cycles in directed graph using DFS"""
    WHITE, GRAY, BLACK = 0, 1, 2
    color = {node: WHITE for node in graph}

    def visit(node):
        if color[node] == GRAY:
            return True  # Back edge = cycle

        if color[node] == BLACK:
            return False  # Already processed

        color[node] = GRAY  # Mark as in-progress

        for neighbor in graph[node]:
            if visit(neighbor):
                return True

        color[node] = BLACK  # Mark as done
        return False

    for node in graph:
        if color[node] == WHITE:
            if visit(node):
                return True

    return False
```

### B. Agent ID Generation

```python
import hashlib
from datetime import datetime

def generate_agent_id(task_description, parent_id="master"):
    """Generate unique 6-character agent ID"""
    timestamp = datetime.utcnow().isoformat()
    input_str = f"{timestamp}_{task_description}_{parent_id}"

    hash_digest = hashlib.sha256(input_str.encode()).hexdigest()

    # Take first 6 chars (collision probability: ~1 in 16 million)
    return hash_digest[:6]
```

### C. Context Size Estimation

```python
import tiktoken

def estimate_tokens(text):
    """Estimate token count for GPT-4 style models"""
    encoding = tiktoken.get_encoding("cl100k_base")
    return len(encoding.encode(text))

def summarize_context(context, target_tokens):
    """Summarize context to fit within target token limit"""
    current_tokens = estimate_tokens(yaml.dump(context))

    if current_tokens <= target_tokens:
        return context  # Already within limit

    # Prioritize: global_context > parent_decisions > sibling_results > notes
    # Truncate research_notes first
    if "research_notes" in context:
        context["research_notes"] = truncate_to_tokens(
            context["research_notes"],
            target_tokens // 4
        )

    # Then truncate sibling results
    if "sibling_results" in context:
        for sibling in context["sibling_results"]:
            sibling["summary"] = truncate_to_tokens(
                sibling["summary"],
                500  # 500 tokens per sibling
            )

    return context
```

---

**End of Architecture Document**

For implementation details, see SKILL.md. For usage examples, see README.md and examples/.
