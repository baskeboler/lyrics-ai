import { buildDocumentFromStructure } from "./defaults";
import { compileGenerationPrompt } from "./promptCompiler";
import type { GenerationRequest, LyricsSection, SectionType } from "./types";

function sectionLabel(type: SectionType, index: number): string {
  switch (type) {
    case "pre-chorus":
      return `Pre-Chorus ${index + 1}`;
    case "verse":
      return `Verse ${index + 1}`;
    case "chorus":
      return index === 0 ? "Chorus" : `Chorus ${index + 1}`;
    case "bridge":
      return "Bridge";
    case "intro":
      return "Intro";
    case "outro":
      return "Outro";
  }
}

function makeSectionText(req: GenerationRequest, type: SectionType): string {
  const tones = req.config.tones.join(", ") || "open-hearted";
  const hook = req.config.hook.phrase || "the spark stays lit";
  const theme = req.config.theme || "a complicated turning point";

  const lineA = `In this ${req.config.genre} ${type}, the mood stays ${tones}.`;
  const lineB = `The story circles ${theme} with ${req.config.complexity} detail.`;
  const lineC = `A ${req.config.perspective}-person lens keeps the confession close.`;
  const lineD = `The hook leans on "${hook}" with ${req.config.hook.style} repetition.`;

  return [lineA, lineB, lineC, lineD].join("\n");
}

function buildRawOutput(req: GenerationRequest): string {
  const counters = new Map<SectionType, number>();

  return req.config.structure
    .map((type) => {
      const current = counters.get(type) ?? 0;
      counters.set(type, current + 1);
      const label = sectionLabel(type, current);
      const text = makeSectionText(req, type);

      return `[${label}]\n${text}`;
    })
    .join("\n\n");
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase();
}

function parseHeaderType(value: string): SectionType {
  const normalized = normalizeHeader(value);

  if (normalized.startsWith("pre-chorus")) {
    return "pre-chorus";
  }
  if (normalized.startsWith("chorus")) {
    return "chorus";
  }
  if (normalized.startsWith("bridge")) {
    return "bridge";
  }
  if (normalized.startsWith("intro")) {
    return "intro";
  }
  if (normalized.startsWith("outro")) {
    return "outro";
  }

  return "verse";
}

export function parseGeneratedSections(rawText: string, req: GenerationRequest): LyricsSection[] {
  const matches = [...rawText.matchAll(/^\[(.+?)\]\s*([\s\S]*?)(?=^\[.+?\]|\s*$)/gm)];

  if (matches.length === 0) {
    const fallbackDoc = buildDocumentFromStructure(req.config.structure, req.document?.sections);
    const blocks = rawText.split(/\n\s*\n/).filter(Boolean);

    return fallbackDoc.sections.map((section, index) => ({
      ...section,
      text: blocks[index] ?? "",
      version: section.version + 1,
    }));
  }

  const fallbackDoc = buildDocumentFromStructure(req.config.structure, req.document?.sections);

  return fallbackDoc.sections.map((section, index) => {
    const parsed = matches[index];

    if (!parsed) {
      return section;
    }

    const [, title, body] = parsed;

    return {
      ...section,
      type: parseHeaderType(title),
      title: title.trim(),
      text: body.trim(),
      version: section.version + 1,
    };
  });
}

export async function generateLyricsFromRequest(
  req: GenerationRequest,
): Promise<{
  rawText: string;
  parsedSections: LyricsSection[];
  prompt: string;
}> {
  const prompt = compileGenerationPrompt(req);
  const rawText = buildRawOutput(req);
  const parsedSections = parseGeneratedSections(rawText, req);

  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    rawText,
    parsedSections,
    prompt,
  };
}
