import { FC } from "react";

export const StatusBadge: FC<{ status: string }> = ({ status }) => {
  const labels: Record<string, string> = {
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
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        borderRadius: "999px",
        fontSize: "0.75rem",
        fontWeight: 600,
        backgroundColor:
          status === "offer"
            ? "#dcfce7"
            : status === "rejected" || status === "withdrawn"
            ? "#fee2e2"
            : "#e5e7eb",
        color:
          status === "offer"
            ? "#166534"
            : status === "rejected" || status === "withdrawn"
            ? "#991b1b"
            : "#374151",
      }}
    >
      {labels[status] ?? status}
    </span>
  );
};
