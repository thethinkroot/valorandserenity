#!/usr/bin/env python3
"""Sitewide em-dash check.

Catches every known way an em dash can hide in this repo's source:
  - the literal character (—)
  - the HTML entity forms: &mdash; &#8212; &#x2014;
  - a JS string escape: \\u2014 (case-insensitive, so \\U2014 too)

A literal-character search alone misses the last two, which is how the
audio player's error message shipped with one hiding in a JS string
across all seven example pages before this script existed. Run this
before considering any em-dash sweep complete; do not rely on eyeballing
a diff.

Usage: python3 scripts/check-em-dash.py [path ...]
Exits non-zero if anything is found. With no path given, scans every
.html and .js file in the repo (excluding .git, node_modules, worker).
"""

import os
import re
import sys

PATTERNS = [
    ("literal character", re.compile("—")),
    ("&mdash; entity", re.compile(r"&mdash;", re.IGNORECASE)),
    ("&#8212; entity", re.compile(r"&#8212;")),
    ("&#x2014; entity", re.compile(r"&#x2014;", re.IGNORECASE)),
    (r"— JS escape", re.compile(r"\\u2014", re.IGNORECASE)),
]

EXCLUDE_DIRS = {".git", "node_modules", "worker"}


def iter_target_files(paths):
    if paths:
        for p in paths:
            if os.path.isfile(p):
                yield p
            else:
                for root, dirs, files in os.walk(p):
                    dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
                    for f in files:
                        if f.endswith((".html", ".js")):
                            yield os.path.join(root, f)
        return
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]
        for f in files:
            if f.endswith((".html", ".js")):
                yield os.path.join(root, f)


def main():
    paths = sys.argv[1:]
    findings = []
    for path in iter_target_files(paths):
        try:
            with open(path, encoding="utf-8", errors="replace") as fh:
                content = fh.read()
        except OSError:
            continue
        for label, pattern in PATTERNS:
            count = len(pattern.findall(content))
            if count:
                findings.append((path, label, count))

    if not findings:
        print("clean: no em dashes found (literal, entity, or \\u2014 escape)")
        return 0

    print("Em dashes found:")
    for path, label, count in findings:
        print(f"  {path}: {count} x {label}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
