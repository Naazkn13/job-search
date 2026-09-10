import { useState } from "react";
import type { Application } from "@/types/application";

interface ApplicationFormProps {
  onSubmit: (data: Partial<Application>) => void;
  initial?: Partial<Application>;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, initial }) => {
  const [company, setCompany] = useState(initial?.company_name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [jobLink, setJobLink] = useState(initial?.job_link ?? "");
  const [salaryExpected, setSalaryExpected] = useState(initial?.salary_expected ?? "");
  const [resumeVersion, setResumeVersion] = useState<"A" | "B" | "C">(
    (initial?.resume_version as "A" | "B" | "C") ?? "A"
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      company_name: company,
      role,
      location,
      job_link: jobLink,
      salary_expected: salaryExpected,
      resume_version: resumeVersion,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "640px", padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Add Application</h1>

      <Field label="Company">
        <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} required style={inputStyle} placeholder="Accenture" />
      </Field>

      <Field label="Role">
        <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required style={inputStyle} placeholder="Python Developer" />
      </Field>

      <Field label="Location">
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={inputStyle} placeholder="Mumbai" />
      </Field>

      <Field label="Job Link">
        <input type="url" value={jobLink} onChange={(e) => setJobLink(e.target.value)} style={inputStyle} placeholder="https://..." />
      </Field>

      <Field label="Expected Salary">
        <input type="text" value={salaryExpected} onChange={(e) => setSalaryExpected(e.target.value)} style={inputStyle} placeholder="7-8 LPA" />
      </Field>

      <Field label="Resume Version">
        <select value={resumeVersion} onChange={(e) => setResumeVersion(e.target.value as "A" | "B" | "C")} style={inputStyle}>
          <option value="A">Python / Backend</option>
          <option value="B">AI / GenAI</option>
          <option value="C">Java / Full Stack</option>
        </select>
      </Field>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button type="submit" style={primaryButtonStyle}>Add Application</button>
        <button
          type="button"
          onClick={() => { setCompany(""); setRole(""); setLocation(""); setJobLink(""); setSalaryExpected(""); setResumeVersion("A"); }}
          style={secondaryButtonStyle}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ marginBottom: "1rem" }}>
    <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>{label}</label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  boxSizing: "border-box",
};

const primaryButtonStyle: React.CSSProperties = {
  backgroundColor: "#111827",
  color: "#ffffff",
  border: "none",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  backgroundColor: "transparent",
  color: "#374151",
  border: "1px solid #d1d5db",
  padding: "0.75rem 1.5rem",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  cursor: "pointer",
};

export default ApplicationForm;
