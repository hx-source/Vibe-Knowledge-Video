"""Locate the existing engine without installing, copying, or modifying it."""
import argparse
import json
import os
from pathlib import Path
import sys

KNOWN_ROOT = Path("D:/Documents/dy/knowledge-video-template")
SUPPORTED = {"0.3.0"}
REQUIRED = (
    "scripts/cli.mjs", "engine/film.js", "engine/audio-plan.js",
    "templates/starter/project.json", "docs/AUDIO-WORKFLOW-v0.3.md",
)


def inspect(root):
    root = root.expanduser().resolve()
    package = root / "package.json"
    if not package.is_file():
        raise ValueError(f"Not an engine root (package.json missing): {root}")
    meta = json.loads(package.read_text(encoding="utf-8-sig"))
    if meta.get("name") != "knowledge-video-template":
        raise ValueError(f"Different package at {root}")
    if meta.get("version") not in SUPPORTED:
        raise ValueError(f"Engine {meta.get('version')} is not validated by this skill; inspect its changes before adapting the skill: {root}")
    missing = [name for name in REQUIRED if not (root / name).is_file()]
    if missing:
        raise ValueError(f"Incomplete engine at {root}: {', '.join(missing)}")
    starter = json.loads((root / "templates/starter/project.json").read_text(encoding="utf-8-sig"))
    if starter.get("schemaVersion") != 2 or starter.get("templateVersion") != meta["version"]:
        raise ValueError(f"Starter version disagrees with engine: {root}")
    return {
        "engineRoot": str(root), "engineVersion": meta["version"],
        "starterProjectSchema": starter["schemaVersion"],
        "dependenciesPresent": (root / "node_modules").is_dir(),
        "readme": str(root / "README.md"),
        "audioGuide": str(root / "docs/AUDIO-WORKFLOW-v0.3.md"),
        "note": "Read-only discovery. Use this root as the CLI working directory; doctor verifies runtime separately.",
    }


def discover(explicit=None, cwd=None, environ=None):
    env = os.environ if environ is None else environ
    selected = explicit or env.get("KNOWLEDGE_VIDEO_ENGINE")
    if selected:
        return inspect(Path(selected))
    here = Path(cwd or Path.cwd()).resolve()
    candidates = {}
    for base in (here, *here.parents):
        for p in (base, base / "knowledge-video-template"):
            package = p / "package.json"
            if not package.is_file():
                continue
            try:
                meta = json.loads(package.read_text(encoding="utf-8-sig"))
            except (OSError, ValueError):
                continue
            if meta.get("name") == "knowledge-video-template":
                candidates[os.path.normcase(str(p.resolve()))] = p.resolve()
    if len(candidates) > 1:
        raise ValueError("Multiple nearby engines; specify --root: " + "; ".join(map(str, candidates.values())))
    if candidates:
        return inspect(next(iter(candidates.values())))
    if KNOWN_ROOT.is_dir():
        return inspect(KNOWN_ROOT)
    raise ValueError("Engine not found. Supply --root or KNOWLEDGE_VIDEO_ENGINE; this skill does not bundle the renderer.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", help="Explicit engine root; invalid paths fail instead of falling back")
    args = parser.parse_args()
    try:
        print(json.dumps(discover(args.root), ensure_ascii=False, indent=2))
    except (OSError, ValueError) as error:
        print(json.dumps({"error": str(error)}, ensure_ascii=False), file=sys.stderr)
        return 2
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
