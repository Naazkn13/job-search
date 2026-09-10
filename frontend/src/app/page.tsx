"use client";

import { useEffect, useState } from "react";
import Dashboard from "@/components/Dashboard";
import ApplicationList from "@/components/ApplicationList";
import ApplicationDetail from "@/components/ApplicationDetail";
import ApplicationForm from "@/components/ApplicationForm";
import SubmitPrompt from "@/components/SubmitPrompt";
import type { Application } from "@/types/application";
import { loadApplications } from "@/lib/data";

type Page = "dashboard" | "applications" | "add" | "submit-prompt";

export default function Home() {
  const [page, setPage] = useState<Page>("dashboard");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [submitQueue, setSubmitQueue] = useState<Application[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    setLoading(true);
    try {
      const apps = await loadApplications();
      setApplications(apps);
      refreshSubmitQueue(apps);
    } catch (err) {
      console.error("Failed to refresh", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (data: Partial<Application>) => {
    try {
      const res = await fetch(`${process.env.NEXT_LOCAL_API_URL}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add application");
      await refresh();
      setPage("applications");
    } catch (err) {
      alert("Failed to add application: " + (err instanceof Error ? err.message : err));
    }
  };

  const handleSubmitPrompt = async (id: string) => {
    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_LOCAL_API_URL}/api/applications/${id}/submit-prompt`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Failed to mark submitted");
      await refresh();
    } catch (err) {
      alert("Failed to update submission: " + (err instanceof Error ? err.message : err));
    } finally {
      setSubmitting(false);
    }
  };

  const refreshSubmitQueue = (apps: Application[]) => {
    setSubmitQueue(apps.filter((a) => a.status === "prepared" || a.status === "planned"));
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <nav
        style={{
          display: "flex",
          gap: "0.25rem",
          padding: "0.75rem 1rem",
          backgroundColor: "#111827",
          flexWrap: "wrap",
        }}
      >
        <NavButton
          label="Dashboard"
          active={page === "dashboard"}
          onClick={() => setPage("dashboard")}
        />
        <NavButton
          label="Applications"
          active={page === "applications"}
          onClick={() => setPage("applications")}
        />
        <NavButton
          label="Add Application"
          active={page === "add"}
          onClick={() => setPage("add")}
        />
        <NavButton
          label="Submit Queue"
          active={page === "submit-prompt"}
          onClick={() => setPage("submit-prompt")}
        />
      </nav>

      <main style={{ padding: "1rem" }}>
        {loading ? (
          <div style={{ padding: "4rem", textAlign: "center", color: "#6b7280" }}>
            Loading...
          </div>
        ) : (
          <>
            {page === "dashboard" && <Dashboard applications={applications} />}
            {page === "applications" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "1rem" }}>
                <ApplicationList applications={applications} onSelect={setSelected} />
                <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden", height: "fit-content" }}>
                  <ApplicationDetail application={selected} />
                </div>
              </div>
            )}
            {page === "add" && <ApplicationForm onSubmit={handleAdd} />}
            {page === "submit-prompt" && (
              <SubmitPrompt
                applications={submitQueue}
                onSubmit={handleSubmitPrompt}
                submitting={submitting}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

const NavButton: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      border: "none",
      backgroundColor: active ? "#374151" : "transparent",
      color: active ? "#ffffff" : "#d1d5db",
      cursor: "pointer",
      fontSize: "0.875rem",
      fontWeight: 600,
    }}
  >
    {label}
  </button>
);
