import type { Application } from "@/types/application";
import { fetchApplications } from "@/lib/applications";

export async function loadApplications(filters?: {
  status?: string;
  resume_version?: string;
}): Promise<Application[]> {
  try {
    return await fetchApplications(filters);
  } catch (err) {
    console.error("Failed to load applications", err);
    return [];
  }
}

export function filterByStatus(
  applications: Application[],
  status?: string
): Application[] {
  if (!status || status === "all") return applications;
  return applications.filter((a) => a.status === status);
}

export function filterByResumeVersion(
  applications: Application[],
  version?: string
): Application[] {
  if (!version || version === "all") return applications;
  return applications.filter((a) => a.resume_version === version);
}
