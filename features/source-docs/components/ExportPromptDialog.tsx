/**
 * ExportPromptDialog Component
 * 
 * Purpose: Generate and export prompts for external AI processing
 * 
 * Key Elements:
 * - Stage selection
 * - Prompt preview
 * - Copy and download options
 * 
 * Dependencies:
 * - @/components/ui/*
 * - @/lib/ai/promptBuilder
 * 
 * Last Updated: Initial setup
 */

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Download, Check } from "lucide-react";
import { toast } from "sonner";
import { buildExportPrompt } from "@/lib/ai/promptBuilder";
import type { EvidencePack } from "../lib/schemas";

interface ExportPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evidencePack: EvidencePack | null;
  stage: "normalize" | "cluster" | "synthesize";
  stageData?: unknown;
}

export function ExportPromptDialog({
  open,
  onOpenChange,
  evidencePack,
  stage,
  stageData,
}: ExportPromptDialogProps) {
  const [copied, setCopied] = useState(false);

  if (!evidencePack) return null;

  // Prepare data based on stage
  let exportData: unknown;
  switch (stage) {
    case "normalize":
      exportData = evidencePack.sources;
      break;
    case "cluster":
      exportData = stageData || [];
      break;
    case "synthesize":
      exportData = {
        person: evidencePack.person,
        normalizedSources: stageData,
      };
      break;
  }

  const prompt = buildExportPrompt(stage, exportData);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([prompt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${stage}-prompt-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded prompt file");
  };

  const stageLabels = {
    normalize: "Normalize Sources",
    cluster: "Cluster/Dedupe",
    synthesize: "Synthesize Dossier",
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Export Prompt for External AI</DialogTitle>
          <DialogDescription>
            Copy this prompt and paste it into your preferred AI tool (ChatGPT, Claude, etc.)
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="prompt" className="mt-4">
          <TabsList>
            <TabsTrigger value="prompt">Prompt</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>

          <TabsContent value="prompt" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-700">
                  Stage: {stageLabels[stage]}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <Textarea
                value={prompt}
                readOnly
                className="min-h-[400px] font-mono text-sm"
              />
            </div>
          </TabsContent>

          <TabsContent value="instructions" className="mt-4">
            <div className="prose prose-sm max-w-none">
              <h3>How to use this prompt</h3>
              <ol>
                <li>Copy the prompt using the Copy button</li>
                <li>Open your preferred AI tool (ChatGPT, Claude, Gemini, etc.)</li>
                <li>Paste the prompt and send it</li>
                <li>Wait for the AI to generate a JSON response</li>
                <li>Copy the JSON response</li>
                <li>Come back here and use the Import function</li>
              </ol>

              <h3>Tips for best results</h3>
              <ul>
                <li>Use a capable model (GPT-4, Claude Sonnet/Opus, etc.)</li>
                <li>For complex genealogies, consider using o1 or similar reasoning models</li>
                <li>If the response is truncated, ask the AI to continue</li>
                <li>Validate that the response is valid JSON before importing</li>
              </ul>

              <h3>Expected output format</h3>
              <p>The AI should respond with valid JSON matching the schema specified in the prompt.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
