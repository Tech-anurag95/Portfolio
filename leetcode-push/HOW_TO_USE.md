# How to Push LeetCode Solutions to GitHub

## One-time setup
Open terminal and run:
```
pip install gitpython
```

## Every time you solve a problem

1. Open terminal
2. Run:
```
cd C:\Users\dubey\OneDrive\Desktop\intro\portfolio\leetcode-push
python push_solution.py
```

3. Fill in the prompts:
   - Problem number (e.g. `1`)
   - Problem title (e.g. `Two Sum`)
   - Difficulty (`Easy` / `Medium` / `Hard`)
   - Language (`python` / `javascript` / etc.)
   - Paste your solution, then type `END` on a new line
   - Optional: tags and notes

4. Type `y` to push to GitHub

## What gets created

- `leetcode-solutions/Easy/0001_Two_Sum.py` — your solution file with a header
- `leetcode-solutions/README.md` — auto-updated table of all your solutions

## Example solution file header

```python
# ============================================================
#  Problem #1: Two Sum
#  Difficulty : Easy
#  Language   : Python
#  Date       : 2026-08-05
#  Tags       : Array, HashMap
#  LeetCode   : https://leetcode.com/problems/two-sum/
# ============================================================

# Approach: Use a hashmap to store seen numbers

class Solution:
    def twoSum(self, nums, target):
        seen = {}
        for i, n in enumerate(nums):
            if target - n in seen:
                return [seen[target - n], i]
            seen[n] = i
```
