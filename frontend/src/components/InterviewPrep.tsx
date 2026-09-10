"use client";

import { useState, useEffect } from "react";

interface Question {
  question: string;
  scopes: string[];
}

interface ProjectStory {
  title: string;
  pitch: string;
  architecture: string;
  hardest_part: string;
  impact: string;
  likely_questions: string[];
}

const CATEGORIES = [
  { key: "python", label: "Python" },
  { key: "fastapi_backend", label: "FastAPI / Backend" },
  { key: "sql", label: "SQL" },
  { key: "java", label: "Java" },
  { key: "system_design", label: "System Design" },
  { key: "ai_genai", label: "AI / GenAI" },
  { key: "hr", label: "HR" },
];

const PROJECT_STORIES = [
  { key: "biometric_attendance", label: "Biometric Attendance" },
  { key: "nsa_sports", label: "NSA Sports" },
  { key: "cas_parser", label: "CAS Parser" },
  { key: "fashiongallery", label: "FashionGallery" },
  { key: "infomatics_regtech", label: "Infomatics RegTech" },
];

const InterviewPrep: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"questions" | "stories">("questions");
  const [category, setCategory] = useState("python");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [story, setStory] = useState<ProjectStory | null>(null);
  const [selectedStory, setSelectedStory] = useState("biometric_attendance");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [category]);

  useEffect(() => {
    loadStory();
  }, [selectedStory]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_LOCAL_API_URL}/api/prep/questions?category=${category}`
      );
      if (!res.ok) throw new Error("Failed to load questions");
      const data = await res.json();
      setQuestions(data.questions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStory = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_LOCAL_API_URL}/api/prep/project-story/${selectedStory}`
      );
      if (!res.ok) throw new Error("Failed to load story");
      const data = await res.json();
      setStory(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1 style={{ fontSize: "1.5rem", margin: "0 0 1rem" }}>Interview Prep</h1>

      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            backgroundColor: activeTab === "questions" ? "#111827" : "transparent",
            color: activeTab === "questions" ? "#ffffff" : "#374151",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Question Bank
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("stories")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "0.375rem",
            border: "none",
            backgroundColor: activeTab === "stories" ? "#111827" : "transparent",
            color: activeTab === "stories" ? "#ffffff" : "#374151",
            cursor: "pointer",
            fontSize: "0.875rem",
            fontWeight: 600,
          }}
        >
          Project Stories
        </button>
      </div>

      {activeTab === "questions" && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setCategory(cat.key)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor: category === cat.key ? "#111827" : "transparent",
                  color: category === cat.key ? "#ffffff" : "#374151",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ color: "#6b7280" }}>Loading questions...</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {questions.map((q, i) => (
                <li
                  key={i}
                  style={{
                    padding: "0.85rem 1rem",
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: i % 2 === 0 ? "#f9fafb" : "#ffffff",
                  }}
                >
                  <span style={{ fontWeight: 600, marginRight: "0.5rem" }}>{i + 1}.</span>
                  {q.question}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {activeTab === "stories" && (
        <div>
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {PROJECT_STORIES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSelectedStory(s.key)}
                style={{
                  padding: "0.4rem 0.8rem",
                  borderRadius: "999px",
                  border: "1px solid #d1d5db",
                  backgroundColor: selectedStory === s.key ? "#111827" : "transparent",
                  color: selectedStory === s.key ? "#ffffff" : "#374151",
                  fontSize: "0.875rem",
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {story && (
            <div style={{ border: "1px solid #e5e7eb", borderRadius: "0.5rem", overflow: "hidden" }}>
              <StorySection title="Title" content={story.title} />
              <StorySection title="Pitch" content={story.pitch} />
              <StorySection title="Architecture" content={story.architecture} />
              <StorySection title="Hardest Part" content={story.hardest_part} />
              <StorySection title="Impact" content={story.impact} />
              <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #e5e7eb" }}>
                <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: "0 0 0.5rem" }}>
                  Likely Questions
                </h3>
                <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                  {story.likely_questions.map((q, i) => (
                    <li key={i} style={{ marginBottom: "0.25rem" }}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const StorySection: React.FC<{ title: string; content: string }> = ({ title, content }) => (
  <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid #e5e7eb" }}>
    <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#374151", margin: "0 0 0.25rem" }}>{title}</h3>
    <p style={{ margin: 0, color: "#111827" }}>{content}</p>
  </div>
);

export default InterviewPrep;
