"""
Job Search backend — Supabase helpers.

Reads credentials from env:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
"""

from __future__ import annotations

import os
from typing import Any, Dict, List, Optional

import httpx

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


def _headers(use_service_role: bool = False) -> Dict[str, str]:
    auth = SUPABASE_SERVICE_ROLE_KEY if use_service_role else SUPABASE_ANON_KEY
    return {
        "apikey": auth,
        "Authorization": f"Bearer {auth}",
        "Content-Type": "application/json",
    }


def _url(table: str) -> str:
    return f"{SUPABASE_URL}/rest/v1/{table}"


async def supabase_insert(
    table: str,
    payload: Dict[str, Any],
    use_service_role: bool = True,
) -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            _url(table),
            json=payload,
            headers=_headers(use_service_role=use_service_role),
        )
        resp.raise_for_status()
        return resp.json()


async def supabase_select(
    table: str,
    filter_: Optional[Dict[str, Any]] = None,
    use_service_role: bool = False,
) -> List[Dict[str, Any]]:
    params: Dict[str, Any] = {}
    if filter_:
        params.update(filter_)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            _url(table),
            params=params,
            headers=_headers(use_service_role=use_service_role),
        )
        resp.raise_for_status()
        return resp.json()


async def supabase_update(
    table: str,
    record_id: str,
    payload: Dict[str, Any],
    id_column: str = "id",
    use_service_role: bool = True,
) -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        resp = await client.patch(
            f"{_url(table)}?id=eq.{record_id}",
            json=payload,
            headers=_headers(use_service_role=use_service_role),
        )
        resp.raise_for_status()
        return resp.json()
