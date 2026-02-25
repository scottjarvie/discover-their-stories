/**
 * Content Script - Extractor
 * Extracts data from FamilySearch person/sources pages
 */

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
function getPageInfo() {
  const url = window.location.href;
  const personIdMatch = url.match(/\/tree\/person\/(?:sources\/)?([A-Z0-9-]+)/i);
  const personId = personIdMatch?.[1] || "";

  // Get person name from page header
  const nameEl = document.querySelector("h1, [data-testid='person-name'], .person-name");
  const personName = nameEl?.textContent?.trim() || "";

  // Get dates
  const datesEl = document.querySelector("[data-testid='person-lifespan'], .person-lifespan, .lifespan");
  const datesText = datesEl?.textContent || "";
  const birthMatch = datesText.match(/(\d{1,2}\s+\w+\s+\d{4}|\d{4})\s*[–-]/);
  const deathMatch = datesText.match(/[–-]\s*(\d{1,2}\s+\w+\s+\d{4}|\d{4})/);

  // Count sources - try multiple selectors
  let sourceElements = document.querySelectorAll("[data-testid='source-card']");
  if (sourceElements.length === 0) {
    sourceElements = document.querySelectorAll(".source-card, .sourceCard");
  }
  if (sourceElements.length === 0) {
    sourceElements = document.querySelectorAll("[class*='SourceCard']");
  }
  if (sourceElements.length === 0) {
    // Fallback: count items in the sources list
    sourceElements = document.querySelectorAll("article, [role='article']");
  }

  return {
    personId,
    personName,
    birthDate: birthMatch?.[1],
    deathDate: deathMatch?.[1],
    sourceCount: sourceElements.length,
    onSourcesPage: url.includes("/sources"),
  };
}

/**
 * Start the extraction process
 */
async function startExtraction(pacing) {
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

    // Find all source containers
    let sourceContainers = document.querySelectorAll("[data-testid='source-card']");
    if (sourceContainers.length === 0) {
      sourceContainers = document.querySelectorAll(".source-card, .sourceCard, [class*='SourceCard']");
    }
    if (sourceContainers.length === 0) {
      sourceContainers = document.querySelectorAll("article, [role='article']");
    }

    const sources = [];
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

      // Extract source data
      const source = await extractSourceData(container, sourceId, i, pacing);
      sources.push(source);

      if (source.expansionSucceeded) {
        expandedCount++;
      }

      // Check max expansions
      if (pacing.maxExpansions && expandedCount >= pacing.maxExpansions) {
        console.log(`Reached max expansions limit: ${pacing.maxExpansions}`);
        break;
      }

      // Delay between sources
      await sleep(pacing.expandDelay || 500);
    }

    if (extractionCancelled) return;

    // Build evidence pack
    const evidencePack = buildEvidencePack(pageInfo, sources, startTime, pacing);

    // Report complete
    chrome.runtime.sendMessage({
      type: "EXTRACTION_COMPLETE",
      data: evidencePack,
    });

  } catch (error) {
    console.error("Extraction error:", error);
    chrome.runtime.sendMessage({
      type: "EXTRACTION_ERROR",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

/**
 * Extract data from a single source container
 */
async function extractSourceData(container, sourceId, orderIndex, pacing) {
  const source = {
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

  // Title - try multiple selectors
  const titleEl = container.querySelector(
    "[data-testid='source-title'], .source-title, h3, h4, [class*='title']"
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
  const linkEl = container.querySelector("a[href*='ark:'], a[href*='/record/']");
  source.webPageUrl = linkEl?.href;

  // Attached by / date
  const attachedEl = container.querySelector(
    "[data-testid='attached-by'], .attached-by, [class*='contributor'], [class*='attached']"
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
    "[data-testid='tag'], .tag, [class*='Tag'], .badge, [class*='chip']"
  );
  source.tags = Array.from(tagEls).map((el) => el.textContent?.trim() || "").filter(Boolean);

  // Try to find and click "Show Indexed Information" button
  const buttons = container.querySelectorAll("button, [role='button']");
  let showButton = null;
  
  for (const btn of buttons) {
    const text = btn.textContent?.toLowerCase() || "";
    if (text.includes("show") || text.includes("indexed") || text.includes("detail")) {
      showButton = btn;
      break;
    }
  }

  if (showButton) {
    source.expansionAttempts++;
    try {
      showButton.click();
      await sleep(pacing.actionDelay || 300);
      source.expanded = true;
      source.expansionSucceeded = true;
    } catch (e) {
      console.warn("Failed to click show button:", e);
    }
  }

  // Extract indexed information from tables or structured data
  const tables = container.querySelectorAll("table, [class*='indexed'], [class*='detail']");
  
  for (const table of tables) {
    const rows = table.querySelectorAll("tr, [class*='row']");
    for (const row of rows) {
      const cells = row.querySelectorAll("td, th, [class*='label'], [class*='value']");
      if (cells.length >= 2) {
        const label = cells[0].textContent?.trim() || "";
        const value = cells[1].textContent?.trim() || "";
        if (label && value) {
          source.indexed.fields.push({ label, value });
        }
      }
    }
  }

  // Also capture any text blocks in expanded sections
  const textBlocks = container.querySelectorAll("p, [class*='text'], [class*='description']");
  for (const block of textBlocks) {
    const text = block.textContent?.trim();
    if (text && text.length > 20) {
      source.indexed.textBlocks.push(text);
    }
  }

  // Raw text extraction (clean up whitespace)
  source.rawText = container.textContent?.replace(/\s+/g, " ").trim() || "";

  return source;
}

/**
 * Build the final evidence pack
 */
function buildEvidencePack(pageInfo, sources, startTime, pacing) {
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
      mode: pacing.mode || "standard",
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
function generateSourceKey(source) {
  const input = [
    source.citation || "",
    source.webPageUrl || "",
    source.title || "",
  ].join("|");

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
function inferSourceType(source) {
  const text = ((source.title || "") + " " + (source.citation || "")).toLowerCase();
  
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
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

console.log("Discover Their Stories Content Script loaded");
