/**
 * Source Docs Page
 * 
 * Purpose: List all imported people and provide import functionality
 * 
 * Key Elements:
 * - Import dialog
 * - People list with cards
 * - Quick actions
 * 
 * Dependencies:
 * - @/components/ui/*
 * - @/features/source-docs/components/PersonCard
 * 
 * Last Updated: Initial setup
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { PersonCard } from "@/features/source-docs/components/PersonCard";
import { Upload, FileText, Users } from "lucide-react";
import { toast } from "sonner";
import { PersonMetadata } from "@/lib/storage/types";

export default function SourceDocsPage() {
  const [people, setPeople] = useState<PersonMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importJson, setImportJson] = useState("");
  const [importing, setImporting] = useState(false);

  const fetchPeople = useCallback(async () => {
    try {
      const response = await fetch("/api/people");
      const data = await response.json();
      if (data.success) {
        setPeople(data.people);
      }
    } catch (error) {
      console.error("Failed to fetch people:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const handleImport = async () => {
    if (!importJson.trim()) {
      toast.error("Please paste Evidence Pack JSON");
      return;
    }

    setImporting(true);

    try {
      const parsed = JSON.parse(importJson);
      
      const response = await fetch("/api/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Imported ${data.sourceCount} sources for ${parsed.person?.name || "person"}`);
        setImportDialogOpen(false);
        setImportJson("");
        fetchPeople();
      } else {
        toast.error(data.error || "Failed to import");
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        toast.error("Invalid JSON format");
      } else {
        toast.error("Failed to import Evidence Pack");
      }
    } finally {
      setImporting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setImportJson(content);
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">
            Source Documentation
          </h1>
          <p className="text-stone-500">
            Import and manage FamilySearch source documentation
          </p>
        </div>
        <Button 
          onClick={() => setImportDialogOpen(true)}
          className="bg-amber-700 hover:bg-amber-800"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Evidence Pack
        </Button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12 text-stone-400">
          Loading...
        </div>
      ) : people.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Users className="w-12 h-12 text-stone-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-stone-900 mb-2">
              No people imported yet
            </h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              Use the browser extension to extract sources from FamilySearch, 
              then import the Evidence Pack JSON here.
            </p>
            <Button 
              onClick={() => setImportDialogOpen(true)}
              className="bg-amber-700 hover:bg-amber-800"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Evidence Pack
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((person) => (
            <PersonCard key={person.familySearchId} person={person} />
          ))}
        </div>
      )}

      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-700" />
              Import Evidence Pack
            </DialogTitle>
            <DialogDescription>
              Paste the JSON from your browser extension export, or upload a file.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Upload JSON File
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="block w-full text-sm text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-amber-100 file:text-amber-700 hover:file:bg-amber-200"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-stone-400">Or paste JSON</span>
              </div>
            </div>

            {/* JSON Textarea */}
            <Textarea
              value={importJson}
              onChange={(e) => setImportJson(e.target.value)}
              placeholder='{"schemaVersion": "1.0", ...}'
              className="min-h-[200px] font-mono text-sm"
            />

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setImportDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleImport}
                disabled={importing || !importJson.trim()}
                className="bg-amber-700 hover:bg-amber-800"
              >
                {importing ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
