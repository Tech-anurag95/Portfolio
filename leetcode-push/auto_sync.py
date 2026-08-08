#!/usr/bin/env python3
"""
LeetCode Auto Sync — GitHub Actions
Fetches recently accepted submissions and saves solutions to the repo.
"""

import os
import json
import time
import requests
from datetime import datetime

USERNAME       = "CodewithDubey"
SOLUTIONS_DIR  = "leetcode-solutions"
STATE_FILE     = os.path.join(SOLUTIONS_DIR, ".sync_state.json")

# Auth cookies from GitHub Secrets (needed to fetch actual code)
LEETCODE_SESSION = os.environ.get("LEETCODE_SESSION", "")
LEETCODE_CSRF    = os.environ.get("LEETCODE_CSRF", "")

HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
    "User-Agent": "Mozilla/5.0",
    "x-csrftoken": LEETCODE_CSRF,
    "Cookie": f"LEETCODE_SESSION={LEETCODE_SESSION}; csrftoken={LEETCODE_CSRF}",
}

EXT_MAP = {
    "python3": "py", "python": "py",
    "javascript": "js", "typescript": "ts",
    "java": "java", "cpp": "cpp",
    "c": "c", "golang": "go", "rust": "rs",
    "kotlin": "kt", "swift": "swift", "bash": "sh",
}

COMMENT_MAP = {
    "py": "#", "js": "//", "ts": "//", "java": "//",
    "cpp": "//", "c": "//", "go": "//", "rs": "//",
    "kt": "//", "swift": "//", "sh": "#",
}


def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE) as f:
            return json.load(f)
    return {"synced_ids": []}


def save_state(state):
    os.makedirs(SOLUTIONS_DIR, exist_ok=True)
    with open(STATE_FILE, "w") as f:
        json.dump(state, f, indent=2)


def fetch_recent_submissions(limit=20, offset=0):
    """Fetch recent accepted submissions via GraphQL."""
    query = """
    query recentAcSubmissions($username: String!, $limit: Int!) {
      recentAcSubmissionList(username: $username, limit: $limit) {
        id
        title
        titleSlug
        timestamp
        statusDisplay
        lang
      }
    }
    """
    r = requests.post(
        "https://leetcode.com/graphql",
        headers=HEADERS,
        json={"query": query, "variables": {"username": USERNAME, "limit": limit}},
        timeout=15,
    )
    r.raise_for_status()
    data = r.json()
    return data.get("data", {}).get("recentAcSubmissionList", [])


def fetch_submission_detail(submission_id):
    """Fetch the actual code for a submission."""
    query = """
    query submissionDetails($submissionId: Int!) {
      submissionDetails(submissionId: $submissionId) {
        code
        lang { name verboseName }
        question {
          questionId
          title
          titleSlug
          difficulty
          topicTags { name }
        }
      }
    }
    """
    r = requests.post(
        "https://leetcode.com/graphql",
        headers=HEADERS,
        json={"query": query, "variables": {"submissionId": int(submission_id)}},
        timeout=15,
    )
    r.raise_for_status()
    return r.json().get("data", {}).get("submissionDetails")


def fetch_problem_info(slug):
    """Fetch problem number and tags."""
    query = """
    query questionData($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        difficulty
        topicTags { name }
      }
    }
    """
    r = requests.post(
        "https://leetcode.com/graphql",
        headers=HEADERS,
        json={"query": query, "variables": {"titleSlug": slug}},
        timeout=15,
    )
    r.raise_for_status()
    return r.json().get("data", {}).get("question")


def save_solution(detail, timestamp):
    """Write solution file."""
    q       = detail.get("question", {})
    qid     = str(q.get("questionId", "0")).zfill(4)
    title   = q.get("title", "Unknown")
    diff    = q.get("difficulty", "Unknown")
    tags    = ", ".join(t["name"] for t in q.get("topicTags", []))
    lang    = detail.get("lang", {}).get("name", "python3")
    code    = detail.get("code", "")
    ext     = EXT_MAP.get(lang, "txt")
    cm      = COMMENT_MAP.get(ext, "#")
    date    = datetime.fromtimestamp(int(timestamp)).strftime("%Y-%m-%d")
    slug    = title.replace(" ", "_").replace("-", "_")
    fname   = f"{qid}_{slug}.{ext}"
    folder  = os.path.join(SOLUTIONS_DIR, diff)
    os.makedirs(folder, exist_ok=True)
    fpath   = os.path.join(folder, fname)

    # Skip if already exists
    if os.path.exists(fpath):
        return fpath, fname, qid, title, diff, lang, date, tags, False

    header = f"""{cm} ============================================================
{cm}  Problem #{int(qid)}: {title}
{cm}  Difficulty : {diff}
{cm}  Language   : {lang}
{cm}  Date       : {date}
{cm}  Tags       : {tags or 'N/A'}
{cm}  LeetCode   : https://leetcode.com/problems/{title.lower().replace(' ', '-')}/
{cm} ============================================================

"""
    with open(fpath, "w", encoding="utf-8") as f:
        f.write(header + code + "\n")

    print(f"  ✅ Saved: {fpath}")
    return fpath, fname, qid, title, diff, lang, date, tags, True


def update_readme(entries):
    """Rebuild the README table."""
    readme = os.path.join(SOLUTIONS_DIR, "README.md")
    # Load existing rows
    existing = {}
    if os.path.exists(readme):
        with open(readme) as f:
            for line in f:
                if line.startswith("|") and not line.startswith("| #") and not line.startswith("|---"):
                    parts = [p.strip() for p in line.strip().strip("|").split("|")]
                    if len(parts) >= 1 and parts[0].isdigit():
                        existing[int(parts[0])] = line

    for e in entries:
        qnum, title, diff, lang, fname, date = e
        ext  = EXT_MAP.get(lang, "txt")
        rel  = f"{diff}/{fname}"
        slug = title.lower().replace(" ", "-")
        row  = f"| {int(qnum)} | [{title}](https://leetcode.com/problems/{slug}/) | {diff} | {lang} | [{fname}]({rel}) | {date} |\n"
        existing[int(qnum)] = row

    header = (
        "# 🧩 LeetCode Solutions\n\n"
        f"Auto-synced solutions by **Anurag Dubey** ([@CodewithDubey](https://leetcode.com/u/CodewithDubey))\n\n"
        f"**Total saved:** {len(existing)}\n\n"
        "| # | Problem | Difficulty | Language | Solution | Date |\n"
        "|---|---------|------------|----------|----------|------|\n"
    )
    rows = "".join(v for _, v in sorted(existing.items()))
    with open(readme, "w", encoding="utf-8") as f:
        f.write(header + rows)


def main():
    print(f"\n🔄 Syncing LeetCode solutions for @{USERNAME}...")

    state   = load_state()
    synced  = set(state.get("synced_ids", []))
    new_entries = []

    submissions = fetch_recent_submissions(limit=50)
    print(f"   Found {len(submissions)} recent accepted submissions")

    for sub in submissions:
        sid = str(sub["id"])
        if sid in synced:
            continue

        print(f"\n   Processing: {sub['title']} (#{sid})")
        time.sleep(0.8)  # be polite to LeetCode API

        try:
            detail = fetch_submission_detail(sid)
            if not detail:
                print(f"   ⚠️  Could not fetch detail for #{sid}")
                continue

            result = save_solution(detail, sub["timestamp"])
            _, fname, qid, title, diff, lang, date, tags, is_new = result

            if is_new:
                new_entries.append((qid, title, diff, lang, fname, date))
                synced.add(sid)

        except Exception as e:
            print(f"   ❌ Error on #{sid}: {e}")
            continue

    if new_entries:
        update_readme(new_entries)
        print(f"\n📊 README updated with {len(new_entries)} new solution(s)")
    else:
        print("\n✨ Everything already up to date!")

    state["synced_ids"] = list(synced)
    save_state(state)
    print("\n✅ Sync complete!\n")


if __name__ == "__main__":
    main()
