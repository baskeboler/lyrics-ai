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

      <div className="space-y-2">
        {structure.map((section, index) => (
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 px-3 py-3" key={`${section}-${index}`}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium capitalize text-white">{section}</p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Position {index + 1}</p>
              </div>

              <div className="flex items-center gap-2">
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
