/**
 * App Layout
 * 
 * Purpose: Layout wrapper for all /app routes with sidebar
 * 
 * Key Elements:
 * - Sidebar navigation
 * - Main content area
 * - Responsive layout
 * 
 * Dependencies:
 * - @/components/layout/AppSidebar
 * 
 * Last Updated: Initial setup
 */

import { AppSidebar } from "@/components/layout/AppSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-stone-50">
      <AppSidebar />
      <main className="ml-64 min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  );
}
