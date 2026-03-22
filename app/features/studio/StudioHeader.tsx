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
    <header className="studio-surface flex flex-col gap-4 rounded-[28px] border border-white/12 px-5 py-5 shadow-[0_24px_80px_rgba(5,10,24,0.28)] lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <p className="text-[0.7rem] uppercase tracking-[0.3em] text-amber-200/70">Lyric Studio MVP</p>
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tight text-white outline-none placeholder:text-slate-400"
          value={title}
          onChange={(event) => setProjectTitle(event.target.value)}
          placeholder="Project title"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2 rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-slate-200">
          <span className="text-slate-400">Preset</span>
          <select
            className="bg-transparent outline-none"
            value={presetId}
            onChange={(event) => applyPreset(event.target.value, presetConfigs[event.target.value as keyof typeof presetConfigs])}
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
        <button className="primary-button" type="button" onClick={() => void generateLyrics()} disabled={isGenerating}>
          {isGenerating ? "Generating..." : "Generate lyrics"}
        </button>
      </div>
    </header>
  );
}
