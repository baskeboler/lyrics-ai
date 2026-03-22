import { useSyncExternalStore } from "react";

import { buildDocumentFromStructure, createInitialDocument, createSnapshot, defaultConfig } from "~/domain/defaults";
import { generateLyricsFromRequest } from "~/domain/generation";
import { createId } from "~/lib/ids";

import type {
  GenerationMode,
  LyricsConfigState,
  LyricsDocument,
  LyricsSection,
  Snapshot,
  StudioState,
  Variation,
  WorkspaceTab,
  SectionType,
} from "~/domain/types";

const STORAGE_KEYS = {
  project: "lyric-studio.project",
  config: "lyric-studio.config",
  document: "lyric-studio.document",
  history: "lyric-studio.history",
  ui: "lyric-studio.ui",
  variations: "lyric-studio.variations",
} as const;

type StudioActions = {
  setProjectTitle: (title: string) => void;
  applyPreset: (presetId: string, config: LyricsConfigState) => void;
  updateConfig: (updater: (config: LyricsConfigState) => LyricsConfigState) => void;
  addStructureSection: (type: SectionType) => void;
  removeStructureSection: (index: number) => void;
  moveStructureSection: (from: number, to: number) => void;
  updateSectionText: (sectionId: string, text: string) => void;
  toggleSectionLock: (sectionId: string) => void;
  regenerateSection: (sectionId: string) => Promise<void>;
  generateLyrics: () => Promise<void>;
  saveSnapshot: () => void;
  restoreSnapshot: (snapshotId: string) => void;
  createVariation: () => void;
  setActiveTab: (tab: WorkspaceTab) => void;
  dismissGenerationError: () => void;
};

export type StudioStore = StudioState & StudioActions;

function safeParse<T>(value: string | null): T | null {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function cloneSection(section: LyricsSection): LyricsSection {
  return { ...section };
}

function cloneDocument(document: LyricsDocument): LyricsDocument {
  return {
    ...document,
    sections: document.sections.map(cloneSection),
  };
}

function mergeGeneratedSections(
  current: LyricsSection[],
  generated: LyricsSection[],
  mode: GenerationMode,
  targetSectionId?: string,
) {
  return current.map((section) => {
    if (section.locked) {
      return section;
    }

    if (mode === "section" && targetSectionId && section.id !== targetSectionId) {
      return section;
    }

    const replacement = generated.find((candidate) => candidate.id === section.id);

    return replacement ? { ...replacement, locked: section.locked } : section;
  });
}

function loadInitialState(): StudioState {
  const defaultDocument = createInitialDocument();

  if (typeof window === "undefined") {
    return {
      project: { title: "Midnight Telephone" },
      config: defaultConfig,
      document: defaultDocument,
      variations: [],
      history: [createSnapshot(defaultConfig, defaultDocument)],
      generation: { isGenerating: false },
      ui: { activeTab: "lyrics", promptPreviewOpen: false },
    };
  }

  const project = safeParse<StudioState["project"]>(window.localStorage.getItem(STORAGE_KEYS.project));
  const config = safeParse<LyricsConfigState>(window.localStorage.getItem(STORAGE_KEYS.config)) ?? defaultConfig;
  const persistedDocument =
    safeParse<LyricsDocument>(window.localStorage.getItem(STORAGE_KEYS.document)) ??
    buildDocumentFromStructure(config.structure);
  const history = safeParse<Snapshot[]>(window.localStorage.getItem(STORAGE_KEYS.history)) ?? [];
  const ui = safeParse<StudioState["ui"]>(window.localStorage.getItem(STORAGE_KEYS.ui));
  const variations = safeParse<Variation[]>(window.localStorage.getItem(STORAGE_KEYS.variations)) ?? [];

  return {
    project: project ?? { title: "Midnight Telephone" },
    config,
    document: {
      ...persistedDocument,
      sections: buildDocumentFromStructure(config.structure, persistedDocument.sections).sections,
    },
    variations,
    history: history.length > 0 ? history : [createSnapshot(config, persistedDocument)],
    generation: { isGenerating: false },
    ui: ui ?? { activeTab: "lyrics", promptPreviewOpen: false },
  };
}

let state: StudioStore;
const listeners = new Set<() => void>();

function persistState(nextState: StudioStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.project, JSON.stringify(nextState.project));
  window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(nextState.config));
  window.localStorage.setItem(STORAGE_KEYS.document, JSON.stringify(nextState.document));
  window.localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(nextState.history));
  window.localStorage.setItem(STORAGE_KEYS.ui, JSON.stringify(nextState.ui));
  window.localStorage.setItem(STORAGE_KEYS.variations, JSON.stringify(nextState.variations));
}

function setState(recipe: (current: StudioStore) => StudioStore) {
  state = recipe(state);
  persistState(state);
  listeners.forEach((listener) => listener());
}

function createStore(): StudioStore {
  const initial = loadInitialState();

  return {
    ...initial,
    setProjectTitle(title) {
      setState((current) => ({
        ...current,
        project: {
          ...current.project,
          title,
        },
        document: {
          ...current.document,
          title,
        },
      }));
    },
    applyPreset(presetId, config) {
      setState((current) => ({
        ...current,
        project: {
          ...current.project,
          presetId,
        },
        config,
        document: buildDocumentFromStructure(config.structure, current.document.sections),
      }));
    },
    updateConfig(updater) {
      setState((current) => {
        const config = updater(current.config);
        const document = buildDocumentFromStructure(config.structure, current.document.sections);

        return {
          ...current,
          config,
          document,
        };
      });
    },
    addStructureSection(type) {
      setState((current) => {
        const structure = [...current.config.structure, type];
        const config = { ...current.config, structure };

        return {
          ...current,
          config,
          document: buildDocumentFromStructure(structure, current.document.sections),
        };
      });
    },
    removeStructureSection(index) {
      setState((current) => {
        if (current.config.structure.length <= 1) {
          return current;
        }

        const structure = current.config.structure.filter((_, currentIndex) => currentIndex !== index);
        const config = { ...current.config, structure };

        return {
          ...current,
          config,
          document: buildDocumentFromStructure(structure, current.document.sections),
        };
      });
    },
    moveStructureSection(from, to) {
      setState((current) => {
        if (to < 0 || to >= current.config.structure.length || from === to) {
          return current;
        }

        const structure = [...current.config.structure];
        const [moved] = structure.splice(from, 1);
        structure.splice(to, 0, moved);
        const config = { ...current.config, structure };

        return {
          ...current,
          config,
          document: buildDocumentFromStructure(structure, current.document.sections),
        };
      });
    },
    updateSectionText(sectionId, text) {
      setState((current) => ({
        ...current,
        document: {
          ...current.document,
          sections: current.document.sections.map((section) =>
            section.id === sectionId ? { ...section, text, version: section.version + 1 } : section,
          ),
        },
      }));
    },
    toggleSectionLock(sectionId) {
      setState((current) => ({
        ...current,
        document: {
          ...current.document,
          sections: current.document.sections.map((section) =>
            section.id === sectionId ? { ...section, locked: !section.locked } : section,
          ),
        },
      }));
    },
    async regenerateSection(sectionId) {
      const current = state;

      setState((snapshot) => ({
        ...snapshot,
        generation: {
          ...snapshot.generation,
          isGenerating: true,
          mode: "section",
          targetSectionId: sectionId,
          error: undefined,
        },
      }));

      try {
        const response = await generateLyricsFromRequest({
          config: current.config,
          document: cloneDocument(current.document),
          mode: "section",
          targetSectionId: sectionId,
        });

        setState((snapshot) => ({
          ...snapshot,
          document: {
            ...snapshot.document,
            sections: mergeGeneratedSections(
              snapshot.document.sections,
              response.parsedSections,
              "section",
              sectionId,
            ),
          },
          generation: {
            isGenerating: false,
            mode: undefined,
            targetSectionId: undefined,
            error: undefined,
            lastPrompt: response.prompt,
            lastRawOutput: response.rawText,
          },
        }));
      } catch (error) {
        setState((snapshot) => ({
          ...snapshot,
          generation: {
            ...snapshot.generation,
            isGenerating: false,
            error: error instanceof Error ? error.message : "Section regeneration failed.",
          },
        }));
      }
    },
    async generateLyrics() {
      const current = state;

      setState((snapshot) => ({
        ...snapshot,
        generation: {
          ...snapshot.generation,
          isGenerating: true,
          mode: "full",
          error: undefined,
        },
      }));

      try {
        const response = await generateLyricsFromRequest({
          config: current.config,
          document: cloneDocument(current.document),
          mode: "full",
        });

        setState((snapshot) => ({
          ...snapshot,
          document: {
            ...snapshot.document,
            sections: mergeGeneratedSections(snapshot.document.sections, response.parsedSections, "full"),
          },
          generation: {
            isGenerating: false,
            mode: undefined,
            targetSectionId: undefined,
            error: undefined,
            lastPrompt: response.prompt,
            lastRawOutput: response.rawText,
          },
        }));
      } catch (error) {
        setState((snapshot) => ({
          ...snapshot,
          generation: {
            ...snapshot.generation,
            isGenerating: false,
            error: error instanceof Error ? error.message : "Lyrics generation failed.",
          },
        }));
      }
    },
    saveSnapshot() {
      setState((current) => ({
        ...current,
        history: [createSnapshot(current.config, cloneDocument(current.document)), ...current.history].slice(0, 12),
      }));
    },
    restoreSnapshot(snapshotId) {
      setState((current) => {
        const snapshot = current.history.find((item) => item.id === snapshotId);

        if (!snapshot) {
          return current;
        }

        return {
          ...current,
          config: snapshot.config,
          document: cloneDocument(snapshot.document),
        };
      });
    },
    createVariation() {
      setState((current) => ({
        ...current,
        variations: [
          {
            id: createId("variation"),
            name: `Variation ${current.variations.length + 1}`,
            summary: "Snapshot of the current draft for side-by-side exploration.",
            sections: current.document.sections.map(cloneSection),
            basedOnDocumentId: current.document.id,
          },
          ...current.variations,
        ],
      }));
    },
    setActiveTab(tab) {
      setState((current) => ({
        ...current,
        ui: {
          ...current.ui,
          activeTab: tab,
        },
      }));
    },
    dismissGenerationError() {
      setState((current) => ({
        ...current,
        generation: {
          ...current.generation,
          error: undefined,
        },
      }));
    },
  };
}

state = createStore();

function subscribe(listener: () => void) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

export function useStudioStore<T>(selector: (store: StudioStore) => T): T {
  return useSyncExternalStore(subscribe, () => selector(state), () => selector(state));
}

export function getStudioStore(): StudioStore {
  return state;
}
