#!/usr/bin/env python3
"""
LeetCode Solution Auto-Pusher
==============================
Run this after solving a LeetCode problem.
It creates a file with your solution and pushes it to GitHub.

Usage:
    python push_solution.py

Requirements:
    pip install requests gitpython
"""

import os
import sys
import json
import subprocess
from datetime import datetime

# ─── CONFIG ────────────────────────────────────────────
GITHUB_REPO_PATH = r"C:\Users\dubey\OneDrive\Desktop\intro\portfolio"
SOLUTIONS_FOLDER = "leetcode-solutions"   # folder inside the repo
# ────────────────────────────────────────────────────────


def get_problem_info():
    """Prompt user for problem details."""
    print("\n" + "="*50)
    print("   LeetCode Solution Pusher")
    print("="*50)

    number   = input("\n📌 Problem Number (e.g. 1): ").strip()
    title    = input("📝 Problem Title (e.g. Two Sum): ").strip()
    difficulty = input("🎯 Difficulty (Easy/Medium/Hard): ").strip().capitalize()
    language = input("💻 Language (python/javascript/java/cpp): ").strip().lower()

    print(f"\n📄 Paste your solution below.")
    print("   When done, type 'END' on a new line and press Enter:\n")

    lines = []
    while True:
        line = input()
        if line.strip() == "END":
            break
        lines.append(line)
    solution = "\n".join(lines)

    tags = input("\n🏷️  Topics/Tags (e.g. Array, HashMap) [optional]: ").strip()
    notes = input("📒 Notes/Approach [optional]: ").strip()

    return {
        "number":     number.zfill(4),   # pad to 4 digits e.g. 0001
        "title":      title,
        "difficulty": difficulty,
        "language":   language,
        "solution":   solution,
        "tags":       tags,
        "notes":      notes,
        "date":       datetime.now().strftime("%Y-%m-%d"),
    }


def get_file_extension(language):
    ext_map = {
        "python": "py", "py": "py",
        "javascript": "js", "js": "js",
        "java": "java",
        "cpp": "cpp", "c++": "cpp",
        "c": "c",
        "typescript": "ts", "ts": "ts",
        "go": "go",
        "rust": "rs",
    }
    return ext_map.get(language.lower(), "txt")


def get_language_comment(language):
    """Return comment syntax for the language."""
    if language in ("python", "py"):
        return ("#", "#")
    elif language in ("javascript", "js", "typescript", "ts", "java", "cpp", "c", "go", "rust"):
        return ("//", "//")
    return ("#", "#")


def create_solution_file(info):
    """Create the solution file with header."""
    ext  = get_file_extension(info["language"])
    cm   = get_language_comment(info["language"])[0]
    slug = info["title"].replace(" ", "_").replace("-", "_")
    filename = f"{info['number']}_{slug}.{ext}"

    folder = os.path.join(GITHUB_REPO_PATH, SOLUTIONS_FOLDER, info["difficulty"])
    os.makedirs(folder, exist_ok=True)

    filepath = os.path.join(folder, filename)

    header = f"""{cm} ============================================================
{cm}  Problem #{int(info['number'])}: {info['title']}
{cm}  Difficulty : {info['difficulty']}
{cm}  Language   : {info['language'].capitalize()}
{cm}  Date       : {info['date']}
{cm}  Tags       : {info['tags'] or 'N/A'}
{cm}  LeetCode   : https://leetcode.com/problems/{info['title'].lower().replace(' ', '-')}/
{cm} ============================================================
"""

    if info["notes"]:
        header += f"\n{cm} Approach: {info['notes']}\n\n"

    content = header + "\n" + info["solution"] + "\n"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)

    return filepath, filename


def update_readme(info):
    """Update or create README.md in the solutions folder."""
    readme_path = os.path.join(GITHUB_REPO_PATH, SOLUTIONS_FOLDER, "README.md")
    ext = get_file_extension(info["language"])
    slug = info["title"].replace(" ", "_").replace("-", "_")
    filename = f"{info['number']}_{slug}.{ext}"
    rel_path = f"{info['difficulty']}/{filename}"

    new_row = f"| {int(info['number'])} | [{info['title']}](https://leetcode.com/problems/{info['title'].lower().replace(' ', '-')}/) | {info['difficulty']} | {info['language'].capitalize()} | [{filename}]({rel_path}) | {info['date']} |\n"

    if not os.path.exists(readme_path):
        header = """# 🧩 LeetCode Solutions

Auto-pushed solutions by Anurag Dubey.

| # | Problem | Difficulty | Language | Solution | Date |
|---|---------|------------|----------|----------|------|
"""
        with open(readme_path, "w", encoding="utf-8") as f:
            f.write(header + new_row)
    else:
        with open(readme_path, "a", encoding="utf-8") as f:
            f.write(new_row)


def git_push(filepath, info):
    """Stage, commit and push to GitHub."""
    try:
        os.chdir(GITHUB_REPO_PATH)

        readme_path = os.path.join(SOLUTIONS_FOLDER, "README.md")
        rel_filepath = os.path.relpath(filepath, GITHUB_REPO_PATH)

        subprocess.run(["git", "add", rel_filepath, readme_path], check=True)
        commit_msg = f"LeetCode #{int(info['number'])}: {info['title']} [{info['difficulty']}]"
        subprocess.run(["git", "commit", "-m", commit_msg], check=True)
        subprocess.run(["git", "push"], check=True)

        print(f"\n✅ Pushed to GitHub!")
        print(f"   Commit: {commit_msg}")
        print(f"   File  : {rel_filepath}")
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Git error: {e}")
        sys.exit(1)


def main():
    info     = get_problem_info()
    filepath, filename = create_solution_file(info)
    update_readme(info)

    print(f"\n📁 Solution saved: {filepath}")

    push = input("\n🚀 Push to GitHub now? (y/n): ").strip().lower()
    if push == "y":
        git_push(filepath, info)
    else:
        print("\n⚠️  Not pushed. Run 'git push' manually when ready.")

    print("\n🎉 Done!\n")


if __name__ == "__main__":
    main()
