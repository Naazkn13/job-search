import "./globals.css";

export const metadata = {
  title: "Job Search System",
  description: "MNC job application tracker, resume preparation, and interview prep.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
