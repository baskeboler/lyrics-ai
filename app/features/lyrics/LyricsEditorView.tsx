import { useStudioStore } from "~/store/studioStore";

import { LyricsSectionCard } from "./LyricsSectionCard";

export function LyricsEditorView() {
  const document = useStudioStore((store) => store.document);
  const generation = useStudioStore((store) => store.generation);
  const generateLyrics = useStudioStore((store) => store.generateLyrics);
  const dismissGenerationError = useStudioStore((store) => store.dismissGenerationError);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/8 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="section-kicker">Current draft</p>
          <h3 className="text-[1.55rem] font-semibold tracking-tight text-white">{document.title}</h3>
          <p className="text-sm text-slate-400">
            {document.sections.length} sections ready for editing, locking, and targeted regeneration.
          </p>
        </div>

        <button
          className="secondary-button"
          type="button"
          disabled={generation.isGenerating}
          onClick={() => void generateLyrics()}
        >
          {generation.isGenerating ? "Generating..." : "Regenerate all"}
        </button>
      </div>

      {generation.error ? (
        <div className="rounded-[24px] border border-rose-400/25 bg-rose-500/8 px-4 py-3 text-sm text-rose-100">
          <div className="flex items-center justify-between gap-3">
            <span>{generation.error}</span>
            <button className="text-rose-200 underline" type="button" onClick={dismissGenerationError}>
              Dismiss
            </button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        {document.sections.map((section, index) => (
          <LyricsSectionCard
            key={section.id}
            section={section}
            index={index}
            isGenerating={generation.isGenerating}
            isTargetGenerating={generation.targetSectionId === section.id}
          />
        ))}
      </div>
    </div>
  );
}
