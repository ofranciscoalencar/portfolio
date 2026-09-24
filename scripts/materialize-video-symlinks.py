#!/usr/bin/env python3
"""
Replaces the out-of-project symlinks in public/videos/ with real file
copies so Vercel will actually include them in the deploy bundle.

Vercel's deployment pipeline does NOT follow symlinks that point outside
the project directory — any file symlinked from `~/Desktop/Portfolio/` is
effectively invisible at deploy time. This script walks the
public/videos/{originals,edits-15s}/ directories, detects such symlinks,
reads the target bytes, deletes the symlink, and writes a real file in
its place. In-project symlinks (e.g. edits-15s → originals in the same
project) are left alone since Vercel handles them fine.

Idempotent: re-running on already-materialized files is a no-op.
"""

import os
import shutil
import sys
from pathlib import Path

ROOT = Path.home() / "Projects/portfolio"
VIDEOS_DIR = ROOT / "public/videos"


def materialize(dir_path: Path) -> tuple[int, int, int]:
    """Returns (materialized, left_in_project, already_real)."""
    materialized = 0
    left_in_project = 0
    already_real = 0
    for entry in sorted(dir_path.iterdir()):
        if not entry.is_symlink():
            already_real += 1
            continue
        target = Path(os.readlink(entry))
        if not target.is_absolute():
            target = (entry.parent / target).resolve()
        else:
            target = target.resolve()
        try:
            target.relative_to(ROOT)
            # Symlink points inside the project — fine, Vercel handles it.
            left_in_project += 1
            continue
        except ValueError:
            # Symlink points outside the project (e.g. ~/Desktop/...)
            pass
        if not target.exists():
            print(f"  SKIP (missing target): {entry.name} → {target}")
            continue
        size_mb = target.stat().st_size / (1024 * 1024)
        print(f"  materializing {entry.name} ({size_mb:.1f} MB)")
        entry.unlink()
        shutil.copy2(target, entry)
        materialized += 1
    return materialized, left_in_project, already_real


def main() -> None:
    if not VIDEOS_DIR.exists():
        sys.exit(f"ERROR: {VIDEOS_DIR} not found")
    grand_total = 0
    for subdir_name in ("originals", "edits-15s"):
        subdir = VIDEOS_DIR / subdir_name
        if not subdir.exists():
            print(f"  skipping (missing): {subdir}")
            continue
        print(f"\n── {subdir} ──")
        m, k, r = materialize(subdir)
        total = m + k + r
        print(f"  {m} materialized, {k} in-project symlinks kept, {r} already real  ({total} total)")
        grand_total += total
    print(f"\nProcessed {grand_total} files across both directories.")


if __name__ == "__main__":
    main()
