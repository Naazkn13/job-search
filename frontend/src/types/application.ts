export type Application = {
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
};

export const STATUS_LABELS: Record<string, string> = {
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

export const STATUS_ORDER: string[] = [
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

export const RESUME_LABELS: Record<string, string> = {
  A: "Python / Backend",
  B: "AI / GenAI",
  C: "Java / Full Stack",
};
