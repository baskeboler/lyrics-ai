export type SectionType =
  | "verse"
  | "chorus"
  | "bridge"
  | "pre-chorus"
  | "outro"
  | "intro";

export type Complexity = "simple" | "poetic" | "abstract";
export type Perspective = "first" | "second" | "third";
export type HookStyle = "chant" | "melodic" | "repetitive";
export type Explicitness = "clean" | "edgy" | "explicit";
export type LineLength = "short" | "medium" | "long" | "varied";
export type WorkspaceTab = "lyrics" | "variations" | "prompt-debug" | "history";

export type LyricsConfigState = {
  genre: string;
  influences: string[];
  energy: number;
  complexity: Complexity;
  theme: string;
  tones: string[];
  perspective: Perspective;
  language: string;
  structure: SectionType[];
  hook: {
    phrase: string;
    style: HookStyle;
    strength: number;
  };
  constraints: {
    avoidCliches: boolean;
    rhymeDensity: number;
    weirdness: number;
    lineLength: LineLength;
    explicitness: Explicitness;
    negativePrompt: string;
  };
};

export type LyricsSection = {
  id: string;
  type: SectionType;
  title: string;
  text: string;
  locked: boolean;
  version: number;
};

export type LyricsDocument = {
  id: string;
  title: string;
  sections: LyricsSection[];
};

export type Variation = {
  id: string;
  name: string;
  summary?: string;
  sections: LyricsSection[];
  basedOnDocumentId?: string;
};

export type Snapshot = {
  id: string;
  createdAt: string;
  config: LyricsConfigState;
  document: LyricsDocument;
};

export type GenerationMode = "full" | "section" | "variation" | "refine";

export type GenerationRequest = {
  config: LyricsConfigState;
  document?: LyricsDocument;
  mode: GenerationMode;
  targetSectionId?: string;
  refinementInstruction?: string;
};

export type StudioState = {
  project: {
    title: string;
    presetId?: string;
  };
  config: LyricsConfigState;
  document: LyricsDocument;
  variations: Variation[];
  history: Snapshot[];
  generation: {
    isGenerating: boolean;
    mode?: GenerationMode;
    targetSectionId?: string;
    error?: string;
    lastPrompt?: string;
    lastRawOutput?: string;
  };
  ui: {
    activeTab: WorkspaceTab;
    promptPreviewOpen: boolean;
  };
};
