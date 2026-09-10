import type { FC } from "react";

interface ApplicationFormProps {
  onSubmit: (data: Partial<Application>) => void;
  initial?: Partial<Application>;
}

export interface Application {
  id: string;
  company_id: string | null;
  company_name: string;
  role: string;
  location: string;
  job_link: string;
  salary_expected: string;
  resume_version: "A" | "B" | "C";
  status: string;
  applied_at: string | null;
  assessment_at: string | null;
  interview_1_at: string | null;
  interview_2_at: string | null;
  hr_at: string | null;
  result: string;
  salary_offered: string;
  jd_text: string;
  jd_notes: string;
  changes_made: string;
  notes: string;
  submit_prompted: boolean;
  submitted_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

const ApplicationForm: FC<ApplicationFormProps> = ({ onSubmit, initial }) => {
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

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Company</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
          style={inputStyle}
          placeholder="Accenture"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Role</label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={inputStyle}
          placeholder="Python Developer"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
          placeholder="Mumbai"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Job Link</label>
        <input
          type="url"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          style={inputStyle}
          placeholder="https://..."
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Expected Salary</label>
        <input
          type="text"
          value={salaryExpected}
          onChange={(e) => setSalaryExpected(e.target.value)}
          style={inputStyle}
          placeholder="7-8 LPA"
        />
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Resume Version</label>
        <select
          value={resumeVersion}
          onChange={(e) => setResumeVersion(e.target.value as "A" | "B" | "C")}
          style={inputStyle}
        >
          <option value="A">Python / Backend</option>
          <option value="B">AI / GenAI</option>
          <option value="C">Java / Full Stack</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.5rem" }}>
        <button
          type="submit"
          style={{
            backgroundColor: "#111827",
            color: "#ffffff",
            border: "none",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Add Application
        </button>
        <button
          type="button"
          onClick={() => {
            setCompany("");
            setRole("");
            setLocation("");
            setJobLink("");
            setSalaryExpected("");
            setResumeVersion("A");
          }}
          style={{
            backgroundColor: "transparent",
            color: "#374151",
            border: "1px solid #d1d5db",
            padding: "0.75rem 1.5rem",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.75rem",
  border: "1px solid #d1d5db",
  borderRadius: "0.5rem",
  fontSize: "1rem",
  boxSizing: "border-box",
};

export default ApplicationForm;
