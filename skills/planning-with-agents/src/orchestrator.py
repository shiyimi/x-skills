#!/usr/bin/env python3
"""Multi-Agent Orchestrator - Integration Testing Framework

This orchestrator integrates all core components to simulate
the complete planning-with-agents workflow:
- Agent ID generation
- Dependency validation
- DAG scheduling
- Status file management
- Execution tracking

This is a minimal viable implementation for testing purposes.
"""

from typing import List, Dict, Optional, Tuple
from pathlib import Path
from dataclasses import dataclass, asdict
import time

from agent_id_generator import AgentIDGenerator
from dependency_validator import DependencyValidator, DependencyNode
from dag_scheduler import DAGScheduler, AgentNode
from status_file_manager import StatusFileManager, AgentStatusFile, AgentStatus


@dataclass
class TaskDefinition:
    """User-provided task definition"""
    description: str
    depends_on: List[str] = None  # References to other task descriptions
    estimated_minutes: int = 30

    def __post_init__(self):
        if self.depends_on is None:
            self.depends_on = []


@dataclass
class SubAgent:
    """Sub-agent with generated ID and dependencies"""
    agent_id: str
    task_description: str
    depends_on: List[str]  # Agent IDs
    estimated_minutes: int
    status: str = "pending"


@dataclass
class OrchestrationResult:
    """Result of orchestration"""
    success: bool
    agents: List[SubAgent]
    execution_plan: Optional[Dict] = None
    validation_errors: List[str] = None
    metrics: Optional[Dict] = None

    def __post_init__(self):
        if self.validation_errors is None:
            self.validation_errors = []


class MultiAgentOrchestrator:
    """Orchestrates multi-agent task execution

    Integrates:
    - AgentIDGenerator: Generate unique agent IDs
    - DependencyValidator: Validate dependency graph
    - DAGScheduler: Create parallel execution plan
    - StatusFileManager: Track agent status
    """

    def __init__(self, workspace_dir: Path):
        """Initialize orchestrator

        Args:
            workspace_dir: Base directory for agent workspaces
        """
        self.workspace_dir = workspace_dir
        workspace_dir.mkdir(parents=True, exist_ok=True)

        # Initialize components
        existing_ids = AgentIDGenerator.scan_workspace(workspace_dir)
        self.id_generator = AgentIDGenerator(existing_ids)
        self.status_manager = StatusFileManager(workspace_dir)

        # Tracking
        self.agents: List[SubAgent] = []
        self.task_map: Dict[str, str] = {}  # description -> agent_id

    def plan(
        self,
        tasks: List[TaskDefinition]
    ) -> OrchestrationResult:
        """Plan multi-agent execution

        Args:
            tasks: List of task definitions

        Returns:
            OrchestrationResult with agents and execution plan
        """
        start_time = time.time()

        # Step 1: Generate agent IDs
        agents = []
        task_map = {}

        for task in tasks:
            agent_id = self.id_generator.generate()
            task_map[task.description] = agent_id

            agents.append(SubAgent(
                agent_id=agent_id,
                task_description=task.description,
                depends_on=[],  # Will resolve in step 2
                estimated_minutes=task.estimated_minutes
            ))

        # Step 2: Resolve dependencies (description -> agent_id)
        for i, task in enumerate(tasks):
            dep_ids = []
            for dep_desc in task.depends_on:
                if dep_desc not in task_map:
                    return OrchestrationResult(
                        success=False,
                        agents=[],
                        validation_errors=[
                            f"Unknown dependency: '{dep_desc}' referenced by '{task.description}'"
                        ]
                    )
                dep_ids.append(task_map[dep_desc])

            agents[i].depends_on = dep_ids

        # Step 3: Validate dependencies
        dep_nodes = [
            DependencyNode(
                agent_id=agent.agent_id,
                depends_on=agent.depends_on,
                task_description=agent.task_description
            )
            for agent in agents
        ]

        validator = DependencyValidator(dep_nodes)
        is_valid, errors = validator.validate()

        if not is_valid:
            return OrchestrationResult(
                success=False,
                agents=agents,
                validation_errors=[
                    f"{e.error_type}: {e.message}"
                    for e in errors
                ]
            )

        # Step 4: Create DAG execution plan
        dag_nodes = [
            AgentNode(
                agent_id=agent.agent_id,
                task=agent.task_description,
                depends_on=agent.depends_on,
                estimated_duration_minutes=agent.estimated_minutes
            )
            for agent in agents
        ]

        scheduler = DAGScheduler(dag_nodes)

        # Check for cycles
        cycle = scheduler.detect_cycles()
        if cycle:
            return OrchestrationResult(
                success=False,
                agents=agents,
                validation_errors=[f"Circular dependency detected: {' -> '.join(cycle)}"]
            )

        # Generate execution plan
        execution_summary = scheduler.get_execution_summary()

        # Format execution plan
        execution_plan = {
            "execution_order": [
                level.agents for level in execution_summary["levels"]
            ],
            "metrics": {
                "sequential_time_minutes": execution_summary["total_sequential_minutes"],
                "parallel_time_minutes": execution_summary["total_parallel_minutes"],
                "time_saved_percentage": execution_summary["time_saved_percent"],
                "max_parallelism": execution_summary["max_parallelism"]
            }
        }

        # Step 5: Initialize status files
        for agent in agents:
            self.status_manager.create_status(
                agent_id=agent.agent_id,
                task_description=agent.task_description,
                metadata={
                    "depends_on": agent.depends_on,
                    "estimated_minutes": agent.estimated_minutes
                }
            )

        # Calculate metrics
        planning_time = time.time() - start_time

        metrics = {
            "planning_time_seconds": round(planning_time, 3),
            "total_agents": len(agents),
            "total_dependencies": sum(len(a.depends_on) for a in agents),
            "max_depth": validator.get_dependency_stats()["max_depth"],
            "sequential_time_minutes": execution_plan["metrics"]["sequential_time_minutes"],
            "parallel_time_minutes": execution_plan["metrics"]["parallel_time_minutes"],
            "time_saved_percentage": execution_plan["metrics"]["time_saved_percentage"],
            "max_parallelism": execution_plan["metrics"]["max_parallelism"]
        }

        self.agents = agents
        self.task_map = task_map

        return OrchestrationResult(
            success=True,
            agents=agents,
            execution_plan=execution_plan,
            metrics=metrics
        )

    def simulate_execution(self) -> Dict:
        """Simulate agent execution (for testing)

        Simulates execution following the DAG plan:
        - Executes agents in topological order
        - Respects dependencies
        - Updates status files
        - Tracks timing

        Returns:
            Execution metrics
        """
        if not self.agents:
            raise ValueError("No agents planned. Call plan() first.")

        start_time = time.time()

        # Create dependency map
        completed = set()
        agent_map = {a.agent_id: a for a in self.agents}

        # Simulate execution in waves (respecting dependencies)
        wave = 0
        while len(completed) < len(self.agents):
            wave += 1

            # Find agents ready to execute
            ready = []
            for agent in self.agents:
                if agent.agent_id in completed:
                    continue

                # Check if all dependencies are completed
                deps_ready = all(
                    dep_id in completed
                    for dep_id in agent.depends_on
                )

                if deps_ready:
                    ready.append(agent)

            if not ready:
                # Should not happen if DAG is valid
                raise RuntimeError("No agents ready but not all completed (cycle?)")

            # Execute ready agents (parallel simulation)
            for agent in ready:
                # Update to IN_PROGRESS
                self.status_manager.update_status(
                    agent_id=agent.agent_id,
                    new_status=AgentStatus.IN_PROGRESS,
                    summary=f"Executing in wave {wave}"
                )

                # Simulate work (instant in test)
                # In real implementation, would launch actual agents

                # Update to COMPLETED
                self.status_manager.update_status(
                    agent_id=agent.agent_id,
                    new_status=AgentStatus.COMPLETED,
                    summary=f"Completed successfully",
                    artifacts=[f"output_{agent.agent_id}.txt"]
                )

                completed.add(agent.agent_id)

        execution_time = time.time() - start_time

        return {
            "execution_time_seconds": round(execution_time, 3),
            "total_waves": wave,
            "agents_completed": len(completed)
        }

    def get_status_summary(self) -> Dict:
        """Get summary of all agent statuses

        Returns:
            Status summary with counts
        """
        all_agents = self.status_manager.list_agents()

        status_counts = {
            "pending": 0,
            "in_progress": 0,
            "completed": 0,
            "failed": 0
        }

        for agent_id in all_agents:
            status = self.status_manager.read_status(agent_id)
            status_counts[status.status] += 1

        return {
            "total_agents": len(all_agents),
            "status_counts": status_counts,
            "agents": all_agents
        }

    def cleanup(self):
        """Clean up workspace (for testing)"""
        import shutil
        if self.workspace_dir.exists():
            shutil.rmtree(self.workspace_dir)


def main():
    """Demo orchestration workflow"""
    print("=" * 70)
    print("Multi-Agent Orchestrator - Demo".center(70))
    print("=" * 70)
    print()

    # Create workspace
    import tempfile
    workspace = Path(tempfile.mkdtemp(prefix="orchestrator_demo_"))

    try:
        # Define tasks
        tasks = [
            TaskDefinition(
                description="Design API schema",
                depends_on=[],
                estimated_minutes=45
            ),
            TaskDefinition(
                description="Implement authentication",
                depends_on=["Design API schema"],
                estimated_minutes=60
            ),
            TaskDefinition(
                description="Implement blog CRUD",
                depends_on=["Design API schema", "Implement authentication"],
                estimated_minutes=90
            ),
            TaskDefinition(
                description="Implement comments",
                depends_on=["Design API schema", "Implement authentication"],
                estimated_minutes=60
            ),
            TaskDefinition(
                description="Write tests",
                depends_on=["Implement blog CRUD", "Implement comments"],
                estimated_minutes=45
            ),
        ]

        # Create orchestrator
        orchestrator = MultiAgentOrchestrator(workspace)

        # Plan execution
        print("📋 Planning execution...")
        result = orchestrator.plan(tasks)

        if not result.success:
            print("❌ Planning failed:")
            for error in result.validation_errors:
                print(f"   - {error}")
            return

        print("✅ Planning successful!")
        print()

        # Print agents
        print(f"🤖 Generated {len(result.agents)} agents:")
        for agent in result.agents:
            print(f"   - {agent.agent_id}: {agent.task_description}")
            if agent.depends_on:
                print(f"     Depends on: {', '.join(agent.depends_on)}")
        print()

        # Print execution plan
        print("📊 Execution Plan:")
        plan = result.execution_plan
        for wave_idx, wave in enumerate(plan["execution_order"], 1):
            print(f"   Wave {wave_idx}: {', '.join(wave)}")
        print()

        # Print metrics
        print("📈 Metrics:")
        for key, value in result.metrics.items():
            print(f"   {key}: {value}")
        print()

        # Simulate execution
        print("🚀 Simulating execution...")
        exec_metrics = orchestrator.simulate_execution()

        print("✅ Execution complete!")
        print(f"   Total waves: {exec_metrics['total_waves']}")
        print(f"   Agents completed: {exec_metrics['agents_completed']}")
        print(f"   Execution time: {exec_metrics['execution_time_seconds']}s")
        print()

        # Status summary
        summary = orchestrator.get_status_summary()
        print("📊 Final Status:")
        print(f"   Total agents: {summary['total_agents']}")
        print(f"   Status counts: {summary['status_counts']}")

    finally:
        # Cleanup
        orchestrator.cleanup()
        print()
        print(f"🧹 Cleaned up workspace: {workspace}")


if __name__ == "__main__":
    main()
