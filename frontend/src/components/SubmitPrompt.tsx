import { FC } from "react";

interface SubmitPromptProps {
  applications: Array<{
    id: string;
    company_name: string;
    role: string;
    job_link: string;
    resume_version: string;
    status: string;
  }>;
  onSubmit: (id: string) => void;
  submitting: boolean;
}

const SubmitPrompt: FC<SubmitPromptProps> = ({ applications, onSubmit, submitting }) => {
  if (applications.length === 0) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p style={{ color: "#6b7280" }}>No pending submissions.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Submit Queue</h1>
      <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
        Applications waiting for you to submit. Click after you've submitted.
      </p>

      <div
        style={{
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          overflow: "hidden",
        }}
      >
        {applications.map((app) => (
          <div
            key={app.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0.85rem 1rem",
              borderBottom: "1px solid #e5e7eb",
              backgroundColor: app.status === "prepared" ? "#fefce8" : "#ffffff",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, marginBottom: "0.25rem" }}>{app.company_name}</div>
              <div style={{ color: "#4b5563", fontSize: "0.875rem" }}>
                {app.role}
                {app.job_link ? ` · <a href="${app.job_link}" target="_blank" rel="noopener noreferrer">Open</a>` : ""}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "0.25rem" }}>
                Resume: {app.resume_version}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSubmit(app.id)}
              disabled={submitting}
              style={{
                backgroundColor: submitting ? "#9ca3af" : "#111827",
                color: "#ffffff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Submitting..." : "Submitted"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubmitPrompt;
