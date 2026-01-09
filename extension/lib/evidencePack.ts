/**
 * Evidence Pack Types and Utilities
 * 
 * Purpose: Type definitions and utilities for Evidence Pack JSON structure
 * 
 * Key Elements:
 * - EvidencePack interface
 * - Source interface
 * - Validation utilities
 * 
 * Dependencies: None
 * 
 * Last Updated: Initial setup
 */

export interface EvidencePack {
  // Metadata
  schemaVersion: "1.0";
  runId: string;
  capturedAt: string;
  extractorVersion: string;
  extractionDurationMs: number;

  // Page context
  sourceUrl: string;
  pageTitle: string;
  uiLocale: string;

  // Person
  person: {
    familySearchId: string;
    name: string;
    birthDate?: string;
    deathDate?: string;
  };

  // Sources
  sources: Source[];

  // Diagnostics
  diagnostics: {
    mode: "standard" | "admin";
    totalSources: number;
    expandedSections: number;
    failedExpansions: number;
    warnings: Warning[];
    errors: ExtractorError[];
  };
}

export interface Source {
  // Identification
  id: string;
  orderIndex: number;
  sourceKey: string;
  sourceType: "record" | "memory" | "story" | "photo" | "other";

  // Core data
  title: string;
  date?: string;
  citation?: string;
  webPageUrl?: string;
  attachedBy?: string;
  attachedAt?: string;
  reasonAttached?: string;
  tags: string[];

  // Indexed information
  indexed: {
    fields: Array<{
      label: string;
      labelRaw?: string;
      value: string;
    }>;
    textBlocks: string[];
  };
  rawText: string;

  // Expansion tracking
  expanded: boolean;
  expansionAttempts: number;
  expansionSucceeded: boolean;
}

export interface Warning {
  code: "VIRTUALIZED_LIST" | "EXPAND_TIMEOUT" | "MISSING_FIELD" | "RATE_LIMITED";
  message: string;
  sourceId?: string;
}

export interface ExtractorError {
  code: string;
  message: string;
  fatal: boolean;
}

/**
 * Validate an evidence pack structure
 */
export function validateEvidencePack(data: unknown): data is EvidencePack {
  if (!data || typeof data !== "object") return false;

  const pack = data as Record<string, unknown>;

  // Check required fields
  if (pack.schemaVersion !== "1.0") return false;
  if (typeof pack.runId !== "string") return false;
  if (typeof pack.capturedAt !== "string") return false;
  if (!pack.person || typeof pack.person !== "object") return false;
  if (!Array.isArray(pack.sources)) return false;

  return true;
}

/**
 * Create an empty evidence pack template
 */
export function createEmptyEvidencePack(): EvidencePack {
  return {
    schemaVersion: "1.0",
    runId: "",
    capturedAt: new Date().toISOString(),
    extractorVersion: "1.0.0",
    extractionDurationMs: 0,
    sourceUrl: "",
    pageTitle: "",
    uiLocale: "en",
    person: {
      familySearchId: "",
      name: "",
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
}
