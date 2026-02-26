#!/usr/bin/env python3
"""Unit tests for Agent ID Generator

Tests:
- ID generation (single, batch, uniqueness)
- Collision detection and retry
- Format validation
- Existing ID registration
- Workspace scanning
- Pool management
"""

# /// script
# dependencies = ["pytest"]
# ///

import pytest
import tempfile
from pathlib import Path

from agent_id_generator import AgentIDGenerator


class TestIDGeneration:
    """Test basic ID generation"""

    def test_generate_single_id(self):
        """Test generating a single ID"""
        generator = AgentIDGenerator()
        agent_id = generator.generate()

        assert isinstance(agent_id, str)
        assert len(agent_id) == AgentIDGenerator.ID_LENGTH
        assert generator.is_valid_format(agent_id)

    def test_generate_unique_ids(self):
        """Test that generated IDs are unique"""
        generator = AgentIDGenerator()
        ids = generator.generate_batch(100)

        # All should be unique
        assert len(ids) == len(set(ids))

    def test_generate_batch(self):
        """Test batch generation"""
        generator = AgentIDGenerator()
        count = 50
        ids = generator.generate_batch(count)

        assert len(ids) == count
        assert all(generator.is_valid_format(id) for id in ids)
        assert len(set(ids)) == count  # All unique

    def test_id_uses_correct_charset(self):
        """Test that IDs only use lowercase letters and digits"""
        generator = AgentIDGenerator()
        ids = generator.generate_batch(100)

        for agent_id in ids:
            assert all(
                c in AgentIDGenerator.CHARSET
                for c in agent_id
            ), f"ID '{agent_id}' contains invalid character"

    def test_id_length_consistent(self):
        """Test that all IDs have consistent length"""
        generator = AgentIDGenerator()
        ids = generator.generate_batch(100)

        assert all(
            len(agent_id) == AgentIDGenerator.ID_LENGTH
            for agent_id in ids
        )


class TestCollisionDetection:
    """Test collision detection and avoidance"""

    def test_avoids_existing_ids(self):
        """Test that generator avoids existing IDs"""
        # Use IDs that are statistically very unlikely to be randomly generated
        # to avoid false test failures
        existing = {"zzzzzz", "yyyyyy", "xxxxxx"}
        generator = AgentIDGenerator(existing)

        # Generate 10 IDs
        new_ids = generator.generate_batch(10)

        # None should match existing
        assert all(id not in existing for id in new_ids)

    def test_tracks_generated_ids(self):
        """Test that generator tracks its own generated IDs"""
        generator = AgentIDGenerator()

        id1 = generator.generate()
        id2 = generator.generate()
        id3 = generator.generate()

        assert id1 != id2
        assert id2 != id3
        assert id1 != id3

    def test_pool_size_tracking(self):
        """Test that pool size is tracked correctly"""
        generator = AgentIDGenerator()

        assert generator.get_pool_size() == 0

        generator.generate()
        assert generator.get_pool_size() == 1

        generator.generate_batch(10)
        assert generator.get_pool_size() == 11

    def test_collision_with_near_full_pool(self):
        """Test behavior when pool is nearly full"""
        # Create small pool for testing
        # With 36^6 possible IDs, collision is extremely rare
        # So we test the tracking mechanism instead

        existing = set(f"test{i:02d}" for i in range(10))
        generator = AgentIDGenerator(existing)

        # Generate more IDs
        new_ids = generator.generate_batch(10)

        # Should not collide with existing
        assert len(set(new_ids) & existing) == 0


class TestFormatValidation:
    """Test ID format validation"""

    def test_valid_format_lowercase_digits(self):
        """Test that valid format is accepted"""
        generator = AgentIDGenerator()

        valid_ids = ["a3b2c1", "4f8e2d", "abc123", "123456", "abcdef"]

        for agent_id in valid_ids:
            assert generator.is_valid_format(agent_id), f"'{agent_id}' should be valid"

    def test_invalid_format_uppercase(self):
        """Test that uppercase letters are rejected"""
        generator = AgentIDGenerator()

        assert not generator.is_valid_format("ABC123")
        assert not generator.is_valid_format("Abc123")

    def test_invalid_format_wrong_length(self):
        """Test that wrong length is rejected"""
        generator = AgentIDGenerator()

        assert not generator.is_valid_format("abc12")    # Too short
        assert not generator.is_valid_format("abc1234")  # Too long
        assert not generator.is_valid_format("")         # Empty

    def test_invalid_format_special_chars(self):
        """Test that special characters are rejected"""
        generator = AgentIDGenerator()

        assert not generator.is_valid_format("abc-12")
        assert not generator.is_valid_format("abc_12")
        assert not generator.is_valid_format("abc 12")
        assert not generator.is_valid_format("abc@12")


class TestExistingIDRegistration:
    """Test registration of existing IDs"""

    def test_register_valid_id(self):
        """Test registering a valid existing ID"""
        generator = AgentIDGenerator()

        generator.register_existing("abc123")

        assert "abc123" in generator.existing_ids
        assert generator.get_pool_size() == 1

    def test_register_invalid_id_raises(self):
        """Test that registering invalid ID raises error"""
        generator = AgentIDGenerator()

        with pytest.raises(ValueError, match="Invalid agent ID format"):
            generator.register_existing("ABC123")  # Uppercase

        with pytest.raises(ValueError, match="Invalid agent ID format"):
            generator.register_existing("abc12")   # Too short

    def test_register_multiple_ids(self):
        """Test registering multiple IDs"""
        generator = AgentIDGenerator()

        ids = ["abc123", "def456", "xyz789"]
        for agent_id in ids:
            generator.register_existing(agent_id)

        assert generator.get_pool_size() == len(ids)
        assert all(id in generator.existing_ids for id in ids)

    def test_generated_ids_avoid_registered(self):
        """Test that generation avoids registered IDs"""
        generator = AgentIDGenerator()

        registered = ["abc123", "def456"]
        for agent_id in registered:
            generator.register_existing(agent_id)

        # Generate IDs
        new_ids = generator.generate_batch(10)

        # Should not collide with registered
        assert all(id not in registered for id in new_ids)


class TestWorkspaceScanning:
    """Test workspace scanning functionality"""

    def test_scan_empty_workspace(self):
        """Test scanning empty workspace"""
        with tempfile.TemporaryDirectory() as tmpdir:
            workspace = Path(tmpdir)
            scanned = AgentIDGenerator.scan_workspace(workspace)

            assert len(scanned) == 0

    def test_scan_nonexistent_workspace(self):
        """Test scanning non-existent workspace"""
        workspace = Path("/nonexistent/path/12345")
        scanned = AgentIDGenerator.scan_workspace(workspace)

        assert len(scanned) == 0

    def test_scan_with_agent_directories(self):
        """Test scanning workspace with agent directories"""
        with tempfile.TemporaryDirectory() as tmpdir:
            workspace = Path(tmpdir)

            # Create agent directories
            (workspace / "agent-abc123").mkdir()
            (workspace / "agent-def456").mkdir()
            (workspace / "agent-xyz789").mkdir()

            scanned = AgentIDGenerator.scan_workspace(workspace)

            assert len(scanned) == 3
            assert "abc123" in scanned
            assert "def456" in scanned
            assert "xyz789" in scanned

    def test_scan_ignores_non_agent_directories(self):
        """Test that scanning ignores non-agent directories"""
        with tempfile.TemporaryDirectory() as tmpdir:
            workspace = Path(tmpdir)

            # Create mix of directories
            (workspace / "agent-abc123").mkdir()
            (workspace / "other-dir").mkdir()
            (workspace / "temp").mkdir()
            (workspace / "agent-def456").mkdir()

            scanned = AgentIDGenerator.scan_workspace(workspace)

            assert len(scanned) == 2
            assert "abc123" in scanned
            assert "def456" in scanned

    def test_scan_ignores_files(self):
        """Test that scanning ignores files"""
        with tempfile.TemporaryDirectory() as tmpdir:
            workspace = Path(tmpdir)

            # Create agent directory and file
            (workspace / "agent-abc123").mkdir()
            (workspace / "agent-def456.txt").write_text("test")

            scanned = AgentIDGenerator.scan_workspace(workspace)

            assert len(scanned) == 1
            assert "abc123" in scanned


class TestPoolManagement:
    """Test pool management operations"""

    def test_reset_clears_pool(self):
        """Test that reset clears all tracked IDs"""
        generator = AgentIDGenerator()

        # Generate some IDs
        generator.generate_batch(10)
        assert generator.get_pool_size() == 10

        # Reset
        generator.reset()
        assert generator.get_pool_size() == 0

    def test_can_regenerate_after_reset(self):
        """Test that IDs can be regenerated after reset"""
        generator = AgentIDGenerator()

        # Generate IDs
        first_batch = generator.generate_batch(5)
        first_ids = set(first_batch)

        # Reset and generate again
        generator.reset()
        second_batch = generator.generate_batch(5)

        # All should be valid
        assert all(generator.is_valid_format(id) for id in second_batch)

        # May or may not overlap (probability is very low)
        # Just verify they're valid IDs

    def test_collision_probability_increases_with_pool(self):
        """Test that collision probability estimate increases"""
        generator = AgentIDGenerator()

        prob_0 = generator.estimate_collision_probability()
        assert prob_0 == 0.0  # Empty pool

        # Add IDs
        generator.generate_batch(100)
        prob_100 = generator.estimate_collision_probability()

        generator.generate_batch(900)
        prob_1000 = generator.estimate_collision_probability()

        # Probability should increase (though still very small)
        assert prob_100 > prob_0
        assert prob_1000 > prob_100


class TestEdgeCases:
    """Test edge cases and error conditions"""

    def test_initialize_with_existing_set(self):
        """Test initialization with existing ID set"""
        existing = {"abc123", "def456"}
        generator = AgentIDGenerator(existing)

        assert generator.get_pool_size() == 2
        assert "abc123" in generator.existing_ids

    def test_initialize_without_existing(self):
        """Test initialization without existing IDs"""
        generator = AgentIDGenerator()

        assert generator.get_pool_size() == 0
        assert len(generator.existing_ids) == 0

    def test_multiple_generators_independent(self):
        """Test that multiple generators are independent"""
        gen1 = AgentIDGenerator()
        gen2 = AgentIDGenerator()

        id1 = gen1.generate()
        id2 = gen2.generate()

        # Should be able to generate independently
        # (may or may not be the same - probability is very low)
        assert gen1.get_pool_size() == 1
        assert gen2.get_pool_size() == 1


class TestIntegrationScenarios:
    """Test real-world integration scenarios"""

    def test_workspace_integration(self):
        """Test full workflow: scan workspace and generate new IDs"""
        with tempfile.TemporaryDirectory() as tmpdir:
            workspace = Path(tmpdir)

            # Create existing agent directories
            (workspace / "agent-abc123").mkdir()
            (workspace / "agent-def456").mkdir()

            # Scan and initialize generator
            existing = AgentIDGenerator.scan_workspace(workspace)
            generator = AgentIDGenerator(existing)

            # Generate new IDs
            new_ids = generator.generate_batch(5)

            # New IDs should not conflict with existing
            assert "abc123" not in new_ids
            assert "def456" not in new_ids
            assert len(new_ids) == 5

    def test_incremental_registration(self):
        """Test incrementally registering IDs as agents are created"""
        generator = AgentIDGenerator()

        # Simulate creating agents one by one
        agents = []
        for _ in range(10):
            agent_id = generator.generate()
            agents.append(agent_id)

        # All should be unique
        assert len(set(agents)) == 10
        assert generator.get_pool_size() == 10

    def test_parallel_generation_safety(self):
        """Test that generator handles rapid generation safely"""
        generator = AgentIDGenerator()

        # Generate many IDs rapidly
        ids = []
        for _ in range(100):
            agent_id = generator.generate()
            ids.append(agent_id)

        # All should be unique
        assert len(set(ids)) == 100


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
