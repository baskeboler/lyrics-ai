import type { LyricsSection } from "~/domain/types";
import { useStudioStore } from "~/store/studioStore";

type LyricsSectionCardProps = {
  section: LyricsSection;
  index: number;
  isGenerating: boolean;
  isTargetGenerating: boolean;
};

export function LyricsSectionCard({
  section,
  index,
  isGenerating,
  isTargetGenerating,
}: LyricsSectionCardProps) {
  const updateSectionText = useStudioStore((store) => store.updateSectionText);
  const toggleSectionLock = useStudioStore((store) => store.toggleSectionLock);
  const regenerateSection = useStudioStore((store) => store.regenerateSection);

  return (
    <article className={index > 0 ? "studio-divider pt-5" : ""}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <p className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{section.type}</p>
          <h3 className="text-lg font-semibold text-white">{section.title}</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/8 px-3 py-1.5 text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
            {section.locked ? "Locked" : "Editable"}
          </span>
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

      <div className="mt-4 rounded-[24px] border border-white/8 bg-black/14 px-5 py-4">
        <textarea
          className="editor-textarea"
          disabled={section.locked}
          value={section.text}
          placeholder="Generated lyrics will appear here."
          onChange={(event) => updateSectionText(section.id, event.target.value)}
        />
      </div>
    </article>
  );
}
