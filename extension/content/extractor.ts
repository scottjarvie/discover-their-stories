/**
 * Content Script - Extractor
 * 
 * Purpose: Extract data from FamilySearch person/sources pages
 * 
 * Key Elements:
 * - DOM parsing for person info
 * - Source extraction
 * - Indexed information expansion
 * - Evidence Pack building
 * 
 * Dependencies:
 * - Chrome Extension APIs
 * - ../lib/evidencePack
 * 
 * Last Updated: Initial setup
 */

interface PacingConfig {
  expandDelay: number;
  actionDelay: number;
  maxExpansions: number;
}

interface PageInfo {
  personId: string;
  personName: string;
  birthDate?: string;
  deathDate?: string;
  sourceCount: number;
  onSourcesPage: boolean;
}

interface SourceData {
  id: string;
  orderIndex: number;
  title: string;
  date?: string;
  citation?: string;
  webPageUrl?: string;
  attachedBy?: string;
  attachedAt?: string;
  reasonAttached?: string;
  tags: string[];
  indexed: {
    fields: Array<{ label: string; value: string }>;
    textBlocks: string[];
  };
  rawText: string;
  expanded: boolean;
  expansionAttempts: number;
  expansionSucceeded: boolean;
}

let extractionCancelled = false;

// Message handler
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type) {
    case "GET_PAGE_INFO":
      sendResponse(getPageInfo());
      break;

    case "START_EXTRACT":
      extractionCancelled = false;
      startExtraction(message.pacing);
      sendResponse({ success: true });
      break;

    case "CANCEL_EXTRACT":
      extractionCancelled = true;
      sendResponse({ success: true });
      break;
  }

  return true;
});

/**
 * Get basic page info
 */
function getPageInfo(): PageInfo {
  const url = window.location.href;
  const personIdMatch = url.match(/\/tree\/person\/(?:sources\/)?([A-Z0-9-]+)/i);
  const personId = personIdMatch?.[1] || "";

  // Get person name from page header
  const nameEl = document.querySelector("h1, [data-testid='person-name']");
  const personName = nameEl?.textContent?.trim() || "";

  // Get dates
  const datesEl = document.querySelector("[data-testid='person-lifespan'], .person-lifespan");
  const datesText = datesEl?.textContent || "";
  const birthMatch = datesText.match(/(\d{1,2}\s+\w+\s+\d{4}|\d{4})\s*[–-]/);
  const deathMatch = datesText.match(/[–-]\s*(\d{1,2}\s+\w+\s+\d{4}|\d{4})/);

  // Count sources
  const sourceElements = document.querySelectorAll("[data-testid='source-item'], .source-item, [class*='source']");
  const sourceCount = sourceElements.length;

  return {
    personId,
    personName,
    birthDate: birthMatch?.[1],
    deathDate: deathMatch?.[1],
    sourceCount,
    onSourcesPage: url.includes("/sources"),
  };
}

/**
 * Start the extraction process
 */
async function startExtraction(pacing: PacingConfig) {
  const startTime = Date.now();
  const pageInfo = getPageInfo();

  try {
    // Report starting
    chrome.runtime.sendMessage({
      type: "UPDATE_PROGRESS",
      data: {
        status: "extracting",
        currentStep: 0,
        totalSteps: pageInfo.sourceCount,
      },
    });

    // Expand all sources first (click on them to show details)
    await expandAllSources(pacing);

    if (extractionCancelled) return;

    // Now expand indexed information sections
    const sources = await extractSources(pacing);

    if (extractionCancelled) return;

    // Build evidence pack
    const evidencePack = buildEvidencePack(pageInfo, sources, startTime, pacing);

    // Report complete
    chrome.runtime.sendMessage({
      type: "EXTRACTION_COMPLETE",
      data: evidencePack,
    });

  } catch (error) {
    chrome.runtime.sendMessage({
      type: "EXTRACTION_ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Expand all source cards to show their content
 */
async function expandAllSources(pacing: PacingConfig): Promise<void> {
  // Find all collapsed source headers that can be clicked
  const sourceHeaders = document.querySelectorAll(
    "[data-testid='source-header'], .source-header, [role='button'][aria-expanded='false']"
  );

  for (const header of Array.from(sourceHeaders)) {
    if (extractionCancelled) break;

    const clickable = header as HTMLElement;
    clickable.click();
    await sleep(pacing.actionDelay);
  }
}

/**
 * Extract all sources from the page
 */
async function extractSources(pacing: PacingConfig): Promise<SourceData[]> {
  const sources: SourceData[] = [];
  
  // Find all source containers
  const sourceContainers = document.querySelectorAll(
    "[data-testid='source-item'], .source-item, [class*='SourceCard']"
  );

  let expandedCount = 0;

  for (let i = 0; i < sourceContainers.length; i++) {
    if (extractionCancelled) break;

    const container = sourceContainers[i];
    const sourceId = `S${i + 1}`;

    // Report progress
    chrome.runtime.sendMessage({
      type: "UPDATE_PROGRESS",
      data: {
        status: "expanding",
        currentStep: i + 1,
        totalSteps: sourceContainers.length,
        currentSource: sourceId,
        expandedCount,
      },
    });

    // Extract basic info
    const source = await extractSourceData(container, sourceId, i, pacing);
    sources.push(source);

    if (source.expansionSucceeded) {
      expandedCount++;
    }

    // Check max expansions
    if (expandedCount >= pacing.maxExpansions) {
      console.log(`Reached max expansions limit: ${pacing.maxExpansions}`);
      break;
    }

    await sleep(pacing.expandDelay);
  }

  return sources;
}

/**
 * Extract data from a single source container
 */
async function extractSourceData(
  container: Element,
  sourceId: string,
  orderIndex: number,
  pacing: PacingConfig
): Promise<SourceData> {
  const source: SourceData = {
    id: sourceId,
    orderIndex,
    title: "",
    tags: [],
    indexed: { fields: [], textBlocks: [] },
    rawText: "",
    expanded: false,
    expansionAttempts: 0,
    expansionSucceeded: false,
  };

  // Title
  const titleEl = container.querySelector(
    "[data-testid='source-title'], .source-title, h3, h4"
  );
  source.title = titleEl?.textContent?.trim() || "Untitled Source";

  // Date
  const dateEl = container.querySelector(
    "[data-testid='source-date'], .source-date, [class*='date']"
  );
  source.date = dateEl?.textContent?.trim();

  // Citation
  const citationEl = container.querySelector(
    "[data-testid='citation'], .citation, [class*='citation']"
  );
  source.citation = citationEl?.textContent?.trim();

  // Web page URL
  const linkEl = container.querySelector("a[href*='ark:']") as HTMLAnchorElement;
  source.webPageUrl = linkEl?.href;

  // Attached by / date
  const attachedEl = container.querySelector(
    "[data-testid='attached-by'], .attached-by, [class*='contributor']"
  );
  if (attachedEl) {
    const text = attachedEl.textContent || "";
    const match = text.match(/(.+?)\s+on\s+(.+)/i);
    if (match) {
      source.attachedBy = match[1].trim();
      source.attachedAt = match[2].trim();
    } else {
      source.attachedBy = text.trim();
    }
  }

  // Reason attached
  const reasonEl = container.querySelector(
    "[data-testid='reason'], .reason, [class*='reason']"
  );
  source.reasonAttached = reasonEl?.textContent?.trim();

  // Tags
  const tagEls = container.querySelectorAll(
    "[data-testid='tag'], .tag, [class*='Tag'], .badge"
  );
  source.tags = Array.from(tagEls).map((el) => el.textContent?.trim() || "");

  // Try to expand indexed information
  const showButton = container.querySelector(
    "button:contains('SHOW'), [data-testid='show-indexed'], .show-indexed, button[class*='show']"
  ) || Array.from(container.querySelectorAll("button, [role='button']"))
    .find((el) => el.textContent?.toLowerCase().includes("show"));

  if (showButton) {
    source.expansionAttempts++;
    (showButton as HTMLElement).click();
    await sleep(pacing.actionDelay);
    source.expanded = true;
    source.expansionSucceeded = true;
  }

  // Extract indexed information
  const indexedContainer = container.querySelector(
    "[data-testid='indexed-info'], .indexed-info, [class*='indexed'], table"
  );

  if (indexedContainer) {
    // Look for label-value pairs
    const rows = indexedContainer.querySelectorAll("tr, [class*='row'], [class*='field']");
    for (const row of Array.from(rows)) {
      const cells = row.querySelectorAll("td, th, [class*='label'], [class*='value']");
      if (cells.length >= 2) {
        source.indexed.fields.push({
          label: cells[0].textContent?.trim() || "",
          value: cells[1].textContent?.trim() || "",
        });
      }
    }

    // Also capture any text blocks
    const textBlocks = indexedContainer.querySelectorAll("p, [class*='text']");
    for (const block of Array.from(textBlocks)) {
      const text = block.textContent?.trim();
      if (text) {
        source.indexed.textBlocks.push(text);
      }
    }
  }

  // Raw text extraction
  source.rawText = container.textContent?.trim() || "";

  return source;
}

/**
 * Build the final evidence pack
 */
function buildEvidencePack(
  pageInfo: PageInfo,
  sources: SourceData[],
  startTime: number,
  _pacing: PacingConfig
) {
  const endTime = Date.now();

  return {
    schemaVersion: "1.0",
    runId: crypto.randomUUID(),
    capturedAt: new Date().toISOString(),
    extractorVersion: "1.0.0",
    extractionDurationMs: endTime - startTime,

    sourceUrl: window.location.href,
    pageTitle: document.title,
    uiLocale: document.documentElement.lang || "en",

    person: {
      familySearchId: pageInfo.personId,
      name: pageInfo.personName,
      birthDate: pageInfo.birthDate,
      deathDate: pageInfo.deathDate,
    },

    sources: sources.map((s) => ({
      ...s,
      sourceKey: generateSourceKey(s),
      sourceType: inferSourceType(s),
    })),

    diagnostics: {
      mode: "standard",
      totalSources: sources.length,
      expandedSections: sources.filter((s) => s.expansionSucceeded).length,
      failedExpansions: sources.filter((s) => s.expansionAttempts > 0 && !s.expansionSucceeded).length,
      warnings: [],
      errors: [],
    },
  };
}

/**
 * Generate a source key hash
 */
function generateSourceKey(source: SourceData): string {
  const input = [
    source.citation || "",
    source.webPageUrl || "",
    source.title || "",
  ].join("|");

  // Simple hash function for browser
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(16, "0").slice(0, 16);
}

/**
 * Infer source type from content
 */
function inferSourceType(source: SourceData): string {
  const text = (source.title + " " + source.citation).toLowerCase();
  
  if (text.includes("census")) return "record";
  if (text.includes("birth")) return "record";
  if (text.includes("death")) return "record";
  if (text.includes("marriage")) return "record";
  if (text.includes("memory") || text.includes("memories")) return "memory";
  if (text.includes("story") || text.includes("stories")) return "story";
  if (text.includes("photo") || text.includes("image")) return "photo";
  
  return "other";
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("Discover Their Stories Content Script loaded");
