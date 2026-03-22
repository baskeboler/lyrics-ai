import type { StudioState } from "~/domain/types";

export const selectConfig = (state: StudioState) => state.config;
export const selectDocument = (state: StudioState) => state.document;
export const selectActiveTab = (state: StudioState) => state.ui.activeTab;
export const selectLastPrompt = (state: StudioState) => state.generation.lastPrompt;
export const selectUnlockedSections = (state: StudioState) =>
  state.document.sections.filter((section) => !section.locked);
export const selectCanGenerate = (state: StudioState) =>
  !state.generation.isGenerating && Boolean(state.config.theme.trim());
