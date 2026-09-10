"use client";

import { useState } from "react";

interface ResumeTailorProps {
  versions: Array<{ version: string; label: string }>;
}

const ResumeTailor: React.FC<ResumeTailorProps> = ({ versions }) => {
  const [version, setVersion] = useState("A");
  const [jdText, setJdText] = useState("");
  const [jdNotes, setJdNotes] = useState("");
  const [changesMade, setChangesMade] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"markdown" | "html">("markdown");

  const generateResume = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_LOCAL_API_URL}/api/resume/${version}/build`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jd_text: jdText, jd_notes: jdNotes, changes_made: changesMade }),
        }
      );
      if (!res.ok) throw new Error("Failed to generate resume");
      const data = await res.json();
      setMarkdown(data.markdown);
      setHtml(data.html);
    } catch (err) {
      alert("Failed to generate resume: " + (err instanceof Error ? err.message : err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Resume Tailor</h1>
      <p style={{ color: "#4b5563", marginBottom: "1rem" }}>
        Paste a job description and generate a tailored resume. You can also add notes about changes you made for this application.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Resume Version</label>
          <select value={version} onChange={(e) => setVersion(e.target.value)} style={inputStyle}>
            {versions.map((v) => (
              <option key={v.version} value={v.version}>
                {v.version} — {v.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Changes Made (optional)</label>
          <input
            type="text"
            value={changesMade}
            onChange={(e) => setChangesMade(e.target.value)}
            style={inputStyle}
            placeholder="e.g., Added React, emphasized FastAPI"
          />
        </div>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>Job Description</label>
        <textarea
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          style={{ ...inputStyle, minHeight: "150px", resize: "vertical" }}
          placeholder="Paste the full job description here..."
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ display: "block", marginBottom: "0.35rem", fontWeight: 600 }}>JD Notes (optional)</label>
        <textarea
          value={jdNotes}
          onChange={(e) => setJdNotes(e.target.value)}
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
          placeholder="Notes about how you tailored this resume for the JD..."
        />
      </div>

      <button
        type="button"
        onClick={generateResume}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#9ca3af" : "#111827",
          color: "#ffffff",
          border: "none",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Generating..." : "Generate Tailored Resume"}
      </button>

      {markdown && html && (
        <div style={{ marginTop: "1.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <button
              type="button"
              onClick={() => setActiveTab("markdown")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                backgroundColor: activeTab === "markdown" ? "#111827" : "transparent",
                color: activeTab === "markdown" ? "#ffffff" : "#374151",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              Markdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("html")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                border: "none",
                backgroundColor: activeTab === "html" ? "#111827" : "transparent",
                color: activeTab === "html" ? "#ffffff" : "#374151",
                cursor: "pointer",
                fontSize: "0.875rem",
                fontWeight: 600,
              }}
            >
              HTML Preview
            </button>
          </div>

          {activeTab === "markdown" ? (
            <pre
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "1rem",
                whiteSpace: "pre-wrap",
                fontSize: "0.875rem",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              {markdown}
            </pre>
          ) : (
            <div
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                padding: "2rem",
                maxHeight: "500px",
                overflow: "auto",
              }}
            >
              <iframe
                srcDoc={html}
                style={{ width: "100%", height: "400px", border: "none" }}
                title="Resume Preview"
              />
            </div>
          )}
        </div>
      )}
    </div>
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

export default ResumeTailor;
