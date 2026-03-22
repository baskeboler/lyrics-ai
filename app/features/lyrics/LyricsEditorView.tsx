import { useStudioStore } from "~/store/studioStore";

import { LyricsSectionCard } from "./LyricsSectionCard";

export function LyricsEditorView() {
  const document = useStudioStore((store) => store.document);
  const generation = useStudioStore((store) => store.generation);
  const generateLyrics = useStudioStore((store) => store.generateLyrics);
  const dismissGenerationError = useStudioStore((store) => store.dismissGenerationError);

  return (
    <div className="space-y-4">
      <div className="studio-surface rounded-[28px] border border-white/10 px-5 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Current draft</p>
            <h2 className="text-2xl font-semibold text-white">{document.title}</h2>
          </div>

          <button
            className="primary-button"
            type="button"
            disabled={generation.isGenerating}
            onClick={() => void generateLyrics()}
          >
            {generation.isGenerating ? "Generating..." : "Regenerate all"}
          </button>
        </div>

        {generation.error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            <div className="flex items-center justify-between gap-3">
              <span>{generation.error}</span>
              <button className="text-rose-200 underline" type="button" onClick={dismissGenerationError}>
                Dismiss
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {document.sections.map((section) => (
        <LyricsSectionCard
          key={section.id}
          section={section}
          isGenerating={generation.isGenerating}
          isTargetGenerating={generation.targetSectionId === section.id}
        />
      ))}
    </div>
  );
}
