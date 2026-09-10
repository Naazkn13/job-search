import { FC, useState, useMemo } from "react";
import type { Application, ApplicationStatus, RESUME_LABELS, STATUS_LABELS, STATUS_ORDER } from "@/types/application";

const statusLabels: Record<ApplicationStatus, string> = {
  planned: "Planned",
  prepared: "Prepared",
  applied: "Applied",
  assessment: "Assessment",
  interview_1: "Interview 1",
  interview_2: "Interview 2",
  hr: "HR Round",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const statusOrder: ApplicationStatus[] = [
  "planned",
  "prepared",
  "applied",
  "assessment",
  "interview_1",
  "interview_2",
  "hr",
  "offer",
  "rejected",
  "withdrawn",
];

const resumeLabels: Record<string, string> = {
  A: "Python / Backend",
  B: "AI / GenAI",
  C: "Java / Full Stack",
};

interface DashboardProps {
  applications: Application[];
}

const Dashboard: FC<DashboardProps> = ({ applications }) => {
  const totals = useMemo(() => {
    const byStatus: Record<string, number> = {};
    applications.forEach((a) => {
      byStatus[a.status] = (byStatus[a.status] ?? 0) + 1;
    });
    const total = applications.length;
    const applied = byStatus["applied"] ?? 0;
    const pending = byStatus["assessment"] ?? 0;
    const interviews =
      (byStatus["interview_1"] ?? 0) +
      (byStatus["interview_2"] ?? 0) +
      (byStatus["hr"] ?? 0);
    const offers = byStatus["offer"] ?? 0;
    const recent = [...applications]
      .sort(
        (a, b) =>
          new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime()
      )
      .slice(0, 5);
    return { byStatus, total, applied, pending, interviews, offers, recent };
  }, [applications]);

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Job Search Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "0.75rem",
          marginBottom: "1.5rem",
        }}
      >
        <StatCard label="Total Applications" value={totals.total} />
        <StatCard label="Applied" value={totals.applied} />
        <StatCard label="Pending Review" value={totals.pending} />
        <StatCard label="Interviews" value={totals.interviews} />
        <StatCard label="Offers" value={totals.offers} />
      </div>

      <Section title="Recent Applications">
        {totals.recent.length === 0 ? (
          <EmptyNote>No applications yet. Add one to get started.</EmptyNote>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {totals.recent.map((app) => (
              <li
                key={app.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{app.company_name}</div>
                  <div style={{ color: "#4b5563", fontSize: "0.875rem" }}>
                    {app.role}
                    {app.location ? ` · ${app.location}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <StatusBadge status={app.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
};

const StatCard: FC<{ label: string; value: number }> = ({ label, value }) => (
  <div
    style={{
      backgroundColor: "#f9fafb",
      borderRadius: "0.5rem",
      padding: "1rem",
      border: "1px solid #e5e7eb",
    }}
  >
    <div
      style={{
        fontSize: "0.75rem",
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "1.75rem",
        fontWeight: 700,
        marginTop: "0.25rem",
        color: "#111827",
      }}
    >
      {value}
    </div>
  </div>
);

const Section: FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div>
    <h2
      style={{
        fontSize: "1rem",
        fontWeight: 600,
        margin: "0 0 0.5rem",
        color: "#111827",
      }}
    >
      {title}
    </h2>
    {children}
  </div>
);

const EmptyNote: FC = () => (
  <div
    style={{
      color: "#6b7280",
      fontSize: "0.875rem",
      padding: "0.75rem 0",
    }}
  >
    No applications yet. Add one to get started.
  </div>
);

export default Dashboard;
