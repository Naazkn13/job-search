import { FC, useState } from "react";
import type { Application } from "@/types/application";

interface ApplicationListProps {
  applications: Application[];
  onSelect: (app: Application) => void;
}

const ApplicationList: FC<ApplicationListProps> = ({ applications, onSelect }) => {
  const [filter, setFilter] = useState<string>("all");

  const filtered = applications.filter((app) => {
    if (filter === "all") return true;
    return app.status === filter;
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Applications</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <FilterButton
          label="All"
          active={filter === "all"}
          onClick={() => setFilter("all")}
        />
        {["planned", "applied", "assessment", "interview_1", "hr", "offer", "rejected"].map(
          (s) => (
            <FilterButton
              key={s}
              label={s}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          )
        )}
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {filtered.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No applications match this filter.
          </div>
        ) : (
          filtered.map((app) => (
            <Row key={app.id} app={app} onClick={() => onSelect(app)} />
          ))
        )}
      </div>
    </div>
  );
};

const FilterButton: FC<{
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "0.4rem 0.8rem",
      borderRadius: "999px",
      border: "1px solid #d1d5db",
      backgroundColor: active ? "#111827" : "transparent",
      color: active ? "#ffffff" : "#374151",
      fontSize: "0.875rem",
      cursor: "pointer",
    }}
  >
    {label}
  </button>
);

const Row: FC<{ app: Application; onClick: () => void }> = ({ app, onClick }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0.85rem 1rem",
      borderBottom: "1px solid #e5e7eb",
      cursor: "pointer",
      backgroundColor: "#ffffff",
    }}
  >
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{app.company_name}</div>
      <div style={{ color: "#4b5563", fontSize: "0.875rem" }}>
        {app.role}
        {app.location ? ` · ${app.location}` : ""}
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
      <span
        style={{
          fontSize: "0.75rem",
          color: "#6b7280",
          backgroundColor: "#f3f4f6",
          padding: "2px 8px",
          borderRadius: "999px",
        }}
      >
        {app.resume_version}
      </span>
    </div>
  </div>
);

export default ApplicationList;
