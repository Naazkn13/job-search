"""
Job Search backend — application helpers.

Business logic for tracker, tailoring, and submit-prompt flow.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from fastapi import HTTPException

from models import Application, ProjectShowcase
from resume_builder import build_ready_pack, load_resume_source


def pick_resume_version(jd_text: str, preferred_version: str) -> str:
    jd_lower = jd_text.lower()
    if preferred_version in ("A", "B", "C"):
        if preferred_version == "B" and "ai" in jd_lower:
            return "B"
        if preferred_version == "A" and any(k in jd_lower for k in ["python", "backend", "fastapi", "postgresql"]):
            return "A"
        if preferred_version == "C" and any(k in jd_lower for k in ["java", "full stack"]):
            return "C"
        return preferred_version
    return "A"


def application_ready_pack(application: Application) -> Dict[str, Any]:
    pack = build_ready_pack(
        version=application.resume_version,
        jd_text=application.jd_text,
        jd_notes=application.jd_notes,
        changes_made=application.changes_made,
    )
    pack["application"] = application.serialize()
    return pack
