/**
 * Storage Types
 * 
 * Purpose: Type definitions for local file storage system
 * 
 * Key Elements:
 * - Person metadata types
 * - Run metadata types
 * - Storage paths and structures
 * 
 * Dependencies: None
 * 
 * Last Updated: Initial setup
 */

export interface PersonMetadata {
  familySearchId: string;
  name: string;
  birthDate?: string;
  deathDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RunMetadata {
  runId: string;
  capturedAt: string;
  extractorVersion: string;
  mode: "standard" | "admin";
  totalSources: number;
  expandedSections: number;
}

export interface LatestPointer {
  runId: string;
  runPath: string;
}

export interface StoragePaths {
  people: string;
  getPerson: (personId: string) => string;
  getPersonRuns: (personId: string) => string;
  getRun: (personId: string, runId: string) => string;
}
