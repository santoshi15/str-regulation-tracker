#!/usr/bin/env python3
"""Copy the source markdown into the self contained static site."""
from pathlib import Path
import shutil


def main():
    root = Path(__file__).resolve().parent
    source = root.parent / 'data' / 'cities'
    files = sorted(source.glob('*.md'))
    if not (source / 'INDEX.md').is_file() or len(files) != 11:
        raise SystemExit('Expected INDEX.md and 10 city markdown files in ../data/cities/')
    destination = root / 'data' / 'cities'
    destination.mkdir(parents=True, exist_ok=True)
    for path in files:
        shutil.copy2(path, destination / path.name)
    print(f'Copied {len(files)} markdown files to {destination}')


if __name__ == '__main__':
    main()
