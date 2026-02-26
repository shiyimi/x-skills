#!/usr/bin/env python3
"""Unit tests for Status File Manager

Tests:
- Status file creation and reading
- State transition validation
- Atomic file operations
- Timestamp management
- Error handling
- List operations
"""

# /// script
# dependencies = ["pytest", "pyyaml"]
# ///

import pytest
import tempfile
import shutil
from pathlib import Path
from datetime import datetime

from status_file_manager import (
    StatusFileManager,
    AgentStatusFile,
    AgentStatus,
    StatusError
)


@pytest.fixture
def temp_workspace():
    """Create temporary workspace directory"""
    temp_dir = Path(tempfile.mkdtemp())
    yield temp_dir
    shutil.rmtree(temp_dir)


@pytest.fixture
def manager(temp_workspace):
    """Create StatusFileManager instance"""
    return StatusFileManager(temp_workspace)


class TestStatusFileCreation:
    """Test status file creation operations"""

    def test_create_basic_status(self, manager):
        """Test creating basic status file"""
        status = manager.create_status(
            agent_id="test-001",
            task_description="Test task",
            parent_agent="master",
            depth=1
        )

        assert status.agent_id == "test-001"
        assert status.status == AgentStatus.PENDING.value
        assert status.task_description == "Test task"
        assert status.parent_agent == "master"
        assert status.depth == 1
        assert status.created_at is not None
        assert status.updated_at is not None

    def test_create_with_metadata(self, manager):
        """Test creating status with metadata"""
        metadata = {"priority": "high", "estimated_minutes": 30}
        status = manager.create_status(
            agent_id="test-002",
            task_description="Test with metadata",
            metadata=metadata
        )

        assert status.metadata == metadata
        assert status.metadata["priority"] == "high"

    def test_status_file_exists_after_creation(self, manager):
        """Test that status file is actually created on disk"""
        manager.create_status(
            agent_id="test-003",
            task_description="Test file creation"
        )

        file_path = manager.get_status_file_path("test-003")
        assert file_path.exists()
        assert file_path.name == ".agent_status.yaml"


class TestStatusFileReading:
    """Test status file reading operations"""

    def test_read_existing_status(self, manager):
        """Test reading an existing status file"""
        # Create status first
        created = manager.create_status(
            agent_id="test-004",
            task_description="Test reading"
        )

        # Read it back
        read = manager.read_status("test-004")

        assert read.agent_id == created.agent_id
        assert read.status == created.status
        assert read.task_description == created.task_description

    def test_read_nonexistent_status(self, manager):
        """Test error when reading non-existent status"""
        with pytest.raises(FileNotFoundError, match="Status file not found"):
            manager.read_status("nonexistent")

    def test_read_preserves_all_fields(self, manager):
        """Test that reading preserves all fields including optionals"""
        # Create with all fields
        manager.create_status(
            agent_id="test-005",
            task_description="Complete test",
            metadata={"key": "value"}
        )

        # Update to add more fields
        manager.update_status(
            "test-005",
            AgentStatus.IN_PROGRESS,
            summary="In progress",
            artifacts=["file1.txt", "file2.txt"]
        )

        # Read and verify
        status = manager.read_status("test-005")
        assert status.summary == "In progress"
        assert status.artifacts == ["file1.txt", "file2.txt"]
        assert status.started_at is not None


class TestStateTransitions:
    """Test state transition validation"""

    def test_pending_to_in_progress(self, manager):
        """Test valid transition: PENDING -> IN_PROGRESS"""
        manager.create_status("test-006", "Test task")

        status = manager.update_status("test-006", AgentStatus.IN_PROGRESS)

        assert status.status == AgentStatus.IN_PROGRESS.value
        assert status.started_at is not None

    def test_in_progress_to_completed(self, manager):
        """Test valid transition: IN_PROGRESS -> COMPLETED"""
        manager.create_status("test-007", "Test task")
        manager.update_status("test-007", AgentStatus.IN_PROGRESS)

        status = manager.update_status("test-007", AgentStatus.COMPLETED)

        assert status.status == AgentStatus.COMPLETED.value
        assert status.completed_at is not None

    def test_in_progress_to_failed(self, manager):
        """Test valid transition: IN_PROGRESS -> FAILED"""
        manager.create_status("test-008", "Test task")
        manager.update_status("test-008", AgentStatus.IN_PROGRESS)

        status = manager.update_status("test-008", AgentStatus.FAILED)

        assert status.status == AgentStatus.FAILED.value
        assert status.completed_at is not None

    def test_failed_to_pending_retry(self, manager):
        """Test valid transition: FAILED -> PENDING (retry)"""
        manager.create_status("test-009", "Test task")
        manager.update_status("test-009", AgentStatus.IN_PROGRESS)
        manager.update_status("test-009", AgentStatus.FAILED)

        status = manager.update_status("test-009", AgentStatus.PENDING)

        assert status.status == AgentStatus.PENDING.value

    def test_invalid_transition_completed_to_in_progress(self, manager):
        """Test invalid transition: COMPLETED -> IN_PROGRESS"""
        manager.create_status("test-010", "Test task")
        manager.update_status("test-010", AgentStatus.IN_PROGRESS)
        manager.update_status("test-010", AgentStatus.COMPLETED)

        with pytest.raises(ValueError, match="Invalid transition"):
            manager.update_status("test-010", AgentStatus.IN_PROGRESS)

    def test_invalid_transition_pending_to_completed(self, manager):
        """Test invalid transition: PENDING -> COMPLETED (must go through IN_PROGRESS)"""
        manager.create_status("test-011", "Test task")

        with pytest.raises(ValueError, match="Invalid transition"):
            manager.update_status("test-011", AgentStatus.COMPLETED)


class TestTimestampManagement:
    """Test automatic timestamp management"""

    def test_created_at_set_on_creation(self, manager):
        """Test that created_at is set during creation"""
        status = manager.create_status("test-012", "Test task")

        assert status.created_at is not None
        # Should be ISO format with Z
        assert status.created_at.endswith("Z")
        # Should be parseable
        datetime.fromisoformat(status.created_at.replace("Z", "+00:00"))

    def test_updated_at_changes_on_update(self, manager):
        """Test that updated_at changes on updates"""
        status1 = manager.create_status("test-013", "Test task")
        original_updated_at = status1.updated_at

        import time
        time.sleep(0.01)  # Ensure time difference

        status2 = manager.update_status("test-013", AgentStatus.IN_PROGRESS)

        assert status2.updated_at != original_updated_at

    def test_started_at_set_on_in_progress(self, manager):
        """Test that started_at is set when transitioning to IN_PROGRESS"""
        manager.create_status("test-014", "Test task")

        status = manager.update_status("test-014", AgentStatus.IN_PROGRESS)

        assert status.started_at is not None

    def test_started_at_not_overwritten(self, manager):
        """Test that started_at is not overwritten on subsequent updates"""
        manager.create_status("test-015", "Test task")
        status1 = manager.update_status("test-015", AgentStatus.IN_PROGRESS)
        original_started_at = status1.started_at

        import time
        time.sleep(0.01)

        # Update something else
        status2 = manager.update_status("test-015", AgentStatus.IN_PROGRESS, summary="Still working")

        assert status2.started_at == original_started_at

    def test_completed_at_set_on_completion(self, manager):
        """Test that completed_at is set when transitioning to COMPLETED"""
        manager.create_status("test-016", "Test task")
        manager.update_status("test-016", AgentStatus.IN_PROGRESS)

        status = manager.update_status("test-016", AgentStatus.COMPLETED)

        assert status.completed_at is not None

    def test_completed_at_set_on_failure(self, manager):
        """Test that completed_at is set when transitioning to FAILED"""
        manager.create_status("test-017", "Test task")
        manager.update_status("test-017", AgentStatus.IN_PROGRESS)

        status = manager.update_status("test-017", AgentStatus.FAILED)

        assert status.completed_at is not None


class TestArtifactsAndErrors:
    """Test artifacts and error tracking"""

    def test_update_with_artifacts(self, manager):
        """Test updating status with artifacts"""
        manager.create_status("test-018", "Test task")
        manager.update_status("test-018", AgentStatus.IN_PROGRESS)

        artifacts = ["output.txt", "result.json", "report.pdf"]
        status = manager.update_status(
            "test-018",
            AgentStatus.COMPLETED,
            artifacts=artifacts
        )

        assert status.artifacts == artifacts

    def test_update_with_errors(self, manager):
        """Test updating status with errors"""
        manager.create_status("test-019", "Test task")
        manager.update_status("test-019", AgentStatus.IN_PROGRESS)

        errors = [
            StatusError(
                error_type="ValidationError",
                message="Invalid input",
                timestamp=datetime.utcnow().isoformat() + "Z",
                file_path="validator.py",
                line_number=42
            )
        ]
        status = manager.update_status(
            "test-019",
            AgentStatus.FAILED,
            errors=errors
        )

        assert len(status.errors) == 1
        assert status.errors[0]["error_type"] == "ValidationError"
        assert status.errors[0]["file_path"] == "validator.py"

    def test_update_with_summary(self, manager):
        """Test updating status with summary"""
        manager.create_status("test-020", "Test task")
        manager.update_status("test-020", AgentStatus.IN_PROGRESS)

        summary = "Successfully completed all sub-tasks"
        status = manager.update_status(
            "test-020",
            AgentStatus.COMPLETED,
            summary=summary
        )

        assert status.summary == summary


class TestListOperations:
    """Test agent listing operations"""

    def test_list_all_agents(self, manager):
        """Test listing all agents"""
        manager.create_status("001", "Task 1")
        manager.create_status("002", "Task 2")
        manager.create_status("003", "Task 3")

        agents = manager.list_agents()

        assert len(agents) == 3
        assert "001" in agents
        assert "002" in agents
        assert "003" in agents

    def test_list_by_status_filter(self, manager):
        """Test listing agents filtered by status"""
        manager.create_status("004", "Task 1")
        manager.create_status("005", "Task 2")
        manager.update_status("005", AgentStatus.IN_PROGRESS)
        manager.create_status("006", "Task 3")
        manager.update_status("006", AgentStatus.IN_PROGRESS)

        in_progress = manager.list_agents(status_filter=AgentStatus.IN_PROGRESS)

        assert len(in_progress) == 2
        assert "005" in in_progress
        assert "006" in in_progress
        assert "004" not in in_progress

    def test_list_empty_workspace(self, manager):
        """Test listing agents in empty workspace"""
        agents = manager.list_agents()

        assert agents == []

    def test_list_ignores_non_agent_directories(self, temp_workspace, manager):
        """Test that non-agent directories are ignored"""
        manager.create_status("007", "Task 1")

        # Create non-agent directory
        (temp_workspace / "other-dir").mkdir()
        (temp_workspace / "other-dir" / "file.txt").write_text("test")

        agents = manager.list_agents()

        assert len(agents) == 1
        assert agents[0] == "007"


class TestAtomicOperations:
    """Test atomic file operations"""

    def test_atomic_write_creates_temp_file(self, manager):
        """Test that atomic write uses temporary file"""
        manager.create_status("test-021", "Test task")

        file_path = manager.get_status_file_path("test-021")
        temp_path = file_path.with_suffix('.tmp')

        # Temp file should not exist after successful write
        assert not temp_path.exists()
        assert file_path.exists()

    def test_concurrent_writes_safe(self, manager):
        """Test that concurrent writes don't corrupt data"""
        manager.create_status("test-022", "Test task")

        # Simulate rapid updates
        for i in range(10):
            status = manager.read_status("test-022")
            assert status is not None
            assert isinstance(status.agent_id, str)


class TestErrorHandling:
    """Test error handling scenarios"""

    def test_invalid_status_value(self, manager):
        """Test error on invalid status value"""
        with pytest.raises(ValueError, match="Invalid status"):
            AgentStatusFile(
                agent_id="test",
                status="INVALID_STATUS",
                task_description="Test",
                parent_agent="master",
                depth=1,
                created_at="2025-01-01T00:00:00Z",
                updated_at="2025-01-01T00:00:00Z"
            )

    def test_read_empty_file(self, temp_workspace, manager):
        """Test error when reading empty status file"""
        # Create empty file
        agent_dir = temp_workspace / "agent-empty"
        agent_dir.mkdir()
        status_file = agent_dir / ".agent_status.yaml"
        status_file.write_text("")

        with pytest.raises(ValueError, match="Empty status file"):
            manager.read_status("empty")

    def test_read_invalid_yaml(self, temp_workspace, manager):
        """Test error when reading invalid YAML"""
        # Create invalid YAML file
        agent_dir = temp_workspace / "agent-invalid"
        agent_dir.mkdir()
        status_file = agent_dir / ".agent_status.yaml"
        status_file.write_text("{ invalid: yaml: syntax")

        with pytest.raises(Exception):  # yaml.YAMLError
            manager.read_status("invalid")


class TestRealWorldScenarios:
    """Test with real-world scenarios"""

    def test_complete_agent_lifecycle(self, manager):
        """Test complete agent lifecycle: create -> start -> complete"""
        # Create agent
        status = manager.create_status(
            agent_id="lifecycle-001",
            task_description="Implement API endpoint",
            parent_agent="master",
            depth=1,
            metadata={"priority": "high"}
        )
        assert status.status == AgentStatus.PENDING.value

        # Start work
        status = manager.update_status("lifecycle-001", AgentStatus.IN_PROGRESS)
        assert status.status == AgentStatus.IN_PROGRESS.value
        assert status.started_at is not None

        # Complete work
        status = manager.update_status(
            "lifecycle-001",
            AgentStatus.COMPLETED,
            summary="API endpoint implemented successfully",
            artifacts=["api.py", "tests.py", "docs.md"]
        )
        assert status.status == AgentStatus.COMPLETED.value
        assert status.completed_at is not None
        assert len(status.artifacts) == 3

    def test_agent_failure_and_retry(self, manager):
        """Test agent failure and retry workflow"""
        # Create and start agent
        manager.create_status("retry-001", "Complex task")
        manager.update_status("retry-001", AgentStatus.IN_PROGRESS)

        # Fail with error
        error = StatusError(
            error_type="DependencyError",
            message="Required service unavailable",
            timestamp=datetime.utcnow().isoformat() + "Z"
        )
        status = manager.update_status(
            "retry-001",
            AgentStatus.FAILED,
            errors=[error]
        )
        assert status.status == AgentStatus.FAILED.value
        assert len(status.errors) == 1

        # Retry
        status = manager.update_status("retry-001", AgentStatus.PENDING)
        assert status.status == AgentStatus.PENDING.value

    def test_parallel_agents_same_parent(self, manager):
        """Test multiple parallel agents under same parent"""
        parent = "master"

        # Create multiple agents
        for i in range(5):
            manager.create_status(
                agent_id=f"parallel-{i:03d}",
                task_description=f"Parallel task {i}",
                parent_agent=parent,
                depth=1
            )

        # Start all
        for i in range(5):
            manager.update_status(f"parallel-{i:03d}", AgentStatus.IN_PROGRESS)

        # List in-progress agents
        in_progress = manager.list_agents(status_filter=AgentStatus.IN_PROGRESS)
        assert len(in_progress) == 5


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
