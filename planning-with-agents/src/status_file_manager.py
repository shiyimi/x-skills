#!/usr/bin/env python3
"""Status File Manager - Agent Status File Operations

Implements YAML-based status file management for sub-agents.
Handles reading, writing, and validating status transitions.
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field, asdict
from datetime import datetime
from pathlib import Path
from enum import Enum
import yaml


class AgentStatus(Enum):
    """Valid agent status values"""
    PENDING = "pending"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    FAILED = "failed"


@dataclass
class StatusError:
    """Represents an error encountered by an agent"""
    error_type: str
    message: str
    timestamp: str
    stack_trace: Optional[str] = None
    file_path: Optional[str] = None
    line_number: Optional[int] = None


@dataclass
class AgentStatusFile:
    """Represents the complete .agent_status.yaml file structure"""
    agent_id: str
    status: str
    task_description: str
    parent_agent: str
    depth: int
    created_at: str
    updated_at: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    summary: Optional[str] = None
    artifacts: List[str] = field(default_factory=list)
    errors: List[Dict[str, Any]] = field(default_factory=list)
    metrics: Optional[Dict[str, Any]] = None
    metadata: Optional[Dict[str, Any]] = None

    def __post_init__(self):
        """Validate status value"""
        if self.status not in [s.value for s in AgentStatus]:
            valid = ", ".join([s.value for s in AgentStatus])
            raise ValueError(
                f"Invalid status '{self.status}'. Must be one of: {valid}"
            )


class StatusFileManager:
    """Manages agent status file operations

    Features:
    - YAML file reading and writing
    - Status transition validation
    - Timestamp management
    - Atomic file operations
    """

    # Valid state transitions
    VALID_TRANSITIONS = {
        AgentStatus.PENDING: [AgentStatus.IN_PROGRESS, AgentStatus.FAILED],
        AgentStatus.IN_PROGRESS: [AgentStatus.COMPLETED, AgentStatus.FAILED],
        AgentStatus.COMPLETED: [],  # Terminal state
        AgentStatus.FAILED: [AgentStatus.PENDING],  # Can retry
    }

    def __init__(self, workspace_dir: Path):
        """Initialize status file manager

        Args:
            workspace_dir: Base directory for agent workspaces
        """
        self.workspace_dir = Path(workspace_dir)

    def get_status_file_path(self, agent_id: str) -> Path:
        """Get path to agent's status file

        Args:
            agent_id: Unique agent identifier

        Returns:
            Path to .agent_status.yaml file
        """
        return self.workspace_dir / f"agent-{agent_id}" / ".agent_status.yaml"

    def read_status(self, agent_id: str) -> AgentStatusFile:
        """Read agent status from file

        Args:
            agent_id: Unique agent identifier

        Returns:
            AgentStatusFile object

        Raises:
            FileNotFoundError: If status file doesn't exist
            yaml.YAMLError: If YAML parsing fails
            ValueError: If status file has invalid structure
        """
        file_path = self.get_status_file_path(agent_id)

        if not file_path.exists():
            raise FileNotFoundError(f"Status file not found: {file_path}")

        with open(file_path, 'r', encoding='utf-8') as f:
            data = yaml.safe_load(f)

        if not data:
            raise ValueError(f"Empty status file: {file_path}")

        # Validate required fields
        required_fields = [
            "agent_id", "status", "task_description", "parent_agent",
            "depth", "created_at", "updated_at"
        ]
        missing = [field for field in required_fields if field not in data]
        if missing:
            raise ValueError(f"Missing required fields: {', '.join(missing)}")

        return AgentStatusFile(**data)

    def write_status(self, status_data: AgentStatusFile, validate_transition: bool = True) -> None:
        """Write agent status to file

        Args:
            status_data: AgentStatusFile object to write
            validate_transition: Whether to validate status transition

        Raises:
            ValueError: If status transition is invalid
        """
        file_path = self.get_status_file_path(status_data.agent_id)

        # Validate transition if requested and file exists
        if validate_transition and file_path.exists():
            current_status = self.read_status(status_data.agent_id)
            # Allow updates to same status (idempotent updates)
            if current_status.status != status_data.status:
                self.validate_transition(
                    AgentStatus(current_status.status),
                    AgentStatus(status_data.status)
                )

        # Update timestamp
        status_data.updated_at = datetime.utcnow().isoformat() + "Z"

        # Create directory if it doesn't exist
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # Write atomically using temporary file
        temp_path = file_path.with_suffix('.tmp')
        try:
            with open(temp_path, 'w', encoding='utf-8') as f:
                yaml.safe_dump(
                    asdict(status_data),
                    f,
                    default_flow_style=False,
                    sort_keys=False,
                    allow_unicode=True
                )
            temp_path.replace(file_path)
        except Exception as e:
            if temp_path.exists():
                temp_path.unlink()
            raise

    def create_status(
        self,
        agent_id: str,
        task_description: str,
        parent_agent: str = "master",
        depth: int = 1,
        metadata: Optional[Dict[str, Any]] = None
    ) -> AgentStatusFile:
        """Create new status file for an agent

        Args:
            agent_id: Unique agent identifier
            task_description: Description of agent's task
            parent_agent: ID of parent agent
            depth: Nesting depth in agent hierarchy
            metadata: Optional metadata dictionary

        Returns:
            Created AgentStatusFile object
        """
        now = datetime.utcnow().isoformat() + "Z"

        status_data = AgentStatusFile(
            agent_id=agent_id,
            status=AgentStatus.PENDING.value,
            task_description=task_description,
            parent_agent=parent_agent,
            depth=depth,
            created_at=now,
            updated_at=now,
            metadata=metadata
        )

        self.write_status(status_data, validate_transition=False)
        return status_data

    def update_status(
        self,
        agent_id: str,
        new_status: AgentStatus,
        summary: Optional[str] = None,
        artifacts: Optional[List[str]] = None,
        errors: Optional[List[StatusError]] = None
    ) -> AgentStatusFile:
        """Update agent status

        Args:
            agent_id: Unique agent identifier
            new_status: New status value
            summary: Optional completion summary
            artifacts: Optional list of output files
            errors: Optional list of errors

        Returns:
            Updated AgentStatusFile object
        """
        status_data = self.read_status(agent_id)
        status_data.status = new_status.value

        # Update timestamps based on status
        now = datetime.utcnow().isoformat() + "Z"
        if new_status == AgentStatus.IN_PROGRESS and not status_data.started_at:
            status_data.started_at = now
        elif new_status in [AgentStatus.COMPLETED, AgentStatus.FAILED]:
            status_data.completed_at = now

        if summary:
            status_data.summary = summary
        if artifacts:
            status_data.artifacts = artifacts
        if errors:
            status_data.errors = [asdict(e) for e in errors]

        self.write_status(status_data, validate_transition=True)
        return status_data

    def validate_transition(self, from_status: AgentStatus, to_status: AgentStatus) -> None:
        """Validate status transition

        Args:
            from_status: Current status
            to_status: Target status

        Raises:
            ValueError: If transition is invalid
        """
        valid_next = self.VALID_TRANSITIONS.get(from_status, [])
        if to_status not in valid_next:
            raise ValueError(
                f"Invalid transition: {from_status.value} -> {to_status.value}. "
                f"Valid transitions from {from_status.value}: "
                f"{[s.value for s in valid_next]}"
            )

    def list_agents(self, status_filter: Optional[AgentStatus] = None) -> List[str]:
        """List all agent IDs in workspace

        Args:
            status_filter: Optional status to filter by

        Returns:
            List of agent IDs
        """
        agents = []
        if not self.workspace_dir.exists():
            return agents

        for agent_dir in self.workspace_dir.iterdir():
            if not agent_dir.is_dir() or not agent_dir.name.startswith("agent-"):
                continue

            agent_id = agent_dir.name.replace("agent-", "")
            status_file = agent_dir / ".agent_status.yaml"

            if status_file.exists():
                if status_filter:
                    try:
                        status_data = self.read_status(agent_id)
                        if AgentStatus(status_data.status) == status_filter:
                            agents.append(agent_id)
                    except Exception:
                        continue
                else:
                    agents.append(agent_id)

        return agents


def main():
    """Example usage of status file manager"""
    import tempfile
    import shutil

    # Create temporary workspace
    temp_dir = Path(tempfile.mkdtemp())
    try:
        manager = StatusFileManager(temp_dir)

        print("=" * 70)
        print("Status File Manager - Demo".center(70))
        print("=" * 70)
        print()

        # Create new status
        print("1. Creating new agent status...")
        status = manager.create_status(
            agent_id="a3b2c1",
            task_description="Design API schema",
            parent_agent="master",
            depth=1,
            metadata={"priority": "high", "estimated_minutes": 30}
        )
        print(f"   Status: {status.status}")
        print(f"   Created: {status.created_at}")
        print()

        # Update to in-progress
        print("2. Updating to in-progress...")
        status = manager.update_status("a3b2c1", AgentStatus.IN_PROGRESS)
        print(f"   Status: {status.status}")
        print(f"   Started: {status.started_at}")
        print()

        # Complete with artifacts
        print("3. Completing with artifacts...")
        status = manager.update_status(
            "a3b2c1",
            AgentStatus.COMPLETED,
            summary="API schema designed successfully",
            artifacts=["api_schema.yaml", "endpoints.md"]
        )
        print(f"   Status: {status.status}")
        print(f"   Completed: {status.completed_at}")
        print(f"   Artifacts: {', '.join(status.artifacts)}")
        print()

        # Try invalid transition (should raise error)
        print("4. Testing invalid transition (completed -> in-progress)...")
        try:
            manager.update_status("a3b2c1", AgentStatus.IN_PROGRESS)
            print("   ERROR: Should have raised ValueError")
        except ValueError as e:
            print(f"   ✓ Caught expected error: {e}")
        print()

        # List all agents
        print("5. Listing all agents...")
        agents = manager.list_agents()
        print(f"   Found {len(agents)} agent(s): {', '.join(agents)}")

    finally:
        # Cleanup
        shutil.rmtree(temp_dir)
        print()
        print("Cleanup complete")


if __name__ == "__main__":
    main()
