# Lyric Studio React Implementation Plan

## Goal

Build an MVP React application for lyric generation with a strong architecture for future expansion. The app should support:

- Configuring song style, tone, structure, and writing constraints
- Generating complete lyrics or regenerating individual sections
- Editing generated lyrics in place
- Exploring variations
- Inspecting the compiled prompt
- Saving history snapshots for iteration

This document is written as an implementation plan intended to be fed to Codex or used directly as a build spec.

---

## Product Scope

### MVP features

- Project shell with header, sidebar, main editor
- Song configuration form
- Editable structure builder
- Lyrics generation flow
- Lyrics section cards with inline editing
- Regenerate full lyrics
- Regenerate single section
- Lock sections to preserve text during regeneration
- Variations panel
- Prompt debug panel
- History snapshots

### Post-MVP features

- Export formats
- Suno integration
- Syllable counting
- Beat/bar-aware lyric mode
- Multi-project persistence
- Collaborative editing
- Style extraction from pasted lyrics

---

## Tech Stack

### Recommended stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Zustand for app state
- React Hook Form for forms
- Zod for validation
- dnd-kit for structure reordering
- shadcn/ui for UI primitives
- TanStack Query if generation is backed by an API
- uuid for IDs

### Optional additions

- Monaco or CodeMirror if a richer text editing experience is desired later
- Dexie or localforage for local persistence
- Framer Motion for interface polish

---

## Project Structure

Use a feature-first structure.

```text
src/
  app/
    App.tsx
    routes.tsx
    providers.tsx

  features/
    studio/
      LyricStudioPage.tsx
      StudioHeader.tsx
      StudioLayout.tsx
      StudioFooter.tsx

    config/
      ConfigSidebar.tsx
      SongDNAForm.tsx
      ContentForm.tsx
      StructureEditor.tsx
      HookBuilder.tsx
      AdvancedConstraintsPanel.tsx

    lyrics/
      LyricsEditorView.tsx
      LyricsToolbar.tsx
      LyricsDocument.tsx
      LyricsSectionCard.tsx
      SectionTextEditor.tsx
      RefinementChips.tsx

    variations/
      VariationsView.tsx
      VariationGrid.tsx
      VariationCard.tsx
      CompareDrawer.tsx
      MergeLinesPanel.tsx

    prompt-debug/
      PromptDebugView.tsx
      PromptPreview.tsx
      PromptConfigJson.tsx
      TokenEstimateBadge.tsx

    history/
      HistoryView.tsx
      SnapshotList.tsx
      SnapshotCard.tsx
      RestoreSnapshotDialog.tsx

  components/
    ui/
    shared/

  store/
    studioStore.ts
    selectors.ts

  domain/
    types.ts
    defaults.ts
    promptCompiler.ts
    generation.ts
    snapshots.ts

  lib/
    ids.ts
    text.ts
    export.ts

  api/
    lyricsApi.ts
```

---

## Component Tree

```text
LyricStudioPage
├── StudioHeader
│   ├── ProjectTitle
│   ├── PresetSelector
│   ├── SaveMenu
│   └── GenerateButton
├── StudioLayout
│   ├── ConfigSidebar
│   │   ├── SongDNAForm
│   │   │   ├── GenreSelect
│   │   │   ├── InfluencesInput
│   │   │   ├── EnergySlider
│   │   │   ├── ComplexitySelect
│   │   │   └── LanguageSelect
│   │   ├── ContentForm
│   │   │   ├── ThemeInput
│   │   │   ├── TonePicker
│   │   │   ├── PerspectiveSelect
│   │   │   ├── NarrativeModeToggle
│   │   │   └── KeywordsInput
│   │   ├── StructureEditor
│   │   │   ├── StructurePresetSelect
│   │   │   ├── SectionSequenceEditor
│   │   │   │   ├── SectionChip
│   │   │   │   ├── AddSectionButton
│   │   │   │   └── ReorderHandle
│   │   │   └── SectionSettingsPanel
│   │   ├── HookBuilder
│   │   │   ├── HookPhraseInput
│   │   │   ├── HookStyleSelect
│   │   │   └── HookStrengthSlider
│   │   └── AdvancedConstraintsPanel
│   │       ├── AvoidClichesToggle
│   │       ├── RhymeDensitySlider
│   │       ├── WeirdnessSlider
│   │       ├── LineLengthControl
│   │       ├── ExplicitnessSelect
│   │       └── NegativePromptInput
│   └── MainWorkspace
│       ├── LyricsWorkspaceTabs
│       │   ├── LyricsTab
│       │   ├── VariationsTab
│       │   ├── PromptDebugTab
│       │   └── HistoryTab
│       └── ActiveWorkspaceView
│           ├── LyricsEditorView
│           ├── VariationsView
│           ├── PromptDebugView
│           └── HistoryView
└── StudioFooter
```

---

## Domain Model

Create these domain types first.

```ts
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
```

---

## State Model

Use a single studio store with slices by concern.

```ts
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
  };
  ui: {
    activeTab: "lyrics" | "variations" | "prompt-debug" | "history";
    promptPreviewOpen: boolean;
  };
};
```

### Recommended actions

- `setProjectTitle`
- `updateConfig`
- `replaceConfig`
- `addStructureSection`
- `removeStructureSection`
- `reorderStructureSections`
- `createEmptyDocumentFromStructure`
- `setDocument`
- `updateSectionText`
- `toggleSectionLock`
- `deleteSection`
- `generateLyrics`
- `regenerateSection`
- `createVariation`
- `restoreSnapshot`
- `saveSnapshot`
- `setActiveTab`
- `setGenerationError`

---

## Defaults and Presets

Create a defaults module.

```ts
export const defaultConfig: LyricsConfigState = {
  genre: "punk",
  influences: [],
  energy: 75,
  complexity: "poetic",
  theme: "",
  tones: [],
  perspective: "first",
  language: "English",
  structure: ["verse", "chorus", "verse", "chorus", "bridge", "chorus"],
  hook: {
    phrase: "",
    style: "melodic",
    strength: 70,
  },
  constraints: {
    avoidCliches: true,
    rhymeDensity: 50,
    weirdness: 40,
    lineLength: "varied",
    explicitness: "clean",
    negativePrompt: "",
  },
};
```

Add optional presets such as:

- Punk
- Trap
- Indie
- Pop
- Dark Humor
- Ballad

Each preset should map cleanly to a config object.

---

## Prompt Compiler

Centralize prompt generation in one pure function.

```ts
export function compileGenerationPrompt(req: GenerationRequest): string
```

### Rules

- Never build prompts directly inside React components
- Prompt compiler should accept config plus current document context
- Preserve locked sections during regeneration
- For section regeneration, include adjacent section context
- For refinement mode, append the refinement instruction in a controlled format

### Suggested compiler flow

1. Build system role text
2. Add style config
3. Add content config
4. Add structure config
5. Add constraints
6. Add current document context if present
7. Add operation mode instructions
8. Add explicit output contract

### Example output contract

- Return only lyrics
- Label sections clearly
- Respect the requested structure
- Keep locked sections unchanged
- Do not include commentary

---

## Generation Service

Create a service module that wraps model calls.

```ts
export async function generateLyricsFromRequest(
  req: GenerationRequest
): Promise<{
  rawText: string;
  parsedSections: LyricsSection[];
  prompt: string;
}>;
```

### Responsibilities

- Call `compileGenerationPrompt`
- Send prompt to backend or model adapter
- Parse generated text into sections
- Return parsed sections and raw prompt for prompt debug

### Parsing strategy

Use a parser that recognizes section headers such as:

- `[Verse 1]`
- `[Chorus]`
- `[Bridge]`

If parsing fails:

- Fallback to splitting by blank lines
- Preserve raw output for recovery

---

## UI Implementation Sequence

### Phase 1: App shell

Implement:

- `LyricStudioPage`
- `StudioHeader`
- `StudioLayout`
- `StudioFooter`

Acceptance criteria:

- Two-column layout renders
- Header includes title and generate button
- Main workspace supports tabs

### Phase 2: Config sidebar

Implement:

- `ConfigSidebar`
- `SongDNAForm`
- `ContentForm`
- `StructureEditor`
- `HookBuilder`
- `AdvancedConstraintsPanel`

Acceptance criteria:

- Editing fields updates store
- Structure can add/remove/reorder sections
- Advanced constraints are collapsible
- Forms are validated

### Phase 3: Lyrics editor

Implement:

- `LyricsEditorView`
- `LyricsToolbar`
- `LyricsDocument`
- `LyricsSectionCard`
- `SectionTextEditor`
- `RefinementChips`

Acceptance criteria:

- Sections render from store
- Section text is editable
- Lock/unlock works
- Regenerate section action exists
- Regenerate all action exists

### Phase 4: Prompt compiler and mock generation

Implement:

- `promptCompiler.ts`
- `generation.ts`
- Mock provider returning deterministic placeholder lyrics

Acceptance criteria:

- Generate button fills document
- Regenerate section replaces only target section
- Last prompt appears in Prompt Debug tab

### Phase 5: Variations and history

Implement:

- `VariationsView`
- `VariationCard`
- `HistoryView`
- `SnapshotList`

Acceptance criteria:

- Users can create variation snapshots
- Users can restore prior snapshots
- Users can compare current output with variation previews

### Phase 6: Real model/API integration

Implement:

- `api/lyricsApi.ts`
- real async generation workflow
- loading, error, retry states

Acceptance criteria:

- Generation works against actual backend
- Errors are visible and recoverable
- Prompt debug shows exact compiled prompt

---

## Detailed Component Responsibilities

### `LyricStudioPage`

Responsibilities:

- Page composition
- Connect store to primary layout
- Wire generation handlers
- Manage first-load initialization

### `StudioHeader`

Responsibilities:

- Project title editing
- Preset switching
- Save/export menu
- Primary generate action

### `ConfigSidebar`

Responsibilities:

- Render config forms
- Group controls by category
- Bind form inputs to store updates

### `StructureEditor`

Responsibilities:

- Display section sequence
- Add/remove/reorder sections
- Keep structure and document in sync

### `LyricsEditorView`

Responsibilities:

- Render current document
- Support section-level actions
- Surface refinement chips
- Show loading and generation errors

### `LyricsSectionCard`

Responsibilities:

- Render section title
- Toggle lock
- Edit section body
- Trigger regenerate for current section
- Delete optional sections where appropriate

### `PromptDebugView`

Responsibilities:

- Show compiled prompt
- Show config JSON
- Optionally estimate token size

### `HistoryView`

Responsibilities:

- List snapshots
- Restore snapshots
- Show timestamped iteration trail

---

## Store Implementation Notes

### Recommended Zustand shape

- Keep actions inside store
- Use selectors for derived state
- Avoid passing giant prop chains

### Useful selectors

- `selectConfig`
- `selectDocument`
- `selectUnlockedSections`
- `selectActiveTab`
- `selectCanGenerate`
- `selectLastPrompt`

### Derived helpers

- `buildDocumentFromStructure(structure)`
- `mergeGeneratedSections(current, generated)`
- `getContextForSection(document, sectionId)`

---

## Synchronization Rules

These rules matter.

### Structure and document sync

When structure changes:

- Preserve existing section text where IDs still match
- Create new empty sections for newly added structure items
- Remove deleted sections from document
- Reorder document sections to match structure order

### Locked sections

When full generation runs:

- Locked sections remain unchanged
- Unlocked sections can be replaced
- Prompt should explicitly instruct model not to rewrite locked sections
- Merge logic must still enforce the lock even if model ignores instruction

### Section regeneration

When regenerating one section:

- Send neighboring sections for context
- Replace only the target section
- Never modify locked sections
- Preserve titles and ordering

---

## Error Handling

Implement visible error states.

### Cases to handle

- Generation API failure
- Parsing failure
- Empty generation output
- Invalid structure
- Save/restore issues

### UX guidance

- Show inline error banners in workspace
- Keep last good document state
- Preserve raw output when parsing fails
- Allow retry without losing edits

---

## Persistence Plan

### MVP persistence

Use local storage for:

- Current project title
- Current config
- Current document
- History snapshots
- Last active tab

### Suggested keys

- `lyric-studio.project`
- `lyric-studio.config`
- `lyric-studio.document`
- `lyric-studio.history`
- `lyric-studio.ui`

### Later persistence

Move to backend persistence when multi-project support is needed.

---

## API Contract Proposal

If using a backend, start with a simple endpoint.

### Request

```json
{
  "prompt": "compiled prompt text",
  "mode": "full"
}
```

### Response

```json
{
  "text": "[Verse 1]\n...\n\n[Chorus]\n..."
}
```

### Better future contract

```json
{
  "prompt": "compiled prompt text",
  "mode": "section",
  "targetSectionId": "sec_123",
  "config": {},
  "document": {}
}
```

But for MVP, the prompt-only contract is enough.

---

## Suggested Milestones

### Milestone 1

Deliver static UI shell with config controls and placeholder document.

### Milestone 2

Wire store and editable structure/document flows.

### Milestone 3

Implement prompt compiler plus mock generator.

### Milestone 4

Implement real generation integration.

### Milestone 5

Add variations, history, and persistence.

### Milestone 6

Polish UX, export options, and prompt diagnostics.

---

## Coding Priorities for Codex

When feeding this plan to Codex, ask it to implement in this order:

1. Domain types and defaults
2. Zustand store with actions
3. App shell and layout
4. Config sidebar forms
5. Lyrics document editor
6. Structure editor with drag-and-drop
7. Prompt compiler
8. Mock generation service
9. Prompt debug tab
10. Variations and history
11. Local persistence
12. Real API integration

---

## Acceptance Criteria

The MVP is complete when:

- A user can configure song settings in the sidebar
- A user can define and reorder song structure
- A user can generate a full lyrics document
- A user can edit any generated section
- A user can lock sections and preserve them through regeneration
- A user can regenerate a single section
- A user can inspect the compiled prompt
- A user can save and restore snapshots
- State persists locally across reloads

---

## Suggested First Codex Prompt

Use something like this to begin implementation:

```text
Build an MVP React + TypeScript + Vite app called Lyric Studio using Tailwind and Zustand.

Implement:
- a two-column layout
- a config sidebar for lyric generation settings
- a main lyrics editor workspace
- a structure editor with reorderable sections
- a Zustand store using the provided domain model
- placeholder generation using a mock service
- a prompt debug tab that shows the compiled prompt

Follow this implementation plan exactly.
Keep prompt compilation in a pure domain function.
Use feature-first folder organization.
Use reusable UI components and keep business logic out of presentational components.
```

---

## Optional Follow-up Tasks for Codex

After the MVP exists, create follow-up tasks for:

- replacing mock generation with API integration
- adding variation comparison
- adding export to markdown and plain text
- adding presets
- adding autosave
- adding section-level refinement actions
- improving mobile responsiveness

---

## Final Notes

Design for iteration. This product lives or dies on fast loops:

- tweak config
- generate
- edit
- regenerate section
- compare
- restore

Keep prompt engineering centralized, state predictable, and section-level operations explicit.
