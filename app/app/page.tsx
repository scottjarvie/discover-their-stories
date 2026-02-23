/**
 * App Dashboard
 * 
 * Purpose: Main dashboard showing all tools and recent activity
 * 
 * Key Elements:
 * - Welcome message
 * - Quick actions
 * - Recent activity
 * - Tool shortcuts
 * 
 * Dependencies:
 * - @/components/ui/card
 * - @/components/ui/button
 * - lucide-react icons
 * 
 * Last Updated: Initial setup
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Upload, Plus, ArrowRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Workspace",
  description: "Manage imports and launch Source Documentation tools in your workspace.",
  path: "/app",
});

export default function DashboardPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          Welcome back
        </h1>
        <p className="text-stone-500">
          What would you like to work on today?
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-2">
              <Upload className="w-5 h-5 text-amber-700" />
            </div>
            <CardTitle className="text-lg">Import Evidence Pack</CardTitle>
            <CardDescription>
              Import extracted data from the browser extension
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full">
              <Link href="/app/source-docs?action=import">
                Import JSON
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-2">
              <FileText className="w-5 h-5 text-green-700" />
            </div>
            <CardTitle className="text-lg">Source Documentation</CardTitle>
            <CardDescription>
              View and manage documented people
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-amber-700 hover:bg-amber-800">
              <Link href="/app/source-docs" className="flex items-center gap-2">
                Open Tool
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-dashed">
          <CardHeader>
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center mb-2">
              <Plus className="w-5 h-5 text-stone-400" />
            </div>
            <CardTitle className="text-lg text-stone-400">More Tools Coming</CardTitle>
            <CardDescription>
              Story Writer, Timeline Builder, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="w-full text-stone-400">
              <Link href="/roadmap">
                View Roadmap
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-400" />
            <CardTitle>Recent Activity</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-stone-400">
            <p>No recent activity yet.</p>
            <p className="text-sm mt-1">
              Import an Evidence Pack to get started.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
