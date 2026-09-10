import type { Application } from "@/types/application";
import { fetchApplications } from "@/lib/applications";

export async function loadApplications(filters?: {
  status?: string;
  resume_version?: string;
  company_id?: string;
}): Promise<Application[]> {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.resume_version) params.set("resume_version", filters.resume_version);
  if (filters?.company_id) params.set("company_id", filters.company_id);

  const res = await fetch(
    `${process.env.NEXT_LOCAL_API_URL}/api/applications?${params}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch applications");
  }
  const json = await res.json();
  return json.applications as Application[];
}
