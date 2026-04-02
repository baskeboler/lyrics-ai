import { presetConfigs } from "~/domain/defaults";
import { useStudioStore } from "~/store/studioStore";

export function StudioHeader() {
  const title = useStudioStore((store) => store.project.title);
  const presetId = useStudioStore((store) => store.project.presetId ?? "punk");
  const isGenerating = useStudioStore((store) => store.generation.isGenerating);
  const setProjectTitle = useStudioStore((store) => store.setProjectTitle);
  const applyPreset = useStudioStore((store) => store.applyPreset);
  const generateLyrics = useStudioStore((store) => store.generateLyrics);
  const saveSnapshot = useStudioStore((store) => store.saveSnapshot);
  const createVariation = useStudioStore((store) => store.createVariation);

  return (
    <header className="studio-surface rounded-[30px] px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0 max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-[0.68rem] uppercase tracking-[0.26em] text-slate-500">
              <span>Lyric Studio</span>
              <span className="rounded-full border border-white/10 px-2 py-1 text-[0.6rem] tracking-[0.2em] text-slate-400">
                {isGenerating ? "Generating" : "Ready"}
              </span>
            </div>

            <input
              className="w-full bg-transparent text-[2.2rem] font-semibold tracking-tight text-white outline-none placeholder:text-slate-500 sm:text-[3rem]"
              value={title}
              onChange={(event) => setProjectTitle(event.target.value)}
              placeholder="Project title"
            />

            <p className="max-w-2xl text-[0.98rem] leading-7 text-slate-400">
              Configure the brief, generate a pass, then keep refining directly in the document.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 xl:max-w-[520px] xl:justify-end">
            <label className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-200">
              <span className="text-slate-500">Preset</span>
              <select
                className="bg-transparent outline-none"
                value={presetId}
                onChange={(event) =>
                  applyPreset(event.target.value, presetConfigs[event.target.value as keyof typeof presetConfigs])
                }
              >
                {Object.keys(presetConfigs).map((preset) => (
                  <option className="bg-slate-950" key={preset} value={preset}>
                    {preset}
                  </option>
                ))}
              </select>
            </label>

            <button className="secondary-button" type="button" onClick={saveSnapshot}>
              Save snapshot
            </button>
            <button className="secondary-button" type="button" onClick={createVariation}>
              Create variation
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/8 pt-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <span className="text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">Current setup</span>
            <span className="rounded-full border border-white/8 px-3 py-1.5 text-sm text-slate-300">{presetId} preset</span>
            <span className="rounded-full border border-white/8 px-3 py-1.5 text-sm text-slate-300">
              {isGenerating ? "generation in progress" : "ready to generate"}
            </span>
          </div>

          <button className="primary-button" type="button" onClick={() => void generateLyrics()} disabled={isGenerating}>
            {isGenerating ? "Generating..." : "Generate lyrics"}
          </button>
        </div>
      </div>
    </header>
  );
}
