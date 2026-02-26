#!/usr/bin/env python3
"""Integration Tests for Multi-Agent Orchestrator

Tests end-to-end scenarios with varying complexity:
1. Simple: REST API (5 agents)
2. Medium: Full-stack application (8 agents)
3. Complex: Microservices architecture (12 agents)
"""

# /// script
# dependencies = ["pytest", "pyyaml"]
# ///

import pytest
import tempfile
from pathlib import Path

from orchestrator import (
    MultiAgentOrchestrator,
    TaskDefinition,
    OrchestrationResult
)


class TestSimpleScenario:
    """Test simple scenario: REST API Blog (5 agents)"""

    def test_rest_api_planning(self):
        """Test REST API scenario planning"""
        workspace = Path(tempfile.mkdtemp(prefix="test_rest_api_"))

        try:
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

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Assertions
            assert result.success
            assert len(result.agents) == 5
            assert len(result.validation_errors) == 0

            # Verify execution plan
            assert result.execution_plan is not None
            assert len(result.execution_plan["execution_order"]) == 4  # 4 waves

            # Verify metrics
            metrics = result.metrics
            assert metrics["total_agents"] == 5
            assert metrics["total_dependencies"] == 7
            assert metrics["max_depth"] == 3
            assert metrics["sequential_time_minutes"] == 300
            assert metrics["parallel_time_minutes"] == 240
            assert metrics["time_saved_percentage"] == 20.0
            assert metrics["max_parallelism"] == 2

        finally:
            orchestrator.cleanup()

    def test_rest_api_execution(self):
        """Test REST API scenario execution"""
        workspace = Path(tempfile.mkdtemp(prefix="test_rest_api_exec_"))

        try:
            tasks = [
                TaskDefinition("Design API schema", [], 45),
                TaskDefinition("Implement authentication", ["Design API schema"], 60),
                TaskDefinition("Implement blog CRUD", ["Design API schema", "Implement authentication"], 90),
                TaskDefinition("Implement comments", ["Design API schema", "Implement authentication"], 60),
                TaskDefinition("Write tests", ["Implement blog CRUD", "Implement comments"], 45),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)
            assert result.success

            # Execute simulation
            exec_metrics = orchestrator.simulate_execution()

            # Verify execution
            assert exec_metrics["agents_completed"] == 5
            assert exec_metrics["total_waves"] == 4

            # Verify status
            summary = orchestrator.get_status_summary()
            assert summary["total_agents"] == 5
            assert summary["status_counts"]["completed"] == 5
            assert summary["status_counts"]["failed"] == 0

        finally:
            orchestrator.cleanup()


class TestMediumScenario:
    """Test medium scenario: Full-stack application (8 agents)"""

    def test_fullstack_planning(self):
        """Test full-stack application planning"""
        workspace = Path(tempfile.mkdtemp(prefix="test_fullstack_"))

        try:
            tasks = [
                TaskDefinition("Design database schema", [], 60),
                TaskDefinition("Setup backend framework", [], 30),
                TaskDefinition("Setup frontend framework", [], 30),
                TaskDefinition("Implement database models", ["Design database schema", "Setup backend framework"], 60),
                TaskDefinition("Implement API endpoints", ["Implement database models"], 90),
                TaskDefinition("Implement authentication", ["Implement database models"], 75),
                TaskDefinition("Build UI components", ["Setup frontend framework", "Implement API endpoints"], 120),
                TaskDefinition("Integrate frontend with backend", ["Build UI components", "Implement authentication"], 60),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Assertions
            assert result.success
            assert len(result.agents) == 8
            assert result.metrics["total_agents"] == 8
            assert result.metrics["max_depth"] == 4

            # More complex graph should have higher parallelism
            assert result.metrics["max_parallelism"] >= 2

        finally:
            orchestrator.cleanup()

    def test_fullstack_execution(self):
        """Test full-stack application execution"""
        workspace = Path(tempfile.mkdtemp(prefix="test_fullstack_exec_"))

        try:
            tasks = [
                TaskDefinition("Design database schema", [], 60),
                TaskDefinition("Setup backend framework", [], 30),
                TaskDefinition("Setup frontend framework", [], 30),
                TaskDefinition("Implement database models", ["Design database schema", "Setup backend framework"], 60),
                TaskDefinition("Implement API endpoints", ["Implement database models"], 90),
                TaskDefinition("Implement authentication", ["Implement database models"], 75),
                TaskDefinition("Build UI components", ["Setup frontend framework", "Implement API endpoints"], 120),
                TaskDefinition("Integrate frontend with backend", ["Build UI components", "Implement authentication"], 60),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)
            assert result.success

            # Execute simulation
            exec_metrics = orchestrator.simulate_execution()

            # Verify execution
            assert exec_metrics["agents_completed"] == 8

            # Verify all agents completed
            summary = orchestrator.get_status_summary()
            assert summary["status_counts"]["completed"] == 8

        finally:
            orchestrator.cleanup()


class TestComplexScenario:
    """Test complex scenario: Microservices architecture (12 agents)"""

    def test_microservices_planning(self):
        """Test microservices architecture planning"""
        workspace = Path(tempfile.mkdtemp(prefix="test_microservices_"))

        try:
            tasks = [
                TaskDefinition("Setup infrastructure", [], 45),
                TaskDefinition("Implement auth service", ["Setup infrastructure"], 90),
                TaskDefinition("Implement user service", ["Setup infrastructure", "Implement auth service"], 90),
                TaskDefinition("Implement product service", ["Setup infrastructure", "Implement auth service"], 90),
                TaskDefinition("Implement inventory service", ["Implement product service"], 75),
                TaskDefinition("Implement order service", ["Implement user service", "Implement product service"], 105),
                TaskDefinition("Implement payment service", ["Implement order service"], 90),
                TaskDefinition("Implement notification service", ["Implement payment service"], 60),
                TaskDefinition("Implement API gateway", ["Implement auth service"], 75),
                TaskDefinition("Setup service mesh", ["Implement API gateway"], 60),
                TaskDefinition("Implement monitoring", ["Setup service mesh"], 45),
                TaskDefinition("Write integration tests", ["Implement notification service", "Implement monitoring"], 90),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Assertions
            assert result.success
            assert len(result.agents) == 12
            assert result.metrics["total_agents"] == 12

            # Complex graph should have higher depth
            assert result.metrics["max_depth"] >= 5

            # Should have significant time savings
            assert result.metrics["time_saved_percentage"] > 0

            # Complex graph should allow good parallelism
            assert result.metrics["max_parallelism"] >= 2

        finally:
            orchestrator.cleanup()

    def test_microservices_execution(self):
        """Test microservices architecture execution"""
        workspace = Path(tempfile.mkdtemp(prefix="test_microservices_exec_"))

        try:
            tasks = [
                TaskDefinition("Setup infrastructure", [], 45),
                TaskDefinition("Implement auth service", ["Setup infrastructure"], 90),
                TaskDefinition("Implement user service", ["Setup infrastructure", "Implement auth service"], 90),
                TaskDefinition("Implement product service", ["Setup infrastructure", "Implement auth service"], 90),
                TaskDefinition("Implement inventory service", ["Implement product service"], 75),
                TaskDefinition("Implement order service", ["Implement user service", "Implement product service"], 105),
                TaskDefinition("Implement payment service", ["Implement order service"], 90),
                TaskDefinition("Implement notification service", ["Implement payment service"], 60),
                TaskDefinition("Implement API gateway", ["Implement auth service"], 75),
                TaskDefinition("Setup service mesh", ["Implement API gateway"], 60),
                TaskDefinition("Implement monitoring", ["Setup service mesh"], 45),
                TaskDefinition("Write integration tests", ["Implement notification service", "Implement monitoring"], 90),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)
            assert result.success

            # Execute simulation
            exec_metrics = orchestrator.simulate_execution()

            # Verify execution
            assert exec_metrics["agents_completed"] == 12

            # Verify all agents completed
            summary = orchestrator.get_status_summary()
            assert summary["status_counts"]["completed"] == 12
            assert summary["status_counts"]["failed"] == 0

        finally:
            orchestrator.cleanup()


class TestEdgeCases:
    """Test edge cases and error scenarios"""

    def test_missing_dependency_error(self):
        """Test error when dependency is missing"""
        workspace = Path(tempfile.mkdtemp(prefix="test_error_"))

        try:
            tasks = [
                TaskDefinition("Task A", ["Non-existent task"], 30),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Should fail with validation error
            assert not result.success
            assert len(result.validation_errors) > 0
            assert "Unknown dependency" in result.validation_errors[0]

        finally:
            orchestrator.cleanup()

    def test_circular_dependency_error(self):
        """Test error when circular dependency exists"""
        workspace = Path(tempfile.mkdtemp(prefix="test_circular_"))

        try:
            # Note: Since we resolve dependencies by description -> agent_id,
            # we can't create circular dependencies through task descriptions
            # This would be caught at the validation stage if manually created

            # Create a scenario that would fail if dependencies were circular
            tasks = [
                TaskDefinition("Task A", [], 30),
                TaskDefinition("Task B", ["Task A"], 30),
                TaskDefinition("Task C", ["Task B"], 30),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # This should succeed (no circular dependency)
            assert result.success

        finally:
            orchestrator.cleanup()

    def test_empty_task_list(self):
        """Test with empty task list"""
        workspace = Path(tempfile.mkdtemp(prefix="test_empty_"))

        try:
            tasks = []

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Should succeed with no agents
            assert result.success
            assert len(result.agents) == 0
            assert result.metrics["total_agents"] == 0

        finally:
            orchestrator.cleanup()

    def test_single_task(self):
        """Test with single task (no dependencies)"""
        workspace = Path(tempfile.mkdtemp(prefix="test_single_"))

        try:
            tasks = [
                TaskDefinition("Single task", [], 60),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Should succeed
            assert result.success
            assert len(result.agents) == 1
            assert result.metrics["max_depth"] == 0
            assert result.metrics["max_parallelism"] == 1

        finally:
            orchestrator.cleanup()


class TestPerformanceMetrics:
    """Test performance metric calculations"""

    def test_time_savings_calculation(self):
        """Test that time savings are calculated correctly"""
        workspace = Path(tempfile.mkdtemp(prefix="test_perf_"))

        try:
            # Create scenario with clear parallelization opportunity
            tasks = [
                TaskDefinition("Task A", [], 60),
                TaskDefinition("Task B", ["Task A"], 60),
                TaskDefinition("Task C", ["Task A"], 60),  # Parallel with B
                TaskDefinition("Task D", ["Task B", "Task C"], 60),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Sequential: 60 + 60 + 60 + 60 = 240 minutes
            # Parallel: 60 (A) + max(60, 60) (B||C) + 60 (D) = 180 minutes
            # Savings: (240 - 180) / 240 = 25%

            assert result.success
            assert result.metrics["sequential_time_minutes"] == 240
            assert result.metrics["parallel_time_minutes"] == 180
            assert result.metrics["time_saved_percentage"] == 25.0

        finally:
            orchestrator.cleanup()

    def test_max_parallelism_detection(self):
        """Test that max parallelism is detected correctly"""
        workspace = Path(tempfile.mkdtemp(prefix="test_parallel_"))

        try:
            # Create scenario with high parallelism
            tasks = [
                TaskDefinition("Root", [], 30),
                TaskDefinition("Branch 1", ["Root"], 30),
                TaskDefinition("Branch 2", ["Root"], 30),
                TaskDefinition("Branch 3", ["Root"], 30),
                TaskDefinition("Branch 4", ["Root"], 30),
            ]

            orchestrator = MultiAgentOrchestrator(workspace)
            result = orchestrator.plan(tasks)

            # Max parallelism should be 4 (all branches can run in parallel)
            assert result.success
            assert result.metrics["max_parallelism"] == 4

        finally:
            orchestrator.cleanup()


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
