import type { LyricsSection } from "~/domain/types";
import { useStudioStore } from "~/store/studioStore";

type LyricsSectionCardProps = {
  section: LyricsSection;
  isGenerating: boolean;
  isTargetGenerating: boolean;
};

export function LyricsSectionCard({
  section,
  isGenerating,
  isTargetGenerating,
}: LyricsSectionCardProps) {
  const updateSectionText = useStudioStore((store) => store.updateSectionText);
  const toggleSectionLock = useStudioStore((store) => store.toggleSectionLock);
  const regenerateSection = useStudioStore((store) => store.regenerateSection);

  return (
    <article className="rounded-[28px] border border-white/10 bg-slate-950/72 p-5 shadow-[0_20px_60px_rgba(3,8,20,0.3)]">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{section.type}</p>
          <h3 className="text-xl font-semibold text-white">{section.title}</h3>
        </div>

        <div className="flex items-center gap-2">
          <button className="secondary-button" type="button" onClick={() => toggleSectionLock(section.id)}>
            {section.locked ? "Unlock" : "Lock"}
          </button>
          <button
            className="secondary-button"
            type="button"
            disabled={isGenerating || section.locked}
            onClick={() => void regenerateSection(section.id)}
          >
            {isTargetGenerating ? "Refreshing..." : "Regenerate"}
          </button>
        </div>
      </div>

      <textarea
        className="min-h-44 w-full resize-y rounded-2xl border border-white/10 bg-black/25 px-4 py-4 text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-500"
        disabled={section.locked}
        value={section.text}
        placeholder="Generated lyrics will appear here."
        onChange={(event) => updateSectionText(section.id, event.target.value)}
      />
    </article>
  );
}
