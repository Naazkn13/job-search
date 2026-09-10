"""
Job Search backend — resume generation.

Reads resume source from resume_content/versions.json and produces:
- role-specific markdown
- tailored markdown for a job description
- static HTML resume
"""

from __future__ import annotations

import json
import pathlib
from typing import Any, Dict, List, Optional

RESUME_SOURCE_PATH = pathlib.Path(__file__).resolve().parent / "resume_content" / "versions.json"


def load_resume_source() -> Dict[str, Any]:
    if not RESUME_SOURCE_PATH.exists():
        raise FileNotFoundError(f"Resume source not found: {RESUME_SOURCE_PATH}")
    return json.loads(RESUME_SOURCE_PATH.read_text(encoding="utf-8"))


def get_version(source: Dict[str, Any], version: str) -> Dict[str, Any]:
    if version not in source:
        raise ValueError(f"Unknown resume version: {version}")
    return source[version]


def resume_markdown(version_data: Dict[str, Any]) -> str:
    lines: List[str] = []
    lines.append(f"# {version_data['headline']}")
    lines.append("")
    lines.append(version_data["summary"])
    lines.append("")
    lines.append("## Skills")
    lines.append("")
    for skill in version_data["skills_order"]:
        lines.append(f"- {skill}")
    lines.append("")
    lines.append("## Experience")
    lines.append("")
    for exp in version_data["experience"]:
        lines.append(f"### {exp['company']} — {exp['role']}")
        lines.append("")
        lines.append(f"**{exp.get('location','')} | {exp.get('period','')}**")
        lines.append("")
        for bullet in exp.get("bullets", []):
            lines.append(f"- {bullet}")
        lines.append("")
    lines.append("## Projects")
    lines.append("")
    for proj in version_data.get("projects", []):
        lines.append(f"### {proj['name']}")
        lines.append("")
        if proj.get("type"):
            lines.append(f"**{proj['type']}**")
        if proj.get("link"):
            lines.append(f"- Live: {proj['link']}")
        if proj.get("repo"):
            lines.append(f"- Repo: {proj['repo']}")
        for bullet in proj.get("bullets", []):
            lines.append(f"- {bullet}")
        lines.append("")
    lines.append(f"## Education\n\n{version_data['education']}\n")
    if version_data.get("certifications"):
        lines.append(f"## Certifications\n\n{version_data['certifications']}\n")
    lines.append("")
    lines.append(f"Meta: {json.dumps(version_data.get('meta', {}))}")
    return "\n".join(lines)


def tailored_resume_markdown(
    version_data: Dict[str, Any],
    jd_text: str,
    jd_notes: Optional[str] = None,
    changes_made: Optional[str] = None,
) -> str:
    base = resume_markdown(version_data)
    jd_text_short = jd_text.strip()[:500] if jd_text.strip() else ""
    if jd_text_short:
        base += "\n\n## Tailoring Notes\n\n"
        base += f"- JD sample: {jd_text_short}\n"
    if jd_notes:
        base += f"- JD notes: {jd_notes}\n"
    if changes_made:
        base += f"- Changes made: {changes_made}\n"
    return base


def resume_html(version_data: Dict[str, Any]) -> str:
    skills_html = ", ".join(version_data["skills_order"])
    exp_rows = []
    for exp in version_data["experience"]:
        bullets = "\n".join(f"<li>{b}</li>" for b in exp.get("bullets", []))
        exp_rows.append(
            f"<div class=\"exp\">\n"
            f"  <h3>{exp['company']} — {exp['role']}</h3>\n"
            f"  <p>{exp.get('location','')} | {exp.get('period','')}</p>\n"
            f"  <ul>{bullets}</ul>\n"
            f"</div>"
        )
    proj_rows = []
    for proj in version_data.get("projects", []):
        links = ""
        if proj.get("link"):
            links += f' <a href="{proj["link"]}">live</a>'
        if proj.get("repo"):
            links += f' <a href="{proj["repo"]}">repo</a>'
        bullets = "\n".join(f"<li>{b}</li>" for b in proj.get("bullets", []))
        proj_rows.append(
            f"<div class=\"proj\">\n"
            f"  <h3>{proj['name']} {links}</h3>\n"
            f"  <p>{proj.get('type','')}</p>\n"
            f"  <ul>{bullets}</ul>\n"
            f"</div>"
        )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Resume — {version_data['version']}</title>
<style>
  body {{ font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; max-width: 800px; margin: 2rem auto; padding: 0 1rem; color: #111; line-height: 1.5; }}
  h1 {{ font-size: 1.6rem; margin: 0 0 0.5rem; }}
  h2 {{ font-size: 1.25rem; margin: 1.5rem 0 0.5rem; border-bottom: 1px solid #ddd; padding-bottom: 0.25rem; }}
  h3 {{ font-size: 1.05rem; margin: 0.75rem 0 0.25rem; }}
  p {{ margin: 0.25rem 0; }}
  ul {{ margin: 0.25rem 0 0.5rem; padding-left: 1.25rem; }}
  li {{ margin: 0.15rem 0; }}
  a {{ color: #0a76ff; text-decoration: none; }}
  a:hover {{ text-decoration: underline; }}
</style>
</head>
<body>
  <h1>{version_data['headline']}</h1>
  <p>{version_data['summary']}</p>
  <h2>Skills</h2>
  <p>{skills_html}</p>
  <h2>Experience</h2>
  {''.join(exp_rows)}
  <h2>Projects</h2>
  {''.join(proj_rows)}
  <h2>Education</h2>
  <p>{version_data['education']}</p>
  {f"<h2>Certifications</h2><p>{version_data['certifications']}</p>" if version_data.get('certifications') else ''}
</body>
</html>
"""


def build_ready_pack(
    version: str,
    jd_text: str = "",
    jd_notes: str = "",
    changes_made: str = "",
) -> Dict[str, Any]:
    source = load_resume_source()
    version_data = get_version(source, version)
    return {
        "version": version,
        "headline": version_data["headline"],
        "markdown": tailored_resume_markdown(
            version_data,
            jd_text=jd_text,
            jd_notes=jd_notes,
            changes_made=changes_made,
        ),
        "html": resume_html(version_data),
        "skills": version_data["skills_order"],
        "meta": version_data.get("meta", {}),
    }
