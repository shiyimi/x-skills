#!/usr/bin/env python3
"""Performance Benchmark Collection Script

Collects performance metrics from all test scenarios and generates
a comprehensive performance report.
"""

# /// script
# dependencies = ["pyyaml"]
# ///

import tempfile
from pathlib import Path
import json
import sys

# Add src directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from orchestrator import MultiAgentOrchestrator, TaskDefinition


def benchmark_scenario(name, tasks):
    """Benchmark a single scenario

    Args:
        name: Scenario name
        tasks: List of TaskDefinition

    Returns:
        Dictionary with benchmark results
    """
    workspace = Path(tempfile.mkdtemp(prefix=f"benchmark_{name}_"))

    try:
        orchestrator = MultiAgentOrchestrator(workspace)

        # Planning
        result = orchestrator.plan(tasks)

        if not result.success:
            return {
                "name": name,
                "success": False,
                "error": result.validation_errors
            }

        # Execution
        exec_metrics = orchestrator.simulate_execution()

        # Status
        status_summary = orchestrator.get_status_summary()

        return {
            "name": name,
            "success": True,
            "agents": len(result.agents),
            "dependencies": result.metrics["total_dependencies"],
            "max_depth": result.metrics["max_depth"],
            "planning_time_ms": round(result.metrics["planning_time_seconds"] * 1000, 2),
            "sequential_time_minutes": result.metrics["sequential_time_minutes"],
            "parallel_time_minutes": result.metrics["parallel_time_minutes"],
            "time_saved_percentage": result.metrics["time_saved_percentage"],
            "max_parallelism": result.metrics["max_parallelism"],
            "execution_time_ms": round(exec_metrics["execution_time_seconds"] * 1000, 2),
            "waves": exec_metrics["total_waves"],
            "status": status_summary["status_counts"]
        }

    finally:
        orchestrator.cleanup()


def main():
    """Run all benchmarks and generate report"""
    print("=" * 70)
    print("Performance Benchmark Collection".center(70))
    print("=" * 70)
    print()

    benchmarks = []

    # Scenario 1: REST API (Simple)
    print("📊 Benchmarking: REST API (Simple)...")
    benchmarks.append(benchmark_scenario(
        "REST_API",
        [
            TaskDefinition("Design API schema", [], 45),
            TaskDefinition("Implement authentication", ["Design API schema"], 60),
            TaskDefinition("Implement blog CRUD", ["Design API schema", "Implement authentication"], 90),
            TaskDefinition("Implement comments", ["Design API schema", "Implement authentication"], 60),
            TaskDefinition("Write tests", ["Implement blog CRUD", "Implement comments"], 45),
        ]
    ))

    # Scenario 2: Full-stack Application (Medium)
    print("📊 Benchmarking: Full-stack Application (Medium)...")
    benchmarks.append(benchmark_scenario(
        "Fullstack_App",
        [
            TaskDefinition("Design database schema", [], 60),
            TaskDefinition("Setup backend framework", [], 30),
            TaskDefinition("Setup frontend framework", [], 30),
            TaskDefinition("Implement database models", ["Design database schema", "Setup backend framework"], 60),
            TaskDefinition("Implement API endpoints", ["Implement database models"], 90),
            TaskDefinition("Implement authentication", ["Implement database models"], 75),
            TaskDefinition("Build UI components", ["Setup frontend framework", "Implement API endpoints"], 120),
            TaskDefinition("Integrate frontend with backend", ["Build UI components", "Implement authentication"], 60),
        ]
    ))

    # Scenario 3: Microservices (Complex)
    print("📊 Benchmarking: Microservices Architecture (Complex)...")
    benchmarks.append(benchmark_scenario(
        "Microservices",
        [
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
    ))

    # Scenario 4: Data Processing Pipeline (Complex)
    print("📊 Benchmarking: Data Processing Pipeline (Complex)...")
    benchmarks.append(benchmark_scenario(
        "Data_Pipeline",
        [
            TaskDefinition("Setup data lake", [], 60),
            TaskDefinition("Implement data ingestion", ["Setup data lake"], 75),
            TaskDefinition("Implement data validation", ["Implement data ingestion"], 60),
            TaskDefinition("Implement data transformation", ["Implement data validation"], 90),
            TaskDefinition("Implement data enrichment", ["Implement data transformation"], 75),
            TaskDefinition("Implement data aggregation", ["Implement data enrichment"], 60),
            TaskDefinition("Implement data export", ["Implement data aggregation"], 45),
            TaskDefinition("Setup monitoring", ["Setup data lake"], 45),
            TaskDefinition("Implement alerts", ["Setup monitoring", "Implement data export"], 30),
        ]
    ))

    # Scenario 5: DevOps Automation (Medium)
    print("📊 Benchmarking: DevOps Automation (Medium)...")
    benchmarks.append(benchmark_scenario(
        "DevOps_Automation",
        [
            TaskDefinition("Setup CI/CD pipeline", [], 60),
            TaskDefinition("Implement automated testing", ["Setup CI/CD pipeline"], 75),
            TaskDefinition("Implement deployment automation", ["Setup CI/CD pipeline"], 90),
            TaskDefinition("Setup monitoring and logging", ["Implement deployment automation"], 60),
            TaskDefinition("Implement auto-scaling", ["Setup monitoring and logging"], 75),
            TaskDefinition("Setup disaster recovery", ["Implement deployment automation"], 90),
            TaskDefinition("Write runbooks", ["Setup monitoring and logging", "Setup disaster recovery"], 45),
        ]
    ))

    print()
    print("=" * 70)
    print("Benchmark Results".center(70))
    print("=" * 70)
    print()

    # Print results table
    print(f"{'Scenario':<25} {'Agents':<8} {'Depth':<7} {'Time Saved':<12} {'Parallelism':<12}")
    print("-" * 70)

    for benchmark in benchmarks:
        if benchmark["success"]:
            print(
                f"{benchmark['name']:<25} "
                f"{benchmark['agents']:<8} "
                f"{benchmark['max_depth']:<7} "
                f"{benchmark['time_saved_percentage']:<11.1f}% "
                f"{benchmark['max_parallelism']:<12}"
            )

    print()
    print("=" * 70)
    print("Detailed Metrics".center(70))
    print("=" * 70)
    print()

    for benchmark in benchmarks:
        if benchmark["success"]:
            print(f"\n📌 {benchmark['name']}")
            print(f"   Agents: {benchmark['agents']}")
            print(f"   Dependencies: {benchmark['dependencies']}")
            print(f"   Max Depth: {benchmark['max_depth']}")
            print(f"   Planning Time: {benchmark['planning_time_ms']} ms")
            print(f"   Sequential Time: {benchmark['sequential_time_minutes']} min")
            print(f"   Parallel Time: {benchmark['parallel_time_minutes']} min")
            print(f"   Time Saved: {benchmark['time_saved_percentage']}%")
            print(f"   Max Parallelism: {benchmark['max_parallelism']} agents")
            print(f"   Execution Waves: {benchmark['waves']}")
            print(f"   Execution Time: {benchmark['execution_time_ms']} ms")
            print(f"   Status: {benchmark['status']}")

    # Save to JSON
    output_file = Path(".memory/performance_benchmarks.json")
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, 'w') as f:
        json.dump(benchmarks, f, indent=2)

    print()
    print(f"✅ Results saved to: {output_file}")
    print()

    return benchmarks


if __name__ == "__main__":
    main()
