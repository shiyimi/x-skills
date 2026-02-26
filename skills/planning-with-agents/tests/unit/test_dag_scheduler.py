#!/usr/bin/env python3
"""Unit tests for DAG Scheduler

Tests:
- Topological sorting
- Cycle detection
- Parallel execution planning
- Dependency validation
"""

# /// script
# dependencies = ["pytest"]
# ///

import pytest

from dag_scheduler import DAGScheduler, AgentNode, ExecutionLevel


class TestDAGSchedulerBasic:
    """Basic functionality tests"""

    def test_simple_linear_graph(self):
        """Test simple linear dependency: A -> B -> C"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 20),
            AgentNode("C", "Task C", ["B"], "low", 15),
        ]

        scheduler = DAGScheduler(agents)
        levels = scheduler.topological_sort()

        assert len(levels) == 3
        assert levels[0].agents == ["A"]
        assert levels[1].agents == ["B"]
        assert levels[2].agents == ["C"]

        # All levels should be sequential (not parallel)
        assert not levels[0].parallelizable
        assert not levels[1].parallelizable
        assert not levels[2].parallelizable

    def test_simple_parallel_graph(self):
        """Test parallel execution: A -> (B, C) -> D"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 20),
            AgentNode("C", "Task C", ["A"], "medium", 15),
            AgentNode("D", "Task D", ["B", "C"], "low", 10),
        ]

        scheduler = DAGScheduler(agents)
        levels = scheduler.topological_sort()

        assert len(levels) == 3
        assert levels[0].agents == ["A"]
        assert set(levels[1].agents) == {"B", "C"}
        assert levels[1].parallelizable  # B and C can run in parallel
        assert levels[2].agents == ["D"]

    def test_complex_dag(self):
        """Test complex DAG with multiple parallel paths"""
        # Graph structure:
        #     A
        #    / \
        #   B   C
        #   |\ /|
        #   | X |
        #   |/ \|
        #   D   E
        #    \ /
        #     F
        agents = [
            AgentNode("A", "Task A", [], "high"),
            AgentNode("B", "Task B", ["A"], "high"),
            AgentNode("C", "Task C", ["A"], "high"),
            AgentNode("D", "Task D", ["B", "C"], "medium"),
            AgentNode("E", "Task E", ["B", "C"], "medium"),
            AgentNode("F", "Task F", ["D", "E"], "low"),
        ]

        scheduler = DAGScheduler(agents)
        levels = scheduler.topological_sort()

        # Verify levels
        assert levels[0].agents == ["A"]
        assert set(levels[1].agents) == {"B", "C"}
        assert levels[1].parallelizable
        assert set(levels[2].agents) == {"D", "E"}
        assert levels[2].parallelizable
        assert levels[3].agents == ["F"]


class TestCycleDetection:
    """Test cycle detection capabilities"""

    def test_direct_cycle(self):
        """Test detection of direct cycle: A -> B -> A"""
        agents = [
            AgentNode("A", "Task A", ["B"], "high"),
            AgentNode("B", "Task B", ["A"], "medium"),
        ]

        scheduler = DAGScheduler(agents)
        cycle = scheduler.detect_cycles()

        assert cycle is not None
        assert len(cycle) > 0

    def test_indirect_cycle(self):
        """Test detection of indirect cycle: A -> B -> C -> A"""
        agents = [
            AgentNode("A", "Task A", ["C"], "high"),
            AgentNode("B", "Task B", ["A"], "medium"),
            AgentNode("C", "Task C", ["B"], "low"),
        ]

        scheduler = DAGScheduler(agents)
        cycle = scheduler.detect_cycles()

        assert cycle is not None

    def test_self_cycle(self):
        """Test detection of self-referential cycle: A -> A"""
        agents = [
            AgentNode("A", "Task A", ["A"], "high"),
        ]

        scheduler = DAGScheduler(agents)
        cycle = scheduler.detect_cycles()

        assert cycle is not None

    def test_no_cycle_complex(self):
        """Test that valid DAG has no cycle"""
        agents = [
            AgentNode("A", "Task A", [], "high"),
            AgentNode("B", "Task B", ["A"], "high"),
            AgentNode("C", "Task C", ["A"], "high"),
            AgentNode("D", "Task D", ["B", "C"], "medium"),
        ]

        scheduler = DAGScheduler(agents)
        cycle = scheduler.detect_cycles()

        assert cycle is None

    def test_topological_sort_with_cycle_raises(self):
        """Test that topological sort raises error on cycle"""
        agents = [
            AgentNode("A", "Task A", ["B"], "high"),
            AgentNode("B", "Task B", ["A"], "medium"),
        ]

        scheduler = DAGScheduler(agents)

        with pytest.raises(ValueError, match="cycle detected"):
            scheduler.topological_sort()


class TestDependencyValidation:
    """Test dependency validation"""

    def test_missing_dependency(self):
        """Test error when agent depends on non-existent agent"""
        agents = [
            AgentNode("A", "Task A", ["B"], "high"),  # B doesn't exist
        ]

        with pytest.raises(ValueError, match="non-existent agent"):
            DAGScheduler(agents)

    def test_duplicate_agent_ids(self):
        """Test error when duplicate agent IDs exist"""
        agents = [
            AgentNode("A", "Task A", [], "high"),
            AgentNode("A", "Task A Duplicate", [], "medium"),  # Duplicate ID
        ]

        with pytest.raises(ValueError, match="Duplicate agent IDs"):
            DAGScheduler(agents)

    def test_valid_dependencies(self):
        """Test that valid dependencies pass validation"""
        agents = [
            AgentNode("A", "Task A", [], "high"),
            AgentNode("B", "Task B", ["A"], "medium"),
            AgentNode("C", "Task C", ["A", "B"], "low"),
        ]

        # Should not raise
        scheduler = DAGScheduler(agents)
        assert len(scheduler.agents) == 3


class TestExecutionPlanMetrics:
    """Test execution plan metrics and time calculations"""

    def test_sequential_time_calculation(self):
        """Test sequential time is sum of all durations"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 20),
            AgentNode("C", "Task C", ["B"], "low", 15),
        ]

        scheduler = DAGScheduler(agents)
        summary = scheduler.get_execution_summary()

        assert summary["total_sequential_minutes"] == 45

    def test_parallel_time_calculation(self):
        """Test parallel time uses max duration at each level"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 20),
            AgentNode("C", "Task C", ["A"], "medium", 15),
            AgentNode("D", "Task D", ["B", "C"], "low", 10),
        ]

        scheduler = DAGScheduler(agents)
        summary = scheduler.get_execution_summary()

        # Sequential: 10 + 20 + 15 + 10 = 55
        # Parallel: 10 + max(20, 15) + 10 = 40
        assert summary["total_sequential_minutes"] == 55
        assert summary["total_parallel_minutes"] == 40

    def test_time_saved_percentage(self):
        """Test time saved percentage calculation"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 30),
            AgentNode("C", "Task C", ["A"], "medium", 20),
        ]

        scheduler = DAGScheduler(agents)
        summary = scheduler.get_execution_summary()

        # Sequential: 10 + 30 + 20 = 60
        # Parallel: 10 + max(30, 20) = 40
        # Saved: (60 - 40) / 60 = 33.33%
        assert summary["total_sequential_minutes"] == 60
        assert summary["total_parallel_minutes"] == 40
        assert summary["time_saved_percent"] == 33.3

    def test_max_parallelism(self):
        """Test max parallelism detection"""
        agents = [
            AgentNode("A", "Task A", [], "high"),
            AgentNode("B", "Task B", ["A"], "medium"),
            AgentNode("C", "Task C", ["A"], "medium"),
            AgentNode("D", "Task D", ["A"], "medium"),
        ]

        scheduler = DAGScheduler(agents)
        summary = scheduler.get_execution_summary()

        # Level 1 has 3 agents (B, C, D) in parallel
        assert summary["max_parallelism"] == 3


class TestYAMLExport:
    """Test YAML export functionality"""

    def test_yaml_dict_structure(self):
        """Test that YAML export has correct structure"""
        agents = [
            AgentNode("A", "Task A", [], "high", 10),
            AgentNode("B", "Task B", ["A"], "medium", 20),
        ]

        scheduler = DAGScheduler(agents)
        yaml_dict = scheduler.to_yaml_dict()

        # Check top-level structure
        assert "version" in yaml_dict
        assert "dependencies" in yaml_dict
        assert "execution_plan" in yaml_dict

        # Check dependencies section
        assert len(yaml_dict["dependencies"]) == 2
        assert yaml_dict["dependencies"][0]["agent_id"] == "A"
        assert yaml_dict["dependencies"][1]["agent_id"] == "B"

        # Check execution plan
        plan = yaml_dict["execution_plan"]
        assert "levels" in plan
        assert "total_sequential_minutes" in plan
        assert "total_parallel_minutes" in plan
        assert "time_saved_percent" in plan

    def test_yaml_matches_spec(self):
        """Test that YAML output matches dependencies.yaml spec"""
        agents = [
            AgentNode("a3b2c1", "Design API schema", [], "high", 30),
            AgentNode("4f8e2d", "Implement auth", ["a3b2c1"], "high", 60),
        ]

        scheduler = DAGScheduler(agents)
        yaml_dict = scheduler.to_yaml_dict()

        # Check required fields from spec
        dep = yaml_dict["dependencies"][0]
        assert "agent_id" in dep
        assert "task" in dep
        assert "depends_on" in dep
        assert "priority" in dep
        assert "estimated_duration_minutes" in dep

        # Check execution plan level structure
        level = yaml_dict["execution_plan"]["levels"][0]
        assert "level" in level
        assert "agents" in level
        assert "parallelizable" in level


class TestRealWorldScenarios:
    """Test with real-world scenarios from examples"""

    def test_simple_example_rest_api(self):
        """Test scenario from simple-example.md"""
        agents = [
            AgentNode("a3b2c1", "Design API schema", [], "high", 30),
            AgentNode("4f8e2d", "Implement authentication", ["a3b2c1"], "high", 60),
            AgentNode("2b3e5d", "Implement blog post CRUD", ["a3b2c1", "4f8e2d"], "medium", 45),
            AgentNode("6a8c4f", "Implement comments feature", ["a3b2c1", "4f8e2d"], "low", 40),
            AgentNode("7c9f1a", "Write integration tests", ["2b3e5d", "6a8c4f"], "medium", 30),
        ]

        scheduler = DAGScheduler(agents)
        summary = scheduler.get_execution_summary()

        # Verify execution plan
        assert summary["total_agents"] == 5
        assert summary["total_levels"] == 4

        # Level 2 should have parallel agents (blog CRUD + comments)
        levels = summary["levels"]
        level_2 = levels[2]
        assert level_2.parallelizable
        assert set(level_2.agents) == {"2b3e5d", "6a8c4f"}

        # Time saved should be significant due to parallelization
        assert summary["time_saved_percent"] > 0


def main():
    """Run tests with pytest"""
    import subprocess
    result = subprocess.run(
        ["pytest", __file__, "-v", "--tb=short"],
        capture_output=False
    )
    return result.returncode


if __name__ == "__main__":
    import sys
    sys.exit(main())
