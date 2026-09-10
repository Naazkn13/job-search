"""
Job Search backend — interview prep content.

Stores question banks and project story templates.
"""

from __future__ import annotations

import json
import pathlib
from typing import Any, Dict, List

PREP_SOURCE_PATH = pathlib.Path(__file__).resolve().parent / "questions.json"


def load_prep_source() -> Dict[str, Any]:
    if not PREP_SOURCE_PATH.exists():
        raise FileNotFoundError(f"Prep source not found: {PREP_SOURCE_PATH}")
    return json.loads(PREP_SOURCE_PATH.read_text(encoding="utf-8"))


def questions_for(category: str, role_scope: str | None = None) -> List[Dict[str, Any]]:
    source = load_prep_source()
    data = source.get(category, [])
    if role_scope:
        data = [item for item in data if role_scope in item.get("scopes", [])]
    return data


def project_story(project_slug: str) -> Dict[str, Any]:
    source = load_prep_source()
    stories = source.get("project_story", {})
    if project_slug not in stories:
        raise ValueError(f"Unknown project story: {project_slug}")
    return stories[project_slug]
