/**
 * Person Workspace Page
 * 
 * Purpose: Main workspace for a documented person
 * 
 * Key Elements:
 * - Person info header
 * - Run selector
 * - Tab navigation (Overview, Raw, AI, Diff)
 * - Content panels
 * 
 * Dependencies:
 * - @/components/ui/*
 * 
 * Last Updated: Initial setup
 */

"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  FileText, 
  Brain, 
  GitCompare, 
  Calendar,
  ExternalLink,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { PersonMetadata, RunMetadata } from "@/lib/storage/types";

interface PageProps {
  params: Promise<{ personId: string }>;
}

interface PersonData {
  person: PersonMetadata;
  runs: RunMetadata[];
  latestRunId?: string;
}

export default function PersonWorkspacePage({ params }: PageProps) {
  const { personId } = use(params);
  const router = useRouter();
  const [data, setData] = useState<PersonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/people/${personId}`);
        const result = await response.json();
        
        if (result.success) {
          setData(result);
          setSelectedRunId(result.latestRunId || result.runs[0]?.runId);
        } else {
          router.push("/app/source-docs");
        }
      } catch (error) {
        console.error("Failed to fetch person:", error);
        router.push("/app/source-docs");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [personId, router]);

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-400">
        Loading...
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { person, runs } = data;
  const selectedRun = runs.find(r => r.runId === selectedRunId);

  const dates: string[] = [];
  if (person.birthDate) dates.push(`b. ${person.birthDate}`);
  if (person.deathDate) dates.push(`d. ${person.deathDate}`);

  return (
    <div className="p-8">
      {/* Back Link */}
      <Link 
        href="/app/source-docs"
        className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to People
      </Link>

      {/* Person Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center">
            <User className="w-8 h-8 text-amber-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-1">
              {person.name || "Unknown Person"}
            </h1>
            {dates.length > 0 && (
              <p className="text-lg text-stone-500 mb-2">
                {dates.join(" – ")}
              </p>
            )}
            <div className="flex items-center gap-3">
              <Badge variant="secondary">
                {person.familySearchId}
              </Badge>
              <a
                href={`https://www.familysearch.org/tree/person/details/${person.familySearchId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-amber-700 hover:underline flex items-center gap-1"
              >
                View on FamilySearch
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Run Selector */}
        {runs.length > 0 && (
          <div className="text-right">
            <label className="block text-sm text-stone-500 mb-1">
              Extraction Run
            </label>
            <select
              value={selectedRunId || ""}
              onChange={(e) => setSelectedRunId(e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {runs.map((run) => (
                <option key={run.runId} value={run.runId}>
                  {new Date(run.capturedAt).toLocaleString()} ({run.totalSources} sources)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="raw">Raw Document</TabsTrigger>
          <TabsTrigger value="ai">AI Analysis</TabsTrigger>
          <TabsTrigger value="diff">Compare Runs</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-amber-700" />
                  Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-stone-900">
                  {selectedRun?.totalSources || 0}
                </p>
                <p className="text-sm text-stone-500">
                  {selectedRun?.expandedSections || 0} with indexed info
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5 text-amber-700" />
                  Extracted
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-stone-900">
                  {selectedRun ? new Date(selectedRun.capturedAt).toLocaleDateString() : "N/A"}
                </p>
                <p className="text-sm text-stone-500">
                  {selectedRun?.mode === "admin" ? "Admin mode" : "Standard mode"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GitCompare className="w-5 h-5 text-amber-700" />
                  Runs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-stone-900">
                  {runs.length}
                </p>
                <p className="text-sm text-stone-500">
                  extraction{runs.length !== 1 ? "s" : ""} saved
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Generate documents and run AI analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button asChild variant="outline">
                <Link href={`/app/source-docs/${personId}/raw`}>
                  <FileText className="w-4 h-4 mr-2" />
                  View Raw Document
                </Link>
              </Button>
              <Button asChild className="bg-amber-700 hover:bg-amber-800">
                <Link href={`/app/source-docs/${personId}/ai`}>
                  <Brain className="w-4 h-4 mr-2" />
                  Run AI Analysis
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raw Document Tab */}
        <TabsContent value="raw">
          <Card>
            <CardHeader>
              <CardTitle>Raw Evidence Document</CardTitle>
              <CardDescription>
                Deterministic capture of all source information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={`/app/source-docs/${personId}/raw`}>
                  Open Full Document
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Analysis Tab */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Analysis</CardTitle>
              <CardDescription>
                Run staged AI processing on the evidence
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-amber-700 hover:bg-amber-800">
                <Link href={`/app/source-docs/${personId}/ai`}>
                  <Brain className="w-4 h-4 mr-2" />
                  Open AI Processing
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Diff Tab */}
        <TabsContent value="diff">
          <Card>
            <CardHeader>
              <CardTitle>Compare Runs</CardTitle>
              <CardDescription>
                See what changed between extraction runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              {runs.length < 2 ? (
                <p className="text-stone-500">
                  Need at least 2 runs to compare. Extract this person again to enable comparison.
                </p>
              ) : (
                <Button asChild variant="outline">
                  <Link href={`/app/source-docs/${personId}/diff`}>
                    <GitCompare className="w-4 h-4 mr-2" />
                    Compare Runs
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
