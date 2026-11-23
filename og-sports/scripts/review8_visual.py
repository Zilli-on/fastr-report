"""CI entry point: authored plates, motion and keyboard (scripts/visual_review.py, part "artefacts").

The repository workflow .github/workflows/og-sports-review.yml calls this file by
name and uploads qa/review8-visual.json and qa/r8-*.png. Keep the name; the checks
live in visual_review.py.
"""

import visual_review

if __name__ == "__main__":
    visual_review.NAMES["artefacts"] = ("review8-visual.json", "r8")
    visual_review.main("artefacts")
