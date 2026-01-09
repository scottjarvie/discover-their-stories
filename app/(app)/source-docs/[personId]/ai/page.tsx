/**
 * AI Processing Page
 * 
 * Purpose: Run staged AI analysis on evidence pack
 * 
 * Key Elements:
 * - Redaction preview
 * - Stage controls (normalize, cluster, synthesize)
 * - Export/Import workflow
 * - Results display
 * 
 * Dependencies:
 * - @/components/ui/*
 * - @/features/source-docs/lib/*
 * - @/lib/ai/*
 * 
 * Last Updated: Initial setup
 */

"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Brain,
  Shield,
  Upload,
  Download,
  Play,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { EvidencePack } from "@/features/source-docs/lib/schemas";
import { redactEvidencePack, getRedactionSummary } from "@/features/source-docs/lib/redactor";
import { ExportPromptDialog } from "@/features/source-docs/components/ExportPromptDialog";
import { ImportResultsDialog } from "@/features/source-docs/components/ImportResultsDialog";

interface PageProps {
  params: Promise<{ personId: string }>;
}

type Stage = "normalize" | "cluster" | "synthesize";

interface StageStatus {
  status: "pending" | "processing" | "complete" | "error";
  data?: unknown;
  error?: string;
}

export default function AIProcessingPage({ params }: PageProps) {
  const { personId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const runId = searchParams.get("run");

  const [loading, setLoading] = useState(true);
  const [evidencePack, setEvidencePack] = useState<EvidencePack | null>(null);
  const [redactedPack, setRedactedPack] = useState<EvidencePack | null>(null);
  const [redactionSummary, setRedactionSummary] = useState<string>("");
  const [hasLivingIndicators, setHasLivingIndicators] = useState(false);
  const [personName, setPersonName] = useState<string>("");
  const [useRedacted, setUseRedacted] = useState(true);

  const [stages, setStages] = useState<Record<Stage, StageStatus>>({
    normalize: { status: "pending" },
    cluster: { status: "pending" },
    synthesize: { status: "pending" },
  });

  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [currentStage, setCurrentStage] = useState<Stage>("normalize");

  useEffect(() => {
    async function fetchData() {
      try {
        const personResponse = await fetch(`/api/people/${personId}`);
        const personData = await personResponse.json();
        
        if (!personData.success) {
          router.push("/app/source-docs");
          return;
        }

        setPersonName(personData.person.name || personId);
        const targetRunId = runId || personData.latestRunId;

        if (!targetRunId) {
          setLoading(false);
          return;
        }

        // Fetch raw document which will give us the evidence pack path
        const rawResponse = await fetch(`/api/people/${personId}/raw?run=${targetRunId}`);
        
        if (!rawResponse.ok) {
          setLoading(false);
          return;
        }

        // For now, create a mock evidence pack from the API data
        // In a real implementation, we'd fetch the actual evidence pack
        const mockPack: EvidencePack = {
          schemaVersion: "1.0",
          runId: targetRunId,
          capturedAt: new Date().toISOString(),
          extractorVersion: "1.0.0",
          extractionDurationMs: 0,
          sourceUrl: "",
          pageTitle: "",
          uiLocale: "en",
          person: {
            familySearchId: personId,
            name: personData.person.name,
            birthDate: personData.person.birthDate,
            deathDate: personData.person.deathDate,
          },
          sources: [],
          diagnostics: {
            mode: "standard",
            totalSources: 0,
            expandedSections: 0,
            failedExpansions: 0,
            warnings: [],
            errors: [],
          },
        };

        setEvidencePack(mockPack);

        // Apply redaction
        const { redactedPack, redactions, hasLivingIndicators: hasLiving } = 
          redactEvidencePack(mockPack);
        
        setRedactedPack(redactedPack);
        setRedactionSummary(getRedactionSummary(redactions));
        setHasLivingIndicators(hasLiving);

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [personId, runId, router]);

  const handleExport = (stage: Stage) => {
    setCurrentStage(stage);
    setExportDialogOpen(true);
  };

  const handleImport = (stage: Stage) => {
    setCurrentStage(stage);
    setImportDialogOpen(true);
  };

  const handleImportComplete = (data: unknown) => {
    setStages((prev) => ({
      ...prev,
      [currentStage]: { status: "complete", data },
    }));
  };

  const runStage = async (stage: Stage) => {
    // Check if API key is set
    const settings = localStorage.getItem("telltheirstories-settings");
    const parsedSettings = settings ? JSON.parse(settings) : {};
    
    if (!parsedSettings.openRouterApiKey) {
      toast.error("Please set your OpenRouter API key in Settings");
      return;
    }

    setStages((prev) => ({
      ...prev,
      [stage]: { status: "processing" },
    }));

    try {
      // This would call the AI API route
      toast.info(`Processing ${stage} stage...`);
      
      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      setStages((prev) => ({
        ...prev,
        [stage]: { status: "complete", data: {} },
      }));
      
      toast.success(`${stage} stage complete!`);
    } catch (error) {
      setStages((prev) => ({
        ...prev,
        [stage]: { 
          status: "error", 
          error: error instanceof Error ? error.message : "Processing failed",
        },
      }));
      toast.error(`${stage} stage failed`);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-stone-400">
        Loading...
      </div>
    );
  }

  const pack = useRedacted ? redactedPack : evidencePack;

  return (
    <div className="p-8">
      {/* Header */}
      <Link 
        href={`/app/source-docs/${personId}`}
        className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {personName}
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-amber-700" />
            AI Analysis
          </h1>
          <p className="text-stone-500 mt-1">
            Run staged AI processing on the evidence
          </p>
        </div>
      </div>

      {/* Redaction Warning */}
      {hasLivingIndicators && (
        <Card className="mb-6 border-orange-300 bg-orange-50">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-orange-900">Living Person Indicators Detected</h3>
                <p className="text-sm text-orange-700 mt-1">
                  This data may contain information about living people. 
                  Redaction is strongly recommended before AI processing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Privacy Controls */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-700" />
              <CardTitle className="text-lg">Privacy Controls</CardTitle>
            </div>
            <Badge variant={useRedacted ? "default" : "secondary"}>
              {useRedacted ? "Redacted" : "Original"}
            </Badge>
          </div>
          <CardDescription>
            {redactionSummary}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={useRedacted ? "default" : "outline"}
              onClick={() => setUseRedacted(true)}
              className={useRedacted ? "bg-amber-700 hover:bg-amber-800" : ""}
            >
              <Shield className="w-4 h-4 mr-2" />
              Use Redacted Data
            </Button>
            <Button
              variant={!useRedacted ? "default" : "outline"}
              onClick={() => setUseRedacted(false)}
            >
              Use Original Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Processing Stages */}
      <Tabs defaultValue="normalize" className="space-y-6">
        <TabsList>
          <TabsTrigger value="normalize" className="flex items-center gap-2">
            Stage 1: Normalize
            {stages.normalize.status === "complete" && <Check className="w-4 h-4 text-green-600" />}
          </TabsTrigger>
          <TabsTrigger value="cluster" className="flex items-center gap-2">
            Stage 2: Cluster
            {stages.cluster.status === "complete" && <Check className="w-4 h-4 text-green-600" />}
          </TabsTrigger>
          <TabsTrigger value="synthesize" className="flex items-center gap-2">
            Stage 3: Synthesize
            {stages.synthesize.status === "complete" && <Check className="w-4 h-4 text-green-600" />}
          </TabsTrigger>
        </TabsList>

        {/* Normalize Stage */}
        <TabsContent value="normalize">
          <Card>
            <CardHeader>
              <CardTitle>Stage 1: Normalize Sources</CardTitle>
              <CardDescription>
                Extract and normalize information from each source individually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <Button
                  onClick={() => runStage("normalize")}
                  disabled={stages.normalize.status === "processing"}
                  className="bg-amber-700 hover:bg-amber-800"
                >
                  {stages.normalize.status === "processing" ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  Run with OpenRouter
                </Button>
                <Button variant="outline" onClick={() => handleExport("normalize")}>
                  <Download className="w-4 h-4 mr-2" />
                  Export Prompt
                </Button>
                <Button variant="outline" onClick={() => handleImport("normalize")}>
                  <Upload className="w-4 h-4 mr-2" />
                  Import Results
                </Button>
              </div>

              {stages.normalize.status === "complete" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Normalization complete</span>
                  </div>
                </div>
              )}

              {stages.normalize.status === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    <span>{stages.normalize.error}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cluster Stage */}
        <TabsContent value="cluster">
          <Card>
            <CardHeader>
              <CardTitle>Stage 2: Cluster & Deduplicate</CardTitle>
              <CardDescription>
                Identify related sources and group duplicates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.normalize.status !== "complete" ? (
                <p className="text-stone-500">
                  Complete Stage 1 (Normalize) first
                </p>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={() => runStage("cluster")}
                    disabled={stages.cluster.status === "processing"}
                    className="bg-amber-700 hover:bg-amber-800"
                  >
                    {stages.cluster.status === "processing" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run with OpenRouter
                  </Button>
                  <Button variant="outline" onClick={() => handleExport("cluster")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Prompt
                  </Button>
                  <Button variant="outline" onClick={() => handleImport("cluster")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Results
                  </Button>
                </div>
              )}

              {stages.cluster.status === "complete" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Clustering complete</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Synthesize Stage */}
        <TabsContent value="synthesize">
          <Card>
            <CardHeader>
              <CardTitle>Stage 3: Synthesize Dossier</CardTitle>
              <CardDescription>
                Create the contextualized research dossier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stages.cluster.status !== "complete" ? (
                <p className="text-stone-500">
                  Complete Stage 2 (Cluster) first
                </p>
              ) : (
                <div className="flex gap-4">
                  <Button
                    onClick={() => runStage("synthesize")}
                    disabled={stages.synthesize.status === "processing"}
                    className="bg-amber-700 hover:bg-amber-800"
                  >
                    {stages.synthesize.status === "processing" ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="w-4 h-4 mr-2" />
                    )}
                    Run with OpenRouter
                  </Button>
                  <Button variant="outline" onClick={() => handleExport("synthesize")}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Prompt
                  </Button>
                  <Button variant="outline" onClick={() => handleImport("synthesize")}>
                    <Upload className="w-4 h-4 mr-2" />
                    Import Results
                  </Button>
                </div>
              )}

              {stages.synthesize.status === "complete" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-green-700">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">Synthesis complete - Dossier ready!</span>
                  </div>
                  <Button asChild className="mt-4">
                    <Link href={`/app/source-docs/${personId}?tab=contextualized`}>
                      View Contextualized Dossier
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <ExportPromptDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        evidencePack={pack}
        stage={currentStage}
        stageData={stages[currentStage].data}
      />

      <ImportResultsDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        stage={currentStage}
        onImport={handleImportComplete}
      />
    </div>
  );
}
