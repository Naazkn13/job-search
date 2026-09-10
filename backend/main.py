"""
Job Search backend — wired API.

Uses:
- supabase_client for storage
- resume_builder for resume generation
- app_logic for tailoring and submit-prompt flow
- prep_content for interview prep
"""

from __future__ import annotations

import os
from contextlib import asynccontextmanager
from typing import Any, Dict, List, Optional

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from models import Application, ProjectShowcase
from resume_builder import build_ready_pack, get_version, load_resume_source, resume_markdown, resume_html
from app_logic import application_ready_pack, pick_resume_version
from prep.prep_content import questions_for, project_story
from supabase_client import (
    supabase_insert,
    supabase_select,
    supabase_update,
)

# Load .env file
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not SUPABASE_URL or not SUPABASE_ANON_KEY:
        print("[job-search-backend] WARNING: Supabase credentials not configured. Running in local mode.")
    yield


app = FastAPI(title="Job Search Backend", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ------------------------------------------------------------------
# Health and resume versions
# ------------------------------------------------------------------


@app.get("/health")
def health() -> Dict[str, Any]:
    supabase_ready = bool(SUPABASE_URL and SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY)
    return {"status": "ok", "supabase_configured": supabase_ready}


@app.get("/api/resume/versions")
def list_resume_versions() -> Dict[str, Any]:
    source = load_resume_source()
    return {
        "versions": ["A", "B", "C"],
        "labels": {
            "A": source["A"]["headline"],
            "B": source["B"]["headline"],
            "C": source["C"]["headline"],
        },
    }


@app.get("/api/resume/{version}")
def get_resume(version: str) -> Dict[str, Any]:
    source = load_resume_source()
    version_data = get_version(source, version)
    return {
        "version": version,
        "headline": version_data["headline"],
        "summary": version_data["summary"],
        "skills": version_data["skills_order"],
        "experience": version_data["experience"],
        "projects": version_data["projects"],
        "education": version_data["education"],
        "certifications": version_data.get("certifications", ""),
        "meta": version_data.get("meta", {}),
    }


@app.get("/api/resume/{version}/markdown")
def get_resume_markdown(version: str) -> Dict[str, Any]:
    source = load_resume_source()
    version_data = get_version(source, version)
    return {"version": version, "markdown": resume_markdown(version_data)}


@app.get("/api/resume/{version}/html")
def get_resume_html(version: str) -> Dict[str, Any]:
    source = load_resume_source()
    version_data = get_version(source, version)
    return {"version": version, "html": resume_html(version_data)}


@app.post("/api/resume/{version}/build")
def build_resume_pack(
    version: str,
    jd_text: str = Query(default=""),
    jd_notes: str = Query(default=""),
    changes_made: str = Query(default=""),
) -> Dict[str, Any]:
    return build_ready_pack(
        version=version,
        jd_text=jd_text,
        jd_notes=jd_notes,
        changes_made=changes_made,
    )


# ------------------------------------------------------------------
# Companies
# ------------------------------------------------------------------


@app.post("/api/companies")
async def create_company(payload: Dict[str, Any]) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    result = await supabase_insert("companies", payload)
    return result


@app.get("/api/companies")
async def list_companies() -> List[Dict[str, Any]]:
    if not SUPABASE_URL:
        return []
    rows = await supabase_select("companies")
    return rows


# ------------------------------------------------------------------
# Applications
# ------------------------------------------------------------------


@app.post("/api/applications")
async def create_application(application: Application) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    
    # Look up company by name if company_name provided but no company_id
    company_id = application.company_id
    if not company_id and application.company_name:
        company_rows = await supabase_select("companies", filter_={"name": "eq." + application.company_name})
        if company_rows:
            company_id = company_rows[0]["id"]
        else:
            company_result = await supabase_insert("companies", {"name": application.company_name}, use_service_role=True)
            if isinstance(company_result, list) and company_result:
                company_id = company_result[0]["id"]
            elif isinstance(company_result, dict) and company_result.get("id"):
                company_id = company_result["id"]
    
    payload = application.serialize()
    payload.pop("id", None)
    payload.pop("created_at", None)
    payload.pop("updated_at", None)
    payload.pop("company_name", None)  # Not a column in applications table
    payload["company_id"] = company_id
    
    result = await supabase_insert("applications", payload, use_service_role=True)
    return result


@app.get("/api/applications")
async def list_applications(
    status: Optional[str] = Query(None),
    resume_version: Optional[str] = Query(None),
    company_id: Optional[str] = Query(None),
) -> Dict[str, Any]:
    if not SUPABASE_URL:
        return {"applications": [], "filters": {"status": status, "resume_version": resume_version}}
    filters: Dict[str, Any] = {}
    if status:
        filters["status"] = "eq." + status
    if resume_version:
        filters["resume_version"] = "eq." + resume_version
    if company_id:
        filters["company_id"] = "eq." + company_id
    rows = await supabase_select("applications", filter_=filters or None)
    return {"applications": rows, "filters": {"status": status, "resume_version": resume_version, "company_id": company_id}}


@app.patch("/api/applications/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str = Query(...),
    notes: Optional[str] = Query(None),
) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    payload: Dict[str, Any] = {"status": status, "updated_at": "now()"}
    if notes:
        payload["notes"] = notes
    result = await supabase_update("applications", application_id, payload, use_service_role=True)
    return result


@app.post("/api/applications/{application_id}/submit-prompt")
async def mark_submit_prompt(application_id: str) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    payload = {"submit_prompted": True, "updated_at": "now()"}
    result = await supabase_update("applications", application_id, payload, use_service_role=True)
    return {"application_id": application_id, "prompted": True, "updated": result}


@app.get("/api/applications/{application_id}/ready-pack")
async def get_application_ready_pack(application_id: str) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    rows = await supabase_select("applications", filter_={"id": "eq." + application_id})
    if not rows:
        raise HTTPException(status_code=404, detail="Application not found")
    application = Application(**rows[0])
    return application_ready_pack(application)


# ------------------------------------------------------------------
# Interview prep
# ------------------------------------------------------------------


@app.get("/api/prep/questions")
def list_prep_questions(category: str, role_scope: Optional[str] = Query(None)) -> Dict[str, Any]:
    try:
        questions = questions_for(category, role_scope=role_scope)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return {"category": category, "role_scope": role_scope, "questions": questions}


@app.get("/api/prep/project-story/{project_slug}")
def get_project_story(project_slug: str) -> Dict[str, Any]:
    try:
        return project_story(project_slug)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))


# ------------------------------------------------------------------
# Project showcase
# ------------------------------------------------------------------


@app.get("/api/showcase/projects")
async def list_showcase_projects(featured_only: bool = Query(False)) -> List[Dict[str, Any]]:
    if not SUPABASE_URL:
        return []
    filters: Dict[str, Any] = {}
    if featured_only:
        filters["featured"] = "eq.true"
    rows = await supabase_select("project_showcase", filter_=filters or None)
    return rows


@app.post("/api/showcase/projects")
async def create_showcase_project(payload: Dict[str, Any]) -> Any:
    if not SUPABASE_URL:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    result = await supabase_insert("project_showcase", payload, use_service_role=True)
    return result
