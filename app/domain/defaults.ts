import { createId } from "~/lib/ids";

import type {
  LyricsConfigState,
  LyricsDocument,
  LyricsSection,
  SectionType,
  Snapshot,
} from "./types";

export const defaultConfig: LyricsConfigState = {
  genre: "punk",
  influences: ["The Menzingers", "Paramore"],
  energy: 75,
  complexity: "poetic",
  theme: "Rebuilding your life after a spectacular mistake",
  tones: ["cathartic", "defiant"],
  perspective: "first",
  language: "English",
  structure: ["verse", "chorus", "verse", "chorus", "bridge", "chorus"],
  hook: {
    phrase: "I can still light the fuse",
    style: "melodic",
    strength: 70,
  },
  constraints: {
    avoidCliches: true,
    rhymeDensity: 50,
    weirdness: 40,
    lineLength: "varied",
    explicitness: "clean",
    negativePrompt: "Avoid lazy filler and vague platitudes.",
  },
};

export const presetConfigs = {
  punk: {
    ...defaultConfig,
    genre: "punk",
    influences: ["Against Me!", "Amyl and The Sniffers"],
    tones: ["urgent", "defiant"],
  },
  trap: {
    ...defaultConfig,
    genre: "trap",
    energy: 88,
    complexity: "abstract" as const,
    tones: ["confident", "cold"],
    hook: { phrase: "Black tint, bright city", style: "chant" as const, strength: 82 },
  },
  indie: {
    ...defaultConfig,
    genre: "indie",
    energy: 56,
    tones: ["wistful", "cinematic"],
    hook: { phrase: "Silver in the rearview", style: "melodic" as const, strength: 64 },
  },
  pop: {
    ...defaultConfig,
    genre: "pop",
    energy: 80,
    complexity: "simple" as const,
    tones: ["bright", "romantic"],
    hook: { phrase: "Meet me in the afterglow", style: "repetitive" as const, strength: 86 },
  },
  "dark-humor": {
    ...defaultConfig,
    genre: "alt-pop",
    complexity: "abstract" as const,
    tones: ["wry", "sinister"],
    constraints: {
      ...defaultConfig.constraints,
      weirdness: 75,
      explicitness: "edgy" as const,
    },
  },
  ballad: {
    ...defaultConfig,
    genre: "ballad",
    energy: 36,
    complexity: "poetic" as const,
    tones: ["heartbroken", "intimate"],
    hook: { phrase: "Stay until the streetlights fade", style: "melodic" as const, strength: 58 },
  },
} satisfies Record<string, LyricsConfigState>;

function titleForSection(type: SectionType, index: number): string {
  const sequence = index + 1;

  switch (type) {
    case "verse":
      return `Verse ${sequence}`;
    case "chorus":
      return sequence > 1 ? `Chorus ${sequence}` : "Chorus";
    case "pre-chorus":
      return `Pre-Chorus ${sequence}`;
    case "bridge":
      return "Bridge";
    case "intro":
      return "Intro";
    case "outro":
      return "Outro";
  }
}

export function createSection(type: SectionType, index: number): LyricsSection {
  return {
    id: createId("section"),
    type,
    title: titleForSection(type, index),
    text: "",
    locked: false,
    version: 1,
  };
}

export function buildDocumentFromStructure(
  structure: SectionType[],
  existingSections: LyricsSection[] = [],
): LyricsDocument {
  const buckets = new Map<SectionType, LyricsSection[]>();

  for (const section of existingSections) {
    const collection = buckets.get(section.type) ?? [];
    collection.push(section);
    buckets.set(section.type, collection);
  }

  const sections = structure.map((type, index) => {
    const collection = buckets.get(type);
    const preserved = collection?.shift();

    if (preserved) {
      return {
        ...preserved,
        type,
        title: titleForSection(type, index),
      };
    }

    return createSection(type, index);
  });

  return {
    id: createId("doc"),
    title: "Untitled Song",
    sections,
  };
}

export function createInitialDocument(): LyricsDocument {
  return buildDocumentFromStructure(defaultConfig.structure);
}

export function createSnapshot(
  config: LyricsConfigState,
  document: LyricsDocument,
): Snapshot {
  return {
    id: createId("snapshot"),
    createdAt: new Date().toISOString(),
    config,
    document,
  };
}
