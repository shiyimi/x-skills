#!/usr/bin/env python3
"""Agent ID Generator - Short Unique ID Generation

Generates short, unique IDs for sub-agents using:
- Base62 encoding (a-z, A-Z, 0-9)
- Timestamp-based sequential IDs
- Collision detection and retry
- Human-readable format (e.g., "a3b2c1", "4f8e2d")
"""

import random
import string
import time
from typing import Set, Optional
from pathlib import Path


class AgentIDGenerator:
    """Generates short, unique identifiers for agents

    Features:
    - 6-character alphanumeric IDs
    - Collision detection with retry
    - Optional conflict checking against existing IDs
    - Base62 encoding for readability
    """

    # Character set: lowercase letters + digits (more readable than full base62)
    CHARSET = string.ascii_lowercase + string.digits
    ID_LENGTH = 6
    MAX_RETRIES = 10

    def __init__(self, existing_ids: Optional[Set[str]] = None):
        """Initialize ID generator

        Args:
            existing_ids: Set of existing IDs to avoid collisions
        """
        # Create a copy to avoid modifying the original set
        self.existing_ids = set(existing_ids) if existing_ids else set()
        self._random = random.Random()
        # Seed with time + process info for uniqueness
        self._random.seed(int(time.time() * 1000) + id(self))

    def generate(self) -> str:
        """Generate a new unique agent ID

        Returns:
            6-character lowercase alphanumeric ID

        Raises:
            RuntimeError: If unable to generate unique ID after MAX_RETRIES
        """
        for _ in range(self.MAX_RETRIES):
            # Generate random 6-character ID
            agent_id = ''.join(
                self._random.choice(self.CHARSET)
                for _ in range(self.ID_LENGTH)
            )

            # Check for collision
            if agent_id not in self.existing_ids:
                self.existing_ids.add(agent_id)
                return agent_id

        # If we get here, we failed to generate unique ID
        raise RuntimeError(
            f"Failed to generate unique agent ID after {self.MAX_RETRIES} attempts. "
            f"Current ID pool size: {len(self.existing_ids)}"
        )

    def generate_batch(self, count: int) -> list[str]:
        """Generate multiple unique IDs

        Args:
            count: Number of IDs to generate

        Returns:
            List of unique agent IDs
        """
        return [self.generate() for _ in range(count)]

    def is_valid_format(self, agent_id: str) -> bool:
        """Check if an ID matches the expected format

        Args:
            agent_id: ID to validate

        Returns:
            True if ID format is valid
        """
        if len(agent_id) != self.ID_LENGTH:
            return False

        return all(c in self.CHARSET for c in agent_id)

    def register_existing(self, agent_id: str) -> None:
        """Register an existing ID to avoid collisions

        Args:
            agent_id: Existing agent ID to register

        Raises:
            ValueError: If ID format is invalid
        """
        if not self.is_valid_format(agent_id):
            raise ValueError(
                f"Invalid agent ID format: '{agent_id}'. "
                f"Expected {self.ID_LENGTH} characters from {self.CHARSET}"
            )

        self.existing_ids.add(agent_id)

    @staticmethod
    def scan_workspace(workspace_dir: Path) -> Set[str]:
        """Scan workspace directory for existing agent IDs

        Args:
            workspace_dir: Base directory containing agent workspaces

        Returns:
            Set of existing agent IDs found in directory names
        """
        existing = set()

        if not workspace_dir.exists():
            return existing

        for agent_dir in workspace_dir.iterdir():
            if agent_dir.is_dir() and agent_dir.name.startswith("agent-"):
                # Extract ID from "agent-{id}" directory name
                agent_id = agent_dir.name.replace("agent-", "")
                existing.add(agent_id)

        return existing

    def reset(self) -> None:
        """Clear all tracked IDs"""
        self.existing_ids.clear()

    def get_pool_size(self) -> int:
        """Get current size of ID pool

        Returns:
            Number of IDs currently in use
        """
        return len(self.existing_ids)

    def estimate_collision_probability(self) -> float:
        """Estimate probability of collision on next generate()

        Returns:
            Probability (0.0 to 1.0) of collision

        Note:
            With 36^6 possible IDs (2,176,782,336), collision becomes
            likely after ~50,000 IDs (birthday paradox)
        """
        total_possible = len(self.CHARSET) ** self.ID_LENGTH
        used = len(self.existing_ids)

        if used == 0:
            return 0.0

        # Birthday paradox approximation
        return 1.0 - (total_possible - used) / total_possible


def main():
    """Example usage of agent ID generator"""
    print("=" * 70)
    print("Agent ID Generator - Demo".center(70))
    print("=" * 70)
    print()

    # Create generator
    generator = AgentIDGenerator()

    print("1. Generating 10 unique IDs...")
    ids = generator.generate_batch(10)
    for i, agent_id in enumerate(ids, 1):
        print(f"   {i:2d}. {agent_id}")
    print()

    # Collision detection
    print("2. Testing collision detection...")
    existing = {"abc123", "def456", "xyz789"}
    gen_with_existing = AgentIDGenerator(existing)

    new_id = gen_with_existing.generate()
    print(f"   Generated: {new_id}")
    print(f"   Existing pool size: {gen_with_existing.get_pool_size()}")
    print()

    # Format validation
    print("3. Testing format validation...")
    test_ids = ["a3b2c1", "ABC123", "12345", "toolong"]
    for test_id in test_ids:
        valid = generator.is_valid_format(test_id)
        status = "✓" if valid else "✗"
        print(f"   {status} '{test_id}': {'valid' if valid else 'invalid'}")
    print()

    # Collision probability
    print("4. Collision probability estimation...")
    test_sizes = [100, 1000, 10000, 50000]
    for size in test_sizes:
        gen_test = AgentIDGenerator(set(f"id{i:06d}" for i in range(size)))
        prob = gen_test.estimate_collision_probability()
        print(f"   Pool size {size:>6}: {prob:.6%} collision probability")
    print()

    # Workspace scanning
    print("5. Workspace scanning example...")
    import tempfile
    with tempfile.TemporaryDirectory() as tmpdir:
        workspace = Path(tmpdir)

        # Create some agent directories
        (workspace / "agent-a1b2c3").mkdir()
        (workspace / "agent-d4e5f6").mkdir()
        (workspace / "other-dir").mkdir()  # Should be ignored

        scanned = AgentIDGenerator.scan_workspace(workspace)
        print(f"   Found {len(scanned)} agent IDs: {sorted(scanned)}")


if __name__ == "__main__":
    main()
