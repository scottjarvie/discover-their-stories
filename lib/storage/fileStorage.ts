/**
 * File Storage Utilities
 * 
 * Purpose: Manage local file storage for evidence packs and documents
 * 
 * Key Elements:
 * - Read/write JSON files
 * - Manage versioned runs
 * - List people and runs
 * - Path utilities
 * 
 * Dependencies:
 * - fs/promises
 * - path
 * - ./types
 * 
 * Last Updated: Initial setup
 */

import fs from "fs/promises";
import path from "path";
import { PersonMetadata, RunMetadata, LatestPointer } from "./types";

// Base data directory
const DATA_DIR = path.join(process.cwd(), "data", "source-docs", "people");

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch {
    // Directory might already exist
  }
}

/**
 * Get path to a person's directory
 */
export function getPersonDir(personId: string): string {
  return path.join(DATA_DIR, personId);
}

/**
 * Get path to a person's runs directory
 */
export function getRunsDir(personId: string): string {
  return path.join(getPersonDir(personId), "runs");
}

/**
 * Get path to a specific run
 */
export function getRunDir(personId: string, runId: string): string {
  return path.join(getRunsDir(personId), runId);
}

/**
 * List all people with stored data
 */
export async function listPeople(): Promise<PersonMetadata[]> {
  try {
    await ensureDir(DATA_DIR);
    const entries = await fs.readdir(DATA_DIR, { withFileTypes: true });
    const people: PersonMetadata[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const personPath = path.join(DATA_DIR, entry.name, "person.json");
        try {
          const content = await fs.readFile(personPath, "utf-8");
          people.push(JSON.parse(content));
        } catch {
          // Skip if person.json doesn't exist
        }
      }
    }

    return people.sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Get a person's metadata
 */
export async function getPerson(personId: string): Promise<PersonMetadata | null> {
  try {
    const personPath = path.join(getPersonDir(personId), "person.json");
    const content = await fs.readFile(personPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Save a person's metadata
 */
export async function savePerson(person: PersonMetadata): Promise<void> {
  const personDir = getPersonDir(person.familySearchId);
  await ensureDir(personDir);
  const personPath = path.join(personDir, "person.json");
  await fs.writeFile(personPath, JSON.stringify(person, null, 2));
}

/**
 * List runs for a person
 */
export async function listRuns(personId: string): Promise<RunMetadata[]> {
  try {
    const runsDir = getRunsDir(personId);
    await ensureDir(runsDir);
    const entries = await fs.readdir(runsDir, { withFileTypes: true });
    const runs: RunMetadata[] = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const packPath = path.join(runsDir, entry.name, "evidence-pack.json");
        try {
          const content = await fs.readFile(packPath, "utf-8");
          const pack = JSON.parse(content);
          runs.push({
            runId: pack.runId,
            capturedAt: pack.capturedAt,
            extractorVersion: pack.extractorVersion,
            mode: pack.diagnostics?.mode || "standard",
            totalSources: pack.sources?.length || 0,
            expandedSections: pack.diagnostics?.expandedSections || 0,
          });
        } catch {
          // Skip if evidence-pack.json doesn't exist
        }
      }
    }

    return runs.sort((a, b) => 
      new Date(b.capturedAt).getTime() - new Date(a.capturedAt).getTime()
    );
  } catch {
    return [];
  }
}

/**
 * Get the latest run pointer
 */
export async function getLatestRun(personId: string): Promise<LatestPointer | null> {
  try {
    const latestPath = path.join(getPersonDir(personId), "latest.json");
    const content = await fs.readFile(latestPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Set the latest run pointer
 */
export async function setLatestRun(personId: string, runId: string): Promise<void> {
  const latestPath = path.join(getPersonDir(personId), "latest.json");
  const pointer: LatestPointer = {
    runId,
    runPath: getRunDir(personId, runId),
  };
  await fs.writeFile(latestPath, JSON.stringify(pointer, null, 2));
}

/**
 * Save an evidence pack
 */
export async function saveEvidencePack(
  personId: string, 
  runId: string, 
  evidencePack: unknown
): Promise<string> {
  const runDir = getRunDir(personId, runId);
  await ensureDir(runDir);
  
  const packPath = path.join(runDir, "evidence-pack.json");
  await fs.writeFile(packPath, JSON.stringify(evidencePack, null, 2));
  
  return runDir;
}

/**
 * Get an evidence pack
 */
export async function getEvidencePack(personId: string, runId: string): Promise<unknown | null> {
  try {
    const packPath = path.join(getRunDir(personId, runId), "evidence-pack.json");
    const content = await fs.readFile(packPath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}

/**
 * Save a raw document
 */
export async function saveRawDocument(
  personId: string,
  runId: string,
  markdown: string
): Promise<void> {
  const runDir = getRunDir(personId, runId);
  await ensureDir(runDir);
  const docPath = path.join(runDir, "raw-document.md");
  await fs.writeFile(docPath, markdown);
}

/**
 * Get a raw document
 */
export async function getRawDocument(
  personId: string,
  runId: string
): Promise<string | null> {
  try {
    const docPath = path.join(getRunDir(personId, runId), "raw-document.md");
    return await fs.readFile(docPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Save a contextualized document
 */
export async function saveContextualizedDocument(
  personId: string,
  runId: string,
  markdown: string
): Promise<void> {
  const runDir = getRunDir(personId, runId);
  await ensureDir(runDir);
  const docPath = path.join(runDir, "contextualized.md");
  await fs.writeFile(docPath, markdown);
}

/**
 * Get a contextualized document
 */
export async function getContextualizedDocument(
  personId: string,
  runId: string
): Promise<string | null> {
  try {
    const docPath = path.join(getRunDir(personId, runId), "contextualized.md");
    return await fs.readFile(docPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * Save AI stage output
 */
export async function saveAIStageOutput(
  personId: string,
  runId: string,
  stage: string,
  filename: string,
  data: unknown
): Promise<void> {
  const stageDir = path.join(getRunDir(personId, runId), "ai-stages", stage);
  await ensureDir(stageDir);
  const filePath = path.join(stageDir, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

/**
 * Get AI stage output
 */
export async function getAIStageOutput(
  personId: string,
  runId: string,
  stage: string,
  filename: string
): Promise<unknown | null> {
  try {
    const filePath = path.join(
      getRunDir(personId, runId), 
      "ai-stages", 
      stage, 
      filename
    );
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return null;
  }
}
