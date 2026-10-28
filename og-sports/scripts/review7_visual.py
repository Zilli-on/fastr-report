"""CI entry point: page review (scripts/visual_review.py, part "site").

The repository workflow .github/workflows/og-sports-review.yml calls this file by
name and uploads qa/review7-visual.json and qa/r7-*.png. Keep the name; the checks
live in visual_review.py.
"""

import visual_review

if __name__ == "__main__":
    visual_review.NAMES["site"] = ("review7-visual.json", "r7")
    visual_review.main("site")
