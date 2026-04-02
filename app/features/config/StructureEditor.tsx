import type { SectionType } from "~/domain/types";
import { useStudioStore } from "~/store/studioStore";

const availableSections: SectionType[] = ["verse", "chorus", "pre-chorus", "bridge", "intro", "outro"];

export function StructureEditor() {
  const structure = useStudioStore((store) => store.config.structure);
  const addStructureSection = useStudioStore((store) => store.addStructureSection);
  const removeStructureSection = useStudioStore((store) => store.removeStructureSection);
  const moveStructureSection = useStudioStore((store) => store.moveStructureSection);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableSections.map((section) => (
          <button className="chip-button" key={section} type="button" onClick={() => addStructureSection(section)}>
            + {section}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {structure.map((section, index) => (
          <div className="rounded-[20px] border border-white/8 bg-black/12 px-3 py-3" key={`${section}-${index}`}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/8 bg-white/[0.03] text-[0.7rem] font-medium text-slate-400">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium capitalize text-white">{section}</p>
                  <p className="text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">Sequence</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="icon-button" type="button" onClick={() => moveStructureSection(index, index - 1)}>
                  ↑
                </button>
                <button className="icon-button" type="button" onClick={() => moveStructureSection(index, index + 1)}>
                  ↓
                </button>
                <button className="icon-button" type="button" onClick={() => removeStructureSection(index)}>
                  ×
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
