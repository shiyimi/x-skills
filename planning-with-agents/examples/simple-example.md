# Simple Example: Building a REST API

This example demonstrates basic sub-agent activation for a moderate-complexity task.

## Task Description

"Build a REST API for a blog application with user authentication, post CRUD operations, and comment functionality."

## What Happens

### 1. Task Analysis

The master agent analyzes the task:
- **Complexity**: Medium (3-4 main features)
- **Estimated phases**: 4-5
- **Triggers matched**: "build.*application" pattern

**Decision**: Activate sub-agents ✓

### 2. Task Decomposition

Master creates `dependencies.yaml`:

```yaml
dependencies:
  - agent_id: a3b2c1
    task: "Design API schema and endpoints"
    depends_on: []
    priority: high

  - agent_id: 4f8e2d
    task: "Implement authentication system"
    depends_on: [a3b2c1]
    priority: high

  - agent_id: 2b3e5d
    task: "Implement blog post CRUD"
    depends_on: [a3b2c1, 4f8e2d]
    priority: medium

  - agent_id: 6a8c4f
    task: "Implement comments feature"
    depends_on: [a3b2c1, 4f8e2d]
    priority: low

  - agent_id: 7c9f1a
    task: "Write integration tests"
    depends_on: [2b3e5d, 6a8c4f]
    priority: medium
```

### 3. Execution Plan

**Level 0 (Parallel)**:
- `a3b2c1` - Design API schema

**Level 1 (Sequential - waits for a3b2c1)**:
- `4f8e2d` - Implement authentication

**Level 2 (Parallel - waits for 4f8e2d)**:
- `2b3e5d` - Blog post CRUD
- `6a8c4f` - Comments feature

**Level 3 (Sequential)**:
- `7c9f1a` - Integration tests

### 4. Directory Structure

```
.memory/
├── task_plan.md              # Master's plan
├── notes.md                  # Master's research
├── dependencies.yaml         # Execution graph
├── execution.log             # Unified log
├── agent-a3b2c1/             # API design agent
│   ├── .agent_status.yaml
│   ├── task_plan.md
│   └── deliverable.md
├── agent-4f8e2d/             # Auth agent
│   ├── .agent_status.yaml
│   └── deliverable.md
├── agent-2b3e5d/             # Blog CRUD agent
├── agent-6a8c4f/             # Comments agent
└── agent-7c9f1a/             # Testing agent
```

### 5. Results

**Time saved**: ~35% through parallelization
- Sequential: 2h 30m
- Parallel: 1h 37m

**Token efficiency**:
- Single agent (estimated): 45K tokens
- Multi-agent (actual): Master 8K + Sub-agents avg 6K = 38K total
- Each agent stays under context limits

**Success metrics**:
- ✅ All 5 agents completed successfully
- ✅ Integration tests passing
- ✅ Code coverage: 87%
- ✅ Total cost: $1.24

## Key Takeaways

1. **Automatic decomposition**: The skill recognized the task complexity and suggested sub-agents
2. **Dependency management**: DAG scheduling ensured correct execution order
3. **Parallel execution**: Independent tasks (blog CRUD + comments) ran simultaneously
4. **Context isolation**: Each agent focused on its specific task without context overload

## Configuration Used

```json
{
  "sub_agents": {
    "enabled": true,
    "triggers": {
      "complexity_threshold": {
        "max_phases": 5
      }
    }
  },
  "resource_limits": {
    "max_concurrent_agents": 2
  }
}
```
