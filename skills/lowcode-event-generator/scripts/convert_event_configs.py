import argparse
import json
from pathlib import Path


def collect_files(paths):
    files = []
    for raw in paths:
        path = Path(raw)
        if path.is_dir():
            files.extend(path.rglob("*.json"))
        elif path.is_file() and path.suffix.lower() == ".json":
            files.append(path)
    return files


def normalize_event_config(data):
    if not isinstance(data, dict):
        return False
    event_list = data.get("eventList")
    if not isinstance(event_list, list):
        return False
    changed = False
    for event in event_list:
        if not isinstance(event, dict):
            continue
        if event.get("eventMode") != "code":
            event["eventMode"] = "code"
            changed = True
        if event.get("actions") != []:
            event["actions"] = []
            changed = True
    return changed


def process_file(file_path):
    # 兼容 UTF-8 与 UTF-8 BOM 的 JSON 文件
    raw = file_path.read_text(encoding="utf-8-sig")
    data = json.loads(raw)
    changed = normalize_event_config(data)
    if changed:
        file_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return changed


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("paths", nargs="*")
    args = parser.parse_args()
    # 脚本位于 scripts/ 目录，默认示例目录位于上一级 skill 根目录
    base_dir = Path(__file__).resolve().parent.parent
    paths = args.paths or [str(base_dir / "examples")]
    files = collect_files(paths)
    changed_files = []
    for file_path in files:
        if process_file(file_path):
            changed_files.append(file_path)
    if changed_files:
        print("\n".join(str(p) for p in changed_files))


if __name__ == "__main__":
    main()
