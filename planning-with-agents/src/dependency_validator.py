#!/usr/bin/env python3
"""Dependency Validator - Validate Agent Dependencies

Validates agent dependency relationships before execution:
- Checks that all dependencies exist
- Detects circular dependencies
- Validates dependency depth limits
- Checks for orphaned agents
"""

from typing import Dict, List, Set, Optional, Tuple
from dataclasses import dataclass
import graphlib


@dataclass
class ValidationError:
    """Represents a dependency validation error"""
    error_type: str  # "missing_dependency", "circular_dependency", "max_depth_exceeded", "orphaned_agent"
    message: str
    agent_id: Optional[str] = None
    dependency_id: Optional[str] = None
    cycle_path: Optional[List[str]] = None


@dataclass
class DependencyNode:
    """Represents an agent node with its dependencies"""
    agent_id: str
    depends_on: List[str]
    task_description: Optional[str] = None


class DependencyValidator:
    """Validates agent dependency graphs

    Features:
    - Missing dependency detection
    - Circular dependency detection
    - Depth limit validation
    - Orphaned agent detection
    - Self-dependency detection
    """

    def __init__(
        self,
        agents: List[DependencyNode],
        max_depth: int = 10,
        allow_orphans: bool = True
    ):
        """Initialize dependency validator

        Args:
            agents: List of agent nodes with dependencies
            max_depth: Maximum allowed dependency depth
            allow_orphans: Whether to allow agents with no dependencies
        """
        self.agents = {agent.agent_id: agent for agent in agents}
        self.max_depth = max_depth
        self.allow_orphans = allow_orphans
        self.errors: List[ValidationError] = []

    def validate(self) -> Tuple[bool, List[ValidationError]]:
        """Validate all dependency rules

        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        self.errors = []

        # Run all validation checks
        self._check_missing_dependencies()
        self._check_self_dependencies()
        self._check_circular_dependencies()
        self._check_depth_limits()

        if not self.allow_orphans:
            self._check_orphaned_agents()

        return len(self.errors) == 0, self.errors

    def _check_missing_dependencies(self) -> None:
        """Check for dependencies that don't exist"""
        for agent in self.agents.values():
            for dep_id in agent.depends_on:
                if dep_id not in self.agents:
                    self.errors.append(ValidationError(
                        error_type="missing_dependency",
                        message=f"Agent '{agent.agent_id}' depends on non-existent agent '{dep_id}'",
                        agent_id=agent.agent_id,
                        dependency_id=dep_id
                    ))

    def _check_self_dependencies(self) -> None:
        """Check for agents that depend on themselves"""
        for agent in self.agents.values():
            if agent.agent_id in agent.depends_on:
                self.errors.append(ValidationError(
                    error_type="self_dependency",
                    message=f"Agent '{agent.agent_id}' depends on itself",
                    agent_id=agent.agent_id,
                    cycle_path=[agent.agent_id, agent.agent_id]
                ))

    def _check_circular_dependencies(self) -> None:
        """Check for circular dependencies using graphlib"""
        # Build dependency graph
        graph = {
            agent_id: set(agent.depends_on)
            for agent_id, agent in self.agents.items()
        }

        try:
            # Try topological sort - will raise if cycle exists
            ts = graphlib.TopologicalSorter(graph)
            ts.prepare()
        except graphlib.CycleError as e:
            # Extract cycle information
            error_msg = str(e)

            # Try to extract cycle nodes from error message
            # graphlib.CycleError message format varies, so we detect generically
            self.errors.append(ValidationError(
                error_type="circular_dependency",
                message=f"Circular dependency detected in agent graph: {error_msg}",
                cycle_path=self._find_cycle_path(graph)
            ))

    def _find_cycle_path(self, graph: Dict[str, Set[str]]) -> List[str]:
        """Find a cycle path in the graph using DFS

        Args:
            graph: Dependency graph

        Returns:
            List of agent IDs forming a cycle
        """
        visited = set()
        rec_stack = set()
        path = []

        def dfs(node: str) -> Optional[List[str]]:
            visited.add(node)
            rec_stack.add(node)
            path.append(node)

            for neighbor in graph.get(node, set()):
                if neighbor not in visited:
                    result = dfs(neighbor)
                    if result:
                        return result
                elif neighbor in rec_stack:
                    # Found cycle - return path from neighbor to current
                    cycle_start = path.index(neighbor)
                    return path[cycle_start:] + [neighbor]

            path.pop()
            rec_stack.remove(node)
            return None

        # Try DFS from each unvisited node
        for node in graph:
            if node not in visited:
                cycle = dfs(node)
                if cycle:
                    return cycle

        return []

    def _check_depth_limits(self) -> None:
        """Check that dependency chains don't exceed max depth"""
        depths = self._calculate_depths()

        for agent_id, depth in depths.items():
            if depth > self.max_depth:
                self.errors.append(ValidationError(
                    error_type="max_depth_exceeded",
                    message=f"Agent '{agent_id}' has dependency depth {depth}, exceeds limit of {self.max_depth}",
                    agent_id=agent_id
                ))

    def _calculate_depths(self) -> Dict[str, int]:
        """Calculate dependency depth for each agent

        Returns:
            Dictionary mapping agent_id to dependency depth
        """
        depths = {}

        def get_depth(agent_id: str, visited: Set[str]) -> int:
            # Check for cycles (shouldn't happen if validation passed)
            if agent_id in visited:
                return 0

            # Check cache
            if agent_id in depths:
                return depths[agent_id]

            agent = self.agents.get(agent_id)
            if not agent:
                return 0

            # No dependencies = depth 0
            if not agent.depends_on:
                depths[agent_id] = 0
                return 0

            # Depth = 1 + max depth of dependencies
            visited.add(agent_id)
            max_dep_depth = max(
                (get_depth(dep_id, visited) for dep_id in agent.depends_on),
                default=-1
            )
            visited.remove(agent_id)

            depth = max_dep_depth + 1
            depths[agent_id] = depth
            return depth

        # Calculate depth for all agents
        for agent_id in self.agents:
            if agent_id not in depths:
                get_depth(agent_id, set())

        return depths

    def _check_orphaned_agents(self) -> None:
        """Check for agents with no dependencies (orphans)"""
        for agent in self.agents.values():
            if not agent.depends_on:
                self.errors.append(ValidationError(
                    error_type="orphaned_agent",
                    message=f"Agent '{agent.agent_id}' has no dependencies (orphaned)",
                    agent_id=agent.agent_id
                ))

    def get_dependency_depth(self, agent_id: str) -> Optional[int]:
        """Get dependency depth for a specific agent

        Args:
            agent_id: Agent identifier

        Returns:
            Dependency depth, or None if agent doesn't exist
        """
        if agent_id not in self.agents:
            return None

        depths = self._calculate_depths()
        return depths.get(agent_id)

    def get_root_agents(self) -> List[str]:
        """Get agents with no dependencies (root nodes)

        Returns:
            List of agent IDs that have no dependencies
        """
        return [
            agent_id
            for agent_id, agent in self.agents.items()
            if not agent.depends_on
        ]

    def get_leaf_agents(self) -> List[str]:
        """Get agents that no other agent depends on (leaf nodes)

        Returns:
            List of agent IDs that are not dependencies of any other agent
        """
        # Collect all dependencies
        all_dependencies = set()
        for agent in self.agents.values():
            all_dependencies.update(agent.depends_on)

        # Find agents not in dependency list
        return [
            agent_id
            for agent_id in self.agents
            if agent_id not in all_dependencies
        ]

    def get_dependency_stats(self) -> Dict[str, any]:
        """Get statistics about the dependency graph

        Returns:
            Dictionary with graph statistics
        """
        depths = self._calculate_depths()
        root_agents = self.get_root_agents()
        leaf_agents = self.get_leaf_agents()

        total_dependencies = sum(
            len(agent.depends_on)
            for agent in self.agents.values()
        )

        return {
            "total_agents": len(self.agents),
            "total_dependencies": total_dependencies,
            "root_agents": len(root_agents),
            "leaf_agents": len(leaf_agents),
            "max_depth": max(depths.values()) if depths else 0,
            "avg_dependencies_per_agent": (
                total_dependencies / len(self.agents) if self.agents else 0
            )
        }


def main():
    """Example usage of dependency validator"""
    print("=" * 70)
    print("Dependency Validator - Demo".center(70))
    print("=" * 70)
    print()

    # Example 1: Valid dependencies
    print("1. Valid dependency graph:")
    agents = [
        DependencyNode("A", [], "Root task"),
        DependencyNode("B", ["A"], "Depends on A"),
        DependencyNode("C", ["A"], "Depends on A"),
        DependencyNode("D", ["B", "C"], "Depends on B and C"),
    ]

    validator = DependencyValidator(agents)
    is_valid, errors = validator.validate()

    print(f"   Valid: {is_valid}")
    if is_valid:
        stats = validator.get_dependency_stats()
        print(f"   Total agents: {stats['total_agents']}")
        print(f"   Max depth: {stats['max_depth']}")
        print(f"   Root agents: {validator.get_root_agents()}")
        print(f"   Leaf agents: {validator.get_leaf_agents()}")
    print()

    # Example 2: Missing dependency
    print("2. Missing dependency error:")
    agents = [
        DependencyNode("A", ["B"], "Depends on non-existent B"),
    ]

    validator = DependencyValidator(agents)
    is_valid, errors = validator.validate()

    print(f"   Valid: {is_valid}")
    for error in errors:
        print(f"   ✗ {error.error_type}: {error.message}")
    print()

    # Example 3: Circular dependency
    print("3. Circular dependency error:")
    agents = [
        DependencyNode("A", ["B"], "Depends on B"),
        DependencyNode("B", ["C"], "Depends on C"),
        DependencyNode("C", ["A"], "Depends on A (cycle!)"),
    ]

    validator = DependencyValidator(agents)
    is_valid, errors = validator.validate()

    print(f"   Valid: {is_valid}")
    for error in errors:
        print(f"   ✗ {error.error_type}: {error.message}")
        if error.cycle_path:
            print(f"      Cycle: {' -> '.join(error.cycle_path)}")
    print()

    # Example 4: Depth limit exceeded
    print("4. Depth limit exceeded:")
    agents = [
        DependencyNode("A", []),
        DependencyNode("B", ["A"]),
        DependencyNode("C", ["B"]),
        DependencyNode("D", ["C"]),
        DependencyNode("E", ["D"]),
        DependencyNode("F", ["E"]),
    ]

    validator = DependencyValidator(agents, max_depth=3)
    is_valid, errors = validator.validate()

    print(f"   Valid: {is_valid}")
    for error in errors:
        print(f"   ✗ {error.error_type}: {error.message}")
    print()


if __name__ == "__main__":
    main()
