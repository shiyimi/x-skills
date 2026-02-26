#!/usr/bin/env python3
"""Unit tests for Dependency Validator

Tests:
- Missing dependency detection
- Circular dependency detection
- Self-dependency detection
- Depth limit validation
- Orphaned agent detection
- Graph statistics
"""

# /// script
# dependencies = ["pytest"]
# ///

import pytest

from dependency_validator import (
    DependencyValidator,
    DependencyNode,
    ValidationError
)


class TestBasicValidation:
    """Test basic validation functionality"""

    def test_valid_simple_graph(self):
        """Test validation of simple valid graph"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["B"]),
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        assert len(errors) == 0

    def test_valid_complex_graph(self):
        """Test validation of complex valid graph"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["A"]),
            DependencyNode("D", ["B", "C"]),
            DependencyNode("E", ["B", "C"]),
            DependencyNode("F", ["D", "E"]),
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        assert len(errors) == 0

    def test_single_agent_no_dependencies(self):
        """Test single agent with no dependencies"""
        agents = [DependencyNode("A", [])]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        assert len(errors) == 0


class TestMissingDependencies:
    """Test missing dependency detection"""

    def test_single_missing_dependency(self):
        """Test detection of single missing dependency"""
        agents = [
            DependencyNode("A", ["B"]),  # B doesn't exist
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        assert len(errors) == 1
        assert errors[0].error_type == "missing_dependency"
        assert errors[0].agent_id == "A"
        assert errors[0].dependency_id == "B"

    def test_multiple_missing_dependencies(self):
        """Test detection of multiple missing dependencies"""
        agents = [
            DependencyNode("A", ["B", "C"]),  # Both don't exist
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        assert len(errors) == 2
        missing_deps = {e.dependency_id for e in errors}
        assert missing_deps == {"B", "C"}

    def test_partial_missing_dependencies(self):
        """Test when some dependencies exist, some don't"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A", "C"]),  # A exists, C doesn't
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        assert len(errors) == 1
        assert errors[0].dependency_id == "C"


class TestCircularDependencies:
    """Test circular dependency detection"""

    def test_self_dependency(self):
        """Test detection of agent depending on itself"""
        agents = [
            DependencyNode("A", ["A"]),  # Self-dependency
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        # Should have both self_dependency and circular_dependency errors
        error_types = {e.error_type for e in errors}
        assert "self_dependency" in error_types

    def test_direct_circular_dependency(self):
        """Test detection of direct circular dependency"""
        agents = [
            DependencyNode("A", ["B"]),
            DependencyNode("B", ["A"]),
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        assert any(e.error_type == "circular_dependency" for e in errors)

    def test_indirect_circular_dependency(self):
        """Test detection of indirect circular dependency"""
        agents = [
            DependencyNode("A", ["B"]),
            DependencyNode("B", ["C"]),
            DependencyNode("C", ["A"]),  # Creates cycle A -> B -> C -> A
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        circular_errors = [e for e in errors if e.error_type == "circular_dependency"]
        assert len(circular_errors) > 0

        # Check cycle path is detected
        error = circular_errors[0]
        assert error.cycle_path is not None
        assert len(error.cycle_path) > 0

    def test_complex_circular_dependency(self):
        """Test detection of circular dependency in complex graph"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["B"]),
            DependencyNode("D", ["C"]),
            DependencyNode("E", ["D", "B"]),  # E -> D -> C -> B creates valid path
            DependencyNode("F", ["E"]),
            DependencyNode("B2", ["F"]),  # This creates cycle if we connect to B
        ]

        # Valid graph
        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()
        assert is_valid

        # Add cycle: modify B to depend on F
        agents[1] = DependencyNode("B", ["A", "F"])
        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()
        assert not is_valid


class TestDepthLimits:
    """Test dependency depth limit validation"""

    def test_depth_within_limit(self):
        """Test graph within depth limit"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["B"]),
        ]

        validator = DependencyValidator(agents, max_depth=5)
        is_valid, errors = validator.validate()

        assert is_valid
        assert validator.get_dependency_depth("A") == 0
        assert validator.get_dependency_depth("B") == 1
        assert validator.get_dependency_depth("C") == 2

    def test_depth_exceeds_limit(self):
        """Test detection when depth exceeds limit"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["B"]),
            DependencyNode("D", ["C"]),
            DependencyNode("E", ["D"]),
        ]

        validator = DependencyValidator(agents, max_depth=2)
        is_valid, errors = validator.validate()

        assert not is_valid
        depth_errors = [e for e in errors if e.error_type == "max_depth_exceeded"]
        assert len(depth_errors) == 2  # D and E exceed limit

    def test_depth_calculation_complex_graph(self):
        """Test depth calculation in complex graph"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", []),
            DependencyNode("C", ["A", "B"]),  # Depth 1 (max of dependencies + 1)
            DependencyNode("D", ["C"]),  # Depth 2
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        assert validator.get_dependency_depth("C") == 1
        assert validator.get_dependency_depth("D") == 2


class TestOrphanedAgents:
    """Test orphaned agent detection"""

    def test_allow_orphans_by_default(self):
        """Test that orphans are allowed by default"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", []),
        ]

        validator = DependencyValidator(agents, allow_orphans=True)
        is_valid, errors = validator.validate()

        assert is_valid

    def test_detect_orphans_when_disabled(self):
        """Test orphan detection when not allowed"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", []),  # Orphan
        ]

        validator = DependencyValidator(agents, allow_orphans=False)
        is_valid, errors = validator.validate()

        assert not is_valid
        orphan_errors = [e for e in errors if e.error_type == "orphaned_agent"]
        assert len(orphan_errors) == 2  # A and C are orphans


class TestGraphAnalysis:
    """Test graph analysis methods"""

    def test_get_root_agents(self):
        """Test getting root agents (no dependencies)"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", []),
            DependencyNode("C", ["A"]),
            DependencyNode("D", ["B", "C"]),
        ]

        validator = DependencyValidator(agents)
        roots = validator.get_root_agents()

        assert set(roots) == {"A", "B"}

    def test_get_leaf_agents(self):
        """Test getting leaf agents (not depended on)"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["A"]),
            DependencyNode("D", ["B"]),
        ]

        validator = DependencyValidator(agents)
        leaves = validator.get_leaf_agents()

        assert set(leaves) == {"C", "D"}

    def test_get_dependency_stats(self):
        """Test getting dependency statistics"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
            DependencyNode("C", ["A", "B"]),
        ]

        validator = DependencyValidator(agents)
        stats = validator.get_dependency_stats()

        assert stats["total_agents"] == 3
        assert stats["total_dependencies"] == 3  # 0 + 1 + 2
        assert stats["root_agents"] == 1  # A
        assert stats["leaf_agents"] == 1  # C
        assert stats["max_depth"] == 2  # C has depth 2
        assert stats["avg_dependencies_per_agent"] == 1.0

    def test_empty_graph_stats(self):
        """Test statistics for empty graph"""
        validator = DependencyValidator([])
        stats = validator.get_dependency_stats()

        assert stats["total_agents"] == 0
        assert stats["total_dependencies"] == 0
        assert stats["avg_dependencies_per_agent"] == 0


class TestEdgeCases:
    """Test edge cases"""

    def test_empty_agent_list(self):
        """Test validation with empty agent list"""
        validator = DependencyValidator([])
        is_valid, errors = validator.validate()

        assert is_valid
        assert len(errors) == 0

    def test_get_depth_nonexistent_agent(self):
        """Test getting depth for non-existent agent"""
        agents = [DependencyNode("A", [])]
        validator = DependencyValidator(agents)

        depth = validator.get_dependency_depth("nonexistent")
        assert depth is None

    def test_multiple_validation_calls(self):
        """Test that validate can be called multiple times"""
        agents = [
            DependencyNode("A", []),
            DependencyNode("B", ["A"]),
        ]

        validator = DependencyValidator(agents)

        is_valid1, errors1 = validator.validate()
        is_valid2, errors2 = validator.validate()

        assert is_valid1 == is_valid2
        assert len(errors1) == len(errors2)


class TestRealWorldScenarios:
    """Test with real-world scenarios"""

    def test_rest_api_example(self):
        """Test validation of REST API example from docs"""
        agents = [
            DependencyNode("a3b2c1", [], "Design API schema"),
            DependencyNode("4f8e2d", ["a3b2c1"], "Implement authentication"),
            DependencyNode("2b3e5d", ["a3b2c1", "4f8e2d"], "Implement blog CRUD"),
            DependencyNode("6a8c4f", ["a3b2c1", "4f8e2d"], "Implement comments"),
            DependencyNode("7c9f1a", ["2b3e5d", "6a8c4f"], "Write tests"),
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        stats = validator.get_dependency_stats()
        assert stats["total_agents"] == 5
        assert stats["max_depth"] == 3  # 7c9f1a has max depth

    def test_microservices_architecture(self):
        """Test validation of microservices dependency graph"""
        agents = [
            DependencyNode("infra", [], "Setup infrastructure"),
            DependencyNode("auth", ["infra"], "Auth service"),
            DependencyNode("user", ["infra", "auth"], "User service"),
            DependencyNode("product", ["infra", "auth"], "Product service"),
            DependencyNode("order", ["user", "product"], "Order service"),
            DependencyNode("payment", ["order"], "Payment service"),
            DependencyNode("notification", ["payment"], "Notification service"),
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert is_valid
        assert validator.get_dependency_depth("notification") == 5

    def test_invalid_microservices_with_cycle(self):
        """Test detection of cycle in microservices graph"""
        agents = [
            DependencyNode("auth", ["user"], "Auth service"),
            DependencyNode("user", ["product"], "User service"),
            DependencyNode("product", ["auth"], "Product service"),  # Cycle!
        ]

        validator = DependencyValidator(agents)
        is_valid, errors = validator.validate()

        assert not is_valid
        assert any(e.error_type == "circular_dependency" for e in errors)


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
