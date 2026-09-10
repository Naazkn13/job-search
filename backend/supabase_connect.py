"""
Job Search backend — connect Supabase app.

Run: python -m supabase connect [project-url]
Or set SUPABASE_URL and SUPABASE_ANON_KEY in environment.
"""

from __future__ import annotations

import json
import os
import sys
from typing import Any, Dict

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


def connect_from_url(project_url: str) -> Dict[str, Any]:
    # Very basic URL-based config helper.
    # Real usage: user pastes Supabase project URL and we store env vars.
    url = project_url.rstrip("/")
    anon_key = os.getenv("SUPABASE_ANON_KEY", "")
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
    return {
        "project_url": url,
        "anon_key_set": bool(anon_key),
        "service_key_set": bool(service_key),
        "recommended_env": {
            "SUPABASE_URL": url,
            "SUPABASE_ANON_KEY": anon_key or "<set-me>",
            "SUPABASE_SERVICE_ROLE_KEY": service_key or "<set-me>",
        },
    }


def current_config() -> Dict[str, Any]:
    return {
        "SUPABASE_URL": SUPABASE_URL or None,
        "SUPABASE_ANON_KEY_set": bool(SUPABASE_ANON_KEY),
        "SUPABASE_SERVICE_ROLE_KEY_set": bool(SUPABASE_SERVICE_ROLE_KEY),
    }


if __name__ == "__main__":
    if len(sys.argv) > 1:
        print(json.dumps(connect_from_url(sys.argv[1]), indent=2))
    else:
        print(json.dumps(current_config(), indent=2))
