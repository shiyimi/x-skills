#!/usr/bin/env python3
"""DAG Scheduler - Topological Sort with Cycle Detection

Implements the core DAG scheduling algorithm described in ARCHITECTURE.md.
Uses Python's graphlib.TopologicalSorter for robust topological ordering.
"""

from typing import Dict, List, Set, Tuple, Optional
from dataclasses import dataclass
import graphlib


@dataclass
class AgentNode:
    """Represents a sub-agent in the dependency graph"""
    agent_id: str
    task: str
    depends_on: List[str]
    priority: str = "medium"
    estimated_duration_minutes: Optional[int] = None


@dataclass
class ExecutionLevel:
    """Represents a level in the execution plan"""
    level: int
    agents: List[str]
    parallelizable: bool
    estimated_duration_minutes: Optional[int] = None


class DAGScheduler:
    """DAG-based scheduler for sub-agent execution

    Features:
    - Topological sorting using graphlib
    - Cycle detection
    - Parallel execution planning
    - Dependency validation
    """

    def __init__(self, agents: List[AgentNode]):
        """Initialize scheduler with agent nodes

        Args:
            agents: List of agent nodes with dependencies
        """
        # Check for duplicate agent IDs BEFORE building dictionary
        agent_ids = [agent.agent_id for agent in agents]
        if len(agent_ids) != len(set(agent_ids)):
            duplicates = [aid for aid in agent_ids if agent_ids.count(aid) > 1]
            raise ValueError(f"Duplicate agent IDs found: {set(duplicates)}")

        self.agents = {agent.agent_id: agent for agent in agents}
        self._validate_agents()

    def _validate_agents(self) -> None:
        """Validate that dependencies exist"""
        # Check that all dependencies exist
        for agent in self.agents.values():
            for dep in agent.depends_on:
                if dep not in self.agents:
                    raise ValueError(
                        f"Agent '{agent.agent_id}' depends on non-existent agent '{dep}'"
                    )

    def detect_cycles(self) -> Optional[List[str]]:
        """Detect cycles in the dependency graph

        Returns:
            List of agent IDs forming a cycle, or None if no cycle exists
        """
        try:
            # Build graph for topological sort
            graph = {
                agent_id: set(agent.depends_on)
                for agent_id, agent in self.agents.items()
            }

            # Try to prepare topological sorter - will raise if cycle exists
            ts = graphlib.TopologicalSorter(graph)
            ts.prepare()
            return None

        except graphlib.CycleError as e:
            # Extract cycle from error message
            # graphlib raises: "nodes are in a cycle" with the cycle in args
            cycle_info = str(e)
            # For now, return a generic message - in practice we'd parse the cycle
            return ["Cycle detected in dependency graph"]

    def topological_sort(self) -> List[ExecutionLevel]:
        """Perform topological sort and generate execution plan

        Returns:
            List of execution levels with agents that can run in parallel

        Raises:
            graphlib.CycleError: If a cycle is detected in the graph
        """
        # Check for cycles first
        cycle = self.detect_cycles()
        if cycle:
            raise ValueError(f"Cannot schedule: cycle detected in graph")

        # Build graph
        graph = {
            agent_id: set(agent.depends_on)
            for agent_id, agent in self.agents.items()
        }

        # Perform topological sort
        ts = graphlib.TopologicalSorter(graph)
        ts.prepare()

        levels: List[ExecutionLevel] = []
        level_num = 0

        while ts.is_active():
            # Get all agents ready to execute at this level
            ready = list(ts.get_ready())

            if not ready:
                break

            # Determine if this level can be parallelized
            # A level is parallelizable if it has more than one agent
            parallelizable = len(ready) > 1

            # Calculate estimated duration for this level
            # If parallel: max duration of agents in level
            # If sequential: sum of durations
            durations = [
                self.agents[agent_id].estimated_duration_minutes
                for agent_id in ready
                if self.agents[agent_id].estimated_duration_minutes is not None
            ]

            if durations:
                estimated_duration = max(durations) if parallelizable else sum(durations)
            else:
                estimated_duration = None

            level = ExecutionLevel(
                level=level_num,
                agents=ready,
                parallelizable=parallelizable,
                estimated_duration_minutes=estimated_duration
            )
            levels.append(level)

            # Mark agents as done
            for agent_id in ready:
                ts.done(agent_id)

            level_num += 1

        return levels

    def get_execution_summary(self) -> Dict:
        """Generate execution plan summary with metrics

        Returns:
            Dictionary with execution plan and performance estimates
        """
        levels = self.topological_sort()

        # Calculate total sequential time (sum of all durations)
        all_durations = [
            agent.estimated_duration_minutes
            for agent in self.agents.values()
            if agent.estimated_duration_minutes is not None
        ]
        total_sequential = sum(all_durations) if all_durations else 0

        # Calculate parallel execution time (sum of level durations)
        level_durations = [
            level.estimated_duration_minutes
            for level in levels
            if level.estimated_duration_minutes is not None
        ]
        total_parallel = sum(level_durations) if level_durations else 0

        # Calculate time saved percentage
        if total_sequential > 0:
            time_saved_percent = ((total_sequential - total_parallel) / total_sequential) * 100
        else:
            time_saved_percent = 0

        return {
            "levels": levels,
            "total_agents": len(self.agents),
            "total_levels": len(levels),
            "total_sequential_minutes": total_sequential,
            "total_parallel_minutes": total_parallel,
            "time_saved_percent": round(time_saved_percent, 1),
            "max_parallelism": max(len(level.agents) for level in levels) if levels else 0
        }

    def to_yaml_dict(self) -> Dict:
        """Convert execution plan to YAML-compatible dictionary

        Returns:
            Dictionary matching the dependencies.yaml format
        """
        summary = self.get_execution_summary()
        levels = summary["levels"]

        return {
            "version": "1.0",
            "dependencies": [
                {
                    "agent_id": agent.agent_id,
                    "task": agent.task,
                    "depends_on": agent.depends_on,
                    "priority": agent.priority,
                    **({"estimated_duration_minutes": agent.estimated_duration_minutes}
                       if agent.estimated_duration_minutes else {})
                }
                for agent in self.agents.values()
            ],
            "execution_plan": {
                "levels": [
                    {
                        "level": level.level,
                        "agents": level.agents,
                        "parallelizable": level.parallelizable,
                        **({"estimated_duration_minutes": level.estimated_duration_minutes}
                           if level.estimated_duration_minutes else {})
                    }
                    for level in levels
                ],
                "total_sequential_minutes": summary["total_sequential_minutes"],
                "total_parallel_minutes": summary["total_parallel_minutes"],
                "time_saved_percent": summary["time_saved_percent"]
            }
        }


def main():
    """Example usage of DAG scheduler"""
    # Example from simple-example.md: REST API
    agents = [
        AgentNode("a3b2c1", "Design API schema", [], "high", 30),
        AgentNode("4f8e2d", "Implement authentication", ["a3b2c1"], "high", 60),
        AgentNode("2b3e5d", "Implement blog post CRUD", ["a3b2c1", "4f8e2d"], "medium", 45),
        AgentNode("6a8c4f", "Implement comments feature", ["a3b2c1", "4f8e2d"], "low", 40),
        AgentNode("7c9f1a", "Write integration tests", ["2b3e5d", "6a8c4f"], "medium", 30),
    ]

    scheduler = DAGScheduler(agents)

    print("=" * 70)
    print("DAG Scheduler - Execution Plan".center(70))
    print("=" * 70)
    print()

    summary = scheduler.get_execution_summary()

    print(f"Total Agents: {summary['total_agents']}")
    print(f"Total Levels: {summary['total_levels']}")
    print(f"Max Parallelism: {summary['max_parallelism']}")
    print()

    print("Execution Levels:")
    for level in summary["levels"]:
        parallel_mark = "||" if level.parallelizable else "→"
        duration = f"({level.estimated_duration_minutes}m)" if level.estimated_duration_minutes else ""
        print(f"  Level {level.level} {parallel_mark}: {', '.join(level.agents)} {duration}")

    print()
    print(f"Sequential Time: {summary['total_sequential_minutes']}m")
    print(f"Parallel Time: {summary['total_parallel_minutes']}m")
    print(f"Time Saved: {summary['time_saved_percent']}%")


if __name__ == "__main__":
    main()
