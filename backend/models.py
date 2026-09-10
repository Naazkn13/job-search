import os
from dataclasses import dataclass, field
from typing import Any, Dict, List

@dataclass
class Application:
    id: str | None = None
    company_id: str | None = None
    company_name: str = ""
    role: str = ""
    location: str = ""
    job_link: str = ""
    salary_expected: str = ""
    resume_version: str = "A"
    status: str = "planned"
    applied_at: str | None = None
    assessment_at: str | None = None
    interview_1_at: str | None = None
    interview_2_at: str | None = None
    hr_at: str | None = None
    result: str = ""
    salary_offered: str = ""
    jd_text: str = ""
    jd_notes: str = ""
    changes_made: str = ""
    notes: str = ""
    submit_prompted: bool = False
    submitted_at: str | None = None
    created_at: str | None = None
    updated_at: str | None = None

    def serialize(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "company_id": self.company_id,
            "company_name": self.company_name,
            "role": self.role,
            "location": self.location,
            "job_link": self.job_link,
            "salary_expected": self.salary_expected,
            "resume_version": self.resume_version,
            "status": self.status,
            "applied_at": self.applied_at,
            "assessment_at": self.assessment_at,
            "interview_1_at": self.interview_1_at,
            "interview_2_at": self.interview_2_at,
            "hr_at": self.hr_at,
            "result": self.result,
            "salary_offered": self.salary_offered,
            "jd_text": self.jd_text,
            "jd_notes": self.jd_notes,
            "changes_made": self.changes_made,
            "notes": self.notes,
            "submit_prompted": self.submit_prompted,
            "submitted_at": self.submitted_at,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
        }

@dataclass
class ResumeVersion:
    version: str
    headline: str
    summary: str
    skills_order: List[str]
    experience: List[Dict[str, Any]]
    projects: List[Dict[str, Any]]
    education: str
    certifications: str
    meta: Dict[str, Any] = field(default_factory=dict)

@dataclass
class ProjectShowcase:
    id: str | None = None
    title: str = ""
    one_line_pitch: str = ""
    description: str = ""
    technologies: List[str] = field(default_factory=list)
    live_link: str = ""
    repo_link: str = ""
    status: str = "in_progress"
    resume_versions: List[str] = field(default_factory=lambda: ["A","B","C"])
    resume_bullets: List[str] = field(default_factory=list)
    interview_story: Dict[str, Any] | None = None
    featured: bool = False
    created_at: str | None = None
    updated_at: str | None = None
