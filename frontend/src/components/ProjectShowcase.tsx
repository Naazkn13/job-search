"use client";

import { useState, useEffect } from "react";

interface ProjectShowcase {
  id: string;
  title: string;
  one_line_pitch: string;
  description: string | null;
  technologies: string[];
  live_link: string | null;
  repo_link: string | null;
  status: "ready" | "in_progress" | "not_yet";
  resume_versions: string[];
  resume_bullets: string[];
  interview_story: Record<string, unknown> | null;
  featured: boolean;
}

const ProjectShowcaseComponent: React.FC = () => {
  const [projects, setProjects] = useState<ProjectShowcase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProjectShowcase | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_LOCAL_API_URL}/api/showcase/projects`);
      if (!res.ok) throw new Error("Failed to load projects");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const seedProjects = async () => {
    const seedData = [
      {
        title: "Biometric Attendance & Salary System",
        one_line_pitch: "End-to-end attendance and payroll system with biometric hardware sync, backend logic, frontend, and mobile app.",
        description: "Deployed biometric attendance system for 8 hospital employees using ZKTeco SDK, FastAPI, React, and Expo. Salary engine handles 30-day cycles, PL accrual, overtime, and deductions.",
        technologies: ["Python", "FastAPI", "React", "Expo", "PostgreSQL", "Docker", "ZKTeco SDK"],
        live_link: "https://attendance-sigma-one.vercel.app",
        repo_link: "https://github.com/Naazkn13/biometric-attendance-system",
        status: "ready",
        resume_versions: ["A", "B"],
        featured: true,
      },
      {
        title: "NSA Sports Platform",
        one_line_pitch: "Role-based sports platform with registration, document review, approval workflows, automated emails, and CMS-driven content.",
        description: "Full-stack platform where players register individually or under a club, with admin document review, approval/rejection, and automated reason emails.",
        technologies: ["Next.js", "TypeScript", "PostgreSQL", "Node.js", "Tailwind CSS"],
        live_link: "https://nsasports.co.in",
        repo_link: "https://github.com/Naazkn13/nsa-sports-platform",
        status: "ready",
        resume_versions: ["A", "C"],
        featured: true,
      },
      {
        title: "CAS Parser",
        one_line_pitch: "Python desktop app extracting Demat holdings, mutual fund data, and transactions from unstructured CDSL PDF statements.",
        description: "Tauri + PyInstaller desktop app using PyMuPDF, tabula-py, and Pandas. Processes 500+ CDSL statements/month with ~98% extraction accuracy.",
        technologies: ["Python", "Tauri", "PyMuPDF", "tabula-py", "Pandas", "PyInstaller"],
        live_link: null,
        repo_link: null,
        status: "ready",
        resume_versions: ["A"],
        featured: false,
      },
      {
        title: "FashionGallery",
        one_line_pitch: "AI-powered fashion search and discovery with visual and text-based retrieval, clip-style embeddings, and RAG-style retrieval.",
        description: "AI fashion search application with clip embeddings, vector search, RAG retrieval, FastAPI backend, React/Next.js frontend, Docker deployment.",
        technologies: ["Python", "FastAPI", "React", "Next.js", "CLIP", "Qdrant", "Docker", "RAG"],
        live_link: null,
        repo_link: "https://github.com/Naazkn13/FashionGallery",
        status: "in_progress",
        resume_versions: ["B"],
        featured: true,
      },
    ];

    for (const project of seedData) {
      try {
        await fetch(`${process.env.NEXT_LOCAL_API_URL}/api/showcase/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(project),
        });
      } catch (err) {
        console.error("Failed to seed project:", err);
      }
    }
    loadProjects();
  };

  if (loading) {
    return <div style={{ padding: "1rem" }}>Loading projects...</div>;
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h1 style={{ fontSize: "1.5rem", margin: 0 }}>Project Showcase</h1>
        <button
          type="button"
          onClick={seedProjects}
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Seed Projects
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
        {projects.length === 0 ? (
          <p style={{ color: "#6b7280" }}>No projects yet. Click "Seed Projects" to add your ready projects.</p>
        ) : (
          projects.map((project) => (
            <div
              key={project.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelected(project)}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1rem",
                cursor: "pointer",
                backgroundColor: selected?.id === project.id ? "#f3f4f6" : "#ffffff",
                transition: "background-color 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{project.title}</h3>
                <span
                  style={{
                    fontSize: "0.7rem",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: project.status === "ready" ? "#dcfce7" : project.status === "in_progress" ? "#fef3c7" : "#f3f4f6",
                    color: project.status === "ready" ? "#166534" : project.status === "in_progress" ? "#92400e" : "#6b7280",
                    fontWeight: 600,
                  }}
                >
                  {project.status}
                </span>
              </div>
              <p style={{ color: "#4b5563", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{project.one_line_pitch}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {project.technologies.slice(0, 5).map((tech) => (
                  <span
                    key={tech}
                    style={{
                      fontSize: "0.7rem",
                      padding: "2px 8px",
                      borderRadius: "999px",
                      backgroundColor: "#e5e7eb",
                      color: "#374151",
                    }}
                  >
                    {tech}
                  </span>
                ))}
                {project.technologies.length > 5 && (
                  <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>+{project.technologies.length - 5}</span>
                )}
              </div>
              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.75rem" }}>
                {project.live_link && (
                  <a href={project.live_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem" }}>
                    Live →
                  </a>
                )}
                {project.repo_link && (
                  <a href={project.repo_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.875rem" }}>
                    Repo →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {selected && (
        <div style={{ marginTop: "1.5rem", border: "1px solid #e5e7eb", borderRadius: "0.5rem", padding: "1rem" }}>
          <h2 style={{ fontSize: "1.25rem", margin: "0 0 0.5rem" }}>{selected.title}</h2>
          {selected.description && <p style={{ color: "#4b5563" }}>{selected.description}</p>}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.75rem" }}>
            {selected.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  fontSize: "0.7rem",
                  padding: "2px 8px",
                  borderRadius: "999px",
                  backgroundColor: "#e5e7eb",
                  color: "#374151",
                }}
              >
                {tech}
              </span>
            ))}
          </div>
          <p style={{ fontSize: "0.875rem", color: "#6b7280", marginTop: "0.75rem" }}>
            Resume versions: {selected.resume_versions.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectShowcaseComponent;
