import type { Synthesis } from "./schemas";

interface ContextualizedInput {
  personName: string;
  personId: string;
  runId: string;
  synthesis: Synthesis;
}

export function generateContextualizedDocument(input: ContextualizedInput): string {
  const { personName, personId, runId, synthesis } = input;
  const lines: string[] = [];

  lines.push(`# Contextualized Dossier: ${personName || "Unknown Person"}`);
  lines.push(`**FamilySearch ID:** ${personId}  `);
  lines.push(`**Run ID:** \`${runId}\`  `);
  lines.push(`**Generated:** ${new Date().toISOString()}  `);
  lines.push("");

  lines.push("## Executive Summary");
  lines.push("");
  lines.push(synthesis.summary || "No summary generated.");
  lines.push("");

  lines.push("## Verified Facts");
  lines.push("");
  if (synthesis.verifiedFacts.length === 0) {
    lines.push("- No verified facts were returned.");
  } else {
    for (const fact of synthesis.verifiedFacts) {
      lines.push(
        `- ${fact.fact} _(confidence: ${fact.confidence}, sources: ${fact.sourceIds.join(", ")})_`
      );
    }
  }
  lines.push("");

  lines.push("## Conflicts");
  lines.push("");
  if (synthesis.conflicts.length === 0) {
    lines.push("- No conflicts identified.");
  } else {
    for (const conflict of synthesis.conflicts) {
      lines.push(`- ${conflict.description}`);
      for (const position of conflict.positions) {
        lines.push(`  - ${position.claim} _(sources: ${position.sourceIds.join(", ")})_`);
      }
    }
  }
  lines.push("");

  lines.push("## Timeline");
  lines.push("");
  if (synthesis.timeline.length === 0) {
    lines.push("- No timeline entries generated.");
  } else {
    for (const item of synthesis.timeline) {
      lines.push(`- **${item.date}**: ${item.event} _(sources: ${item.sourceIds.join(", ")})_`);
    }
  }
  lines.push("");

  lines.push("## Research Suggestions");
  lines.push("");
  if (synthesis.researchSuggestions.length === 0) {
    lines.push("- No research suggestions generated.");
  } else {
    for (const suggestion of synthesis.researchSuggestions) {
      lines.push(`- ${suggestion}`);
    }
  }
  lines.push("");

  return lines.join("\n");
}
