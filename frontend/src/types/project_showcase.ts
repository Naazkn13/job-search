export interface ProjectShowcase {
  id: string;
  title: string;
  one_line_pitch: string;
  description: string | null;
  technologies: string[];
  live_link: string | null;
  repo_link: string | null;
  status: "ready" | "in_progress" | "not_yet";
  resume_versions: string[];
  resume_bullets: string[];
  interview_story: Record<string, unknown> | null;
  featured: boolean;
  created_at: string | null;
  updated_at: string | null;
}
