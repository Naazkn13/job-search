import { FC, useEffect, useState, useMemo } from "react";
import type { Application } from "@/types/application";
import { StatusBadge } from "@/components/StatusBadge";

interface ApplicationDetailProps {
  application: Application | null;
}

const ApplicationDetail: FC<ApplicationDetailProps> = ({ application }) => {
  const [local, setLocal] = useState(application);

  useEffect(() => {
    setLocal(application);
  }, [application]);

  if (!local) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>Select an application to view details.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1rem",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.25rem" }}>
            {local.company_name}
          </h1>
          <p style={{ color: "#4b5563", margin: 0 }}>{local.role}</p>
        </div>
        <StatusBadge status={local.status} />
      </div>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        <Section title="Details">
          <Field label="Location" value={local.location || "—"} />
          <Field label="Job Link" value={local.job_link || "—"} />
          <Field label="Expected Salary" value={local.salary_expected || "—"} />
          <Field
            label="Resume Version"
            value={
              {
                A: "Python / Backend",
                B: "AI / GenAI",
                C: "Java / Full Stack",
              }[local.resume_version] ?? local.resume_version
            }
          />
        </Section>

        <Section title="Timeline">
          <Field label="Applied" value={local.applied_at ? new Date(local.applied_at).toLocaleString() : "—"} />
          <Field label="Assessment" value={local.assessment_at ? new Date(local.assessment_at).toLocaleString() : "—"} />
          <Field label="Interview 1" value={local.interview_1_at ? new Date(local.interview_1_at).toLocaleString() : "—"} />
          <Field label="Interview 2" value={local.interview_2_at ? new Date(local.interview_2_at).toLocaleString() : "—"} />
          <Field label="HR Round" value={local.hr_at ? new Date(local.hr_at).toLocaleString() : "—"} />
          <Field label="Result" value={local.result || "—"} />
          <Field label="Salary Offered" value={local.salary_offered || "—"} />
        </Section>

        {local.jd_text && <Section title="Job Description Notes"><Field label="Notes" value={local.jd_notes || "—"} /></Section>}
        {local.changes_made && <Section title="Changes Made"><Field label="Changes" value={local.changes_made || "—"} /></Section>}
        {local.notes && <Section title="Notes"><Field label="Notes" value={local.notes || "—"} /></Section>}
      </div>
    </div>
  );
};

const Section: FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb" }}>
    <h2 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: "0 0 0.5rem" }}>
      {title}
    </h2>
    {children}
  </div>
);

const Field: FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ marginBottom: "0.4rem" }}>
    <span style={{ color: "#6b7280", fontSize: "0.875rem" }}>{label}:</span>{" "}
    <span style={{ color: "#111827" }}>{value}</span>
  </div>
);

export default ApplicationDetail;
