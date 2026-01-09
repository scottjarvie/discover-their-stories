/**
 * Raw Document Generator
 * 
 * Purpose: Generate deterministic markdown from Evidence Pack
 * 
 * Key Elements:
 * - Person header with metadata
 * - Extraction metadata
 * - Source sections with anchors
 * - Indexed information tables
 * 
 * Dependencies:
 * - ./schemas (types)
 * 
 * Last Updated: Initial setup
 */

import type { EvidencePack, Source } from "./schemas";

/**
 * Generate a raw evidence document from an Evidence Pack
 */
export function generateRawDocument(pack: EvidencePack): string {
  const lines: string[] = [];

  // Person Header
  lines.push(`# ${pack.person.name || "Unknown Person"}`);
  lines.push(`**FamilySearch ID:** ${pack.person.familySearchId}  `);
  
  const dates: string[] = [];
  if (pack.person.birthDate) dates.push(`Born: ${pack.person.birthDate}`);
  if (pack.person.deathDate) dates.push(`Died: ${pack.person.deathDate}`);
  if (dates.length > 0) {
    lines.push(`**${dates.join(" | ")}**`);
  }
  
  lines.push("");
  lines.push("---");
  lines.push("");

  // Extraction Metadata
  lines.push("## Extraction Metadata");
  lines.push("");
  lines.push("| Field | Value |");
  lines.push("|-------|-------|");
  lines.push(`| Run ID | \`${pack.runId}\` |`);
  lines.push(`| Captured | ${pack.capturedAt} |`);
  lines.push(`| Source URL | ${pack.sourceUrl} |`);
  lines.push(`| Extractor | v${pack.extractorVersion} |`);
  lines.push(`| Mode | ${pack.diagnostics.mode} |`);
  lines.push(`| Duration | ${(pack.extractionDurationMs / 1000).toFixed(1)}s |`);
  lines.push(`| Sources | ${pack.diagnostics.totalSources} total, ${pack.diagnostics.expandedSections} expanded |`);
  lines.push("");
  lines.push("---");
  lines.push("");

  // Sources
  lines.push("## Sources");
  lines.push("");

  for (const source of pack.sources) {
    lines.push(generateSourceSection(source));
    lines.push("");
  }

  // Diagnostics
  if (pack.diagnostics.warnings.length > 0 || pack.diagnostics.errors.length > 0) {
    lines.push("---");
    lines.push("");
    lines.push("## Extraction Diagnostics");
    lines.push("");

    if (pack.diagnostics.warnings.length > 0) {
      lines.push("### Warnings");
      lines.push("");
      for (const warning of pack.diagnostics.warnings) {
        lines.push(`- **${warning.code}**: ${warning.message}${warning.sourceId ? ` (${warning.sourceId})` : ""}`);
      }
      lines.push("");
    }

    if (pack.diagnostics.errors.length > 0) {
      lines.push("### Errors");
      lines.push("");
      for (const error of pack.diagnostics.errors) {
        lines.push(`- **${error.code}**: ${error.message}${error.fatal ? " (FATAL)" : ""}`);
      }
      lines.push("");
    }
  }

  return lines.join("\n");
}

/**
 * Generate markdown for a single source
 */
function generateSourceSection(source: Source): string {
  const lines: string[] = [];

  // Source Header with Anchor
  lines.push(`### ${source.id}: ${source.title} {#${source.id}}`);
  lines.push(`**Source ID:** \`${source.id}\`  `);
  lines.push(`**Source Key:** \`${source.sourceKey}\`  `);
  lines.push(`**Type:** ${source.sourceType}  `);
  lines.push("");

  // Core Information
  if (source.date) {
    lines.push(`**Date:** ${source.date}  `);
  }

  if (source.attachedBy) {
    let attachedInfo = `**Attached by:** ${source.attachedBy}`;
    if (source.attachedAt) {
      attachedInfo += ` on ${source.attachedAt}`;
    }
    lines.push(attachedInfo + "  ");
  }

  if (source.reasonAttached) {
    lines.push(`**Reason:** ${source.reasonAttached}  `);
  }

  lines.push("");

  // Citation
  if (source.citation) {
    lines.push("**Citation:**  ");
    lines.push(`> ${source.citation}`);
    lines.push("");
  }

  // Web Page Link
  if (source.webPageUrl) {
    lines.push(`**Web Page:** [View Record](${source.webPageUrl})`);
    lines.push("");
  }

  // Tags
  if (source.tags.length > 0) {
    const tagStr = source.tags.map(t => `\`${t}\``).join(" ");
    lines.push(`**Tags:** ${tagStr}`);
    lines.push("");
  }

  // Indexed Information
  if (source.indexed.fields.length > 0 || source.indexed.textBlocks.length > 0) {
    lines.push("#### Indexed Information");
    lines.push("");

    if (source.indexed.fields.length > 0) {
      lines.push("| Field | Value |");
      lines.push("|-------|-------|");
      for (const field of source.indexed.fields) {
        // Escape pipe characters in values
        const escapedValue = field.value.replace(/\|/g, "\\|");
        lines.push(`| ${field.label} | ${escapedValue} |`);
      }
      lines.push("");
    }

    if (source.indexed.textBlocks.length > 0) {
      for (const block of source.indexed.textBlocks) {
        lines.push(`> ${block}`);
        lines.push("");
      }
    }
  }

  // Expansion Status
  if (!source.expanded && source.expansionAttempts > 0) {
    lines.push(`*Note: Indexed information expansion failed after ${source.expansionAttempts} attempt(s)*`);
    lines.push("");
  }

  lines.push("---");
  lines.push(`*End of Source ${source.id} (captured from FamilySearch Sources page)*`);

  return lines.join("\n");
}

/**
 * Generate a table of contents for the sources
 */
export function generateTableOfContents(pack: EvidencePack): string {
  const lines: string[] = [];
  
  lines.push("## Table of Contents");
  lines.push("");
  
  for (const source of pack.sources) {
    lines.push(`- [${source.id}: ${source.title}](#${source.id})`);
  }
  
  lines.push("");
  
  return lines.join("\n");
}
