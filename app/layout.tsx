import type { Metadata } from "next";
import "./globals.css";
import GlobalNav from "./components/GlobalNav";
import { LanguageProvider } from "./components/LanguageProvider";

export const metadata: Metadata = {
  title: "Team Avengers AI Platform",
  description: "SuperAgent CRM, campaigns, team, and knowledge platform.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <GlobalNav />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}