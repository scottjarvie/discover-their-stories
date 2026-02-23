import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  description: "Configure API keys, model preferences, and privacy controls.",
  path: "/app/settings",
});

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
