import type { GenerationRequest, LyricsSection } from "./types";

function formatSectionContext(section: LyricsSection): string {
  const body = section.text.trim() || "(empty)";
  const lockedSuffix = section.locked ? " [LOCKED]" : "";

  return `[${section.title}${lockedSuffix}]\n${body}`;
}

export function compileGenerationPrompt(req: GenerationRequest): string {
  const { config, document, mode, targetSectionId, refinementInstruction } = req;
  const targetIndex = document?.sections.findIndex((section) => section.id === targetSectionId) ?? -1;
  const targetSection = targetIndex >= 0 ? document?.sections[targetIndex] : undefined;
  const previousSection = targetIndex > 0 ? document?.sections[targetIndex - 1] : undefined;
  const nextSection =
    targetIndex >= 0 && document && targetIndex < document.sections.length - 1
      ? document.sections[targetIndex + 1]
      : undefined;

  const styleBlock = [
    `Genre: ${config.genre}`,
    `Influences: ${config.influences.join(", ") || "None provided"}`,
    `Energy: ${config.energy}/100`,
    `Complexity: ${config.complexity}`,
    `Language: ${config.language}`,
  ].join("\n");

  const contentBlock = [
    `Theme: ${config.theme || "Open theme"}`,
    `Tones: ${config.tones.join(", ") || "Flexible"}`,
    `Perspective: ${config.perspective}`,
    `Hook phrase: ${config.hook.phrase || "Optional"}`,
    `Hook style: ${config.hook.style}`,
    `Hook strength: ${config.hook.strength}/100`,
  ].join("\n");

  const constraintsBlock = [
    `Avoid cliches: ${config.constraints.avoidCliches ? "yes" : "no"}`,
    `Rhyme density: ${config.constraints.rhymeDensity}/100`,
    `Weirdness: ${config.constraints.weirdness}/100`,
    `Line length: ${config.constraints.lineLength}`,
    `Explicitness: ${config.constraints.explicitness}`,
    `Negative prompt: ${config.constraints.negativePrompt || "None"}`,
  ].join("\n");

  const structureBlock = config.structure
    .map((section, index) => `${index + 1}. ${section}`)
    .join("\n");

  const documentBlock = document
    ? document.sections.map(formatSectionContext).join("\n\n")
    : "No current document.";

  const lockedBlock = document
    ? document.sections
        .filter((section) => section.locked)
        .map((section) => `- Preserve exactly: ${section.title}`)
        .join("\n") || "- No locked sections"
    : "- No locked sections";

  let operationBlock = "Write the full lyric document and label each section clearly.";

  if (mode === "section" && targetSection) {
    operationBlock = [
      `Rewrite only the target section: ${targetSection.title}.`,
      "Keep the surrounding sections unchanged.",
      previousSection ? `Previous context:\n${formatSectionContext(previousSection)}` : "Previous context: none",
      nextSection ? `Next context:\n${formatSectionContext(nextSection)}` : "Next context: none",
    ].join("\n\n");
  }

  if (mode === "refine") {
    operationBlock = `${operationBlock}\n\nRefinement instruction: ${refinementInstruction || "Tighten imagery and sharpen the cadence."}`;
  }

  if (mode === "variation") {
    operationBlock = "Create a variation that keeps the same concept but changes imagery, phrasing, and cadence.";
  }

  return [
    "You are an elite songwriter helping build polished, emotionally specific lyrics.",
    "",
    "STYLE CONFIG",
    styleBlock,
    "",
    "CONTENT CONFIG",
    contentBlock,
    "",
    "STRUCTURE",
    structureBlock,
    "",
    "CONSTRAINTS",
    constraintsBlock,
    "",
    "CURRENT DOCUMENT",
    documentBlock,
    "",
    "LOCKED SECTIONS",
    lockedBlock,
    "",
    "OPERATION",
    operationBlock,
    "",
    "OUTPUT CONTRACT",
    "- Return only lyrics.",
    "- Label sections with bracketed headers.",
    "- Respect the requested structure and order.",
    "- Keep locked sections unchanged.",
    "- Do not include commentary or analysis.",
  ].join("\n");
}
