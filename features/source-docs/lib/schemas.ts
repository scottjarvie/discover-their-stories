/**
 * Source Docs Schemas
 * 
 * Purpose: Zod schemas for Evidence Pack and AI stage outputs
 * 
 * Key Elements:
 * - EvidencePack schema
 * - NormalizedSource schema
 * - Cluster schema
 * - Synthesis schema
 * 
 * Dependencies:
 * - zod
 * 
 * Last Updated: Initial setup
 */

import { z } from "zod";

// Source schema
export const SourceSchema = z.object({
  id: z.string(),
  orderIndex: z.number(),
  sourceKey: z.string(),
  sourceType: z.enum(["record", "memory", "story", "photo", "other"]),
  
  title: z.string(),
  date: z.string().optional(),
  citation: z.string().optional(),
  webPageUrl: z.string().optional(),
  attachedBy: z.string().optional(),
  attachedAt: z.string().optional(),
  reasonAttached: z.string().optional(),
  tags: z.array(z.string()),
  
  indexed: z.object({
    fields: z.array(z.object({
      label: z.string(),
      labelRaw: z.string().optional(),
      value: z.string(),
    })),
    textBlocks: z.array(z.string()),
  }),
  rawText: z.string(),
  
  expanded: z.boolean(),
  expansionAttempts: z.number(),
  expansionSucceeded: z.boolean(),
});

// Warning schema
export const WarningSchema = z.object({
  code: z.enum(["VIRTUALIZED_LIST", "EXPAND_TIMEOUT", "MISSING_FIELD", "RATE_LIMITED"]),
  message: z.string(),
  sourceId: z.string().optional(),
});

// Error schema
export const ExtractorErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  fatal: z.boolean(),
});

// Evidence Pack schema
export const EvidencePackSchema = z.object({
  schemaVersion: z.literal("1.0"),
  runId: z.string(),
  capturedAt: z.string(),
  extractorVersion: z.string(),
  extractionDurationMs: z.number(),
  
  sourceUrl: z.string(),
  pageTitle: z.string(),
  uiLocale: z.string(),
  
  person: z.object({
    familySearchId: z.string(),
    name: z.string(),
    birthDate: z.string().optional(),
    deathDate: z.string().optional(),
  }),
  
  sources: z.array(SourceSchema),
  
  diagnostics: z.object({
    mode: z.enum(["standard", "admin"]),
    totalSources: z.number(),
    expandedSections: z.number(),
    failedExpansions: z.number(),
    warnings: z.array(WarningSchema),
    errors: z.array(ExtractorErrorSchema),
  }),
});

// Stage A: Normalized Source schema
export const NormalizedSourceSchema = z.object({
  sourceId: z.string(),
  summary: z.string(),
  entities: z.array(z.object({
    name: z.string(),
    type: z.enum(["person", "place", "organization"]),
    role: z.string().optional(),
  })),
  dates: z.array(z.object({
    date: z.string(),
    type: z.string(),
    precision: z.enum(["exact", "estimated", "range"]),
  })),
  places: z.array(z.object({
    name: z.string(),
    type: z.string(),
  })),
  relationships: z.array(z.object({
    person1: z.string(),
    person2: z.string(),
    type: z.string(),
  })),
  claims: z.array(z.string()),
  confidence: z.enum(["high", "medium", "low"]),
});

// Stage B: Cluster schema
export const ClusterSchema = z.object({
  clusters: z.array(z.object({
    id: z.string(),
    type: z.enum(["same_record", "same_event", "overlapping_info", "related"]),
    sourceIds: z.array(z.string()),
    reason: z.string(),
    primarySourceId: z.string(),
  })),
  standalone: z.array(z.string()),
});

// Stage C: Synthesis schema
export const SynthesisSchema = z.object({
  summary: z.string(),
  verifiedFacts: z.array(z.object({
    fact: z.string(),
    sourceIds: z.array(z.string()),
    confidence: z.enum(["high", "medium", "low"]),
  })),
  conflicts: z.array(z.object({
    description: z.string(),
    positions: z.array(z.object({
      claim: z.string(),
      sourceIds: z.array(z.string()),
    })),
  })),
  timeline: z.array(z.object({
    date: z.string(),
    event: z.string(),
    sourceIds: z.array(z.string()),
  })),
  researchSuggestions: z.array(z.string()),
});

// Type exports
export type EvidencePack = z.infer<typeof EvidencePackSchema>;
export type Source = z.infer<typeof SourceSchema>;
export type NormalizedSource = z.infer<typeof NormalizedSourceSchema>;
export type Cluster = z.infer<typeof ClusterSchema>;
export type Synthesis = z.infer<typeof SynthesisSchema>;
