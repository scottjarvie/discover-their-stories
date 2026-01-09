/**
 * ImportResultsDialog Component
 * 
 * Purpose: Import AI results from external processing
 * 
 * Key Elements:
 * - JSON input
 * - Validation
 * - Save to storage
 * 
 * Dependencies:
 * - @/components/ui/*
 * - @/features/source-docs/lib/schemas
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
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Check, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  NormalizedSourceSchema,
  ClusterSchema,
  SynthesisSchema,
} from "../lib/schemas";
import { z } from "zod";

interface ImportResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage: "normalize" | "cluster" | "synthesize";
  onImport: (data: unknown) => void;
}

export function ImportResultsDialog({
  open,
  onOpenChange,
  stage,
  onImport,
}: ImportResultsDialogProps) {
  const [jsonInput, setJsonInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const stageLabels = {
    normalize: "Normalized Sources",
    cluster: "Cluster Results",
    synthesize: "Synthesis Results",
  };

  const validateJson = () => {
    setValidationError(null);
    setIsValid(null);

    if (!jsonInput.trim()) {
      setValidationError("Please paste JSON data");
      return false;
    }

    try {
      const parsed = JSON.parse(jsonInput);

      // Validate based on stage
      let schema: z.ZodType;
      switch (stage) {
        case "normalize":
          schema = z.array(NormalizedSourceSchema);
          break;
        case "cluster":
          schema = ClusterSchema;
          break;
        case "synthesize":
          schema = SynthesisSchema;
          break;
      }

      const result = schema.safeParse(parsed);
      
      if (!result.success) {
        setValidationError(
          `Validation failed: ${result.error.issues.map(e => e.message).join(", ")}`
        );
        setIsValid(false);
        return false;
      }

      setIsValid(true);
      return true;

    } catch (error) {
      if (error instanceof SyntaxError) {
        setValidationError("Invalid JSON syntax");
      } else {
        setValidationError("Validation failed");
      }
      setIsValid(false);
      return false;
    }
  };

  const handleImport = () => {
    if (!validateJson()) return;

    try {
      const parsed = JSON.parse(jsonInput);
      onImport(parsed);
      toast.success("Results imported successfully");
      onOpenChange(false);
      setJsonInput("");
      setIsValid(null);
    } catch {
      toast.error("Failed to import results");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import {stageLabels[stage]}</DialogTitle>
          <DialogDescription>
            Paste the JSON response from your external AI tool
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Textarea
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setIsValid(null);
              setValidationError(null);
            }}
            placeholder="Paste JSON here..."
            className="min-h-[300px] font-mono text-sm"
          />

          {validationError && (
            <div className="flex items-start gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {isValid && (
            <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg">
              <Check className="w-4 h-4" />
              <span>JSON is valid and matches expected schema</span>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => validateJson()}>
              Validate
            </Button>
            <Button
              onClick={handleImport}
              disabled={!jsonInput.trim()}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Results
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
