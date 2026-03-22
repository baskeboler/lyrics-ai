import { useState } from "react";

import { useStudioStore } from "~/store/studioStore";

export function AdvancedConstraintsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const constraints = useStudioStore((store) => store.config.constraints);
  const updateConfig = useStudioStore((store) => store.updateConfig);

  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-black/15 px-4 py-4">
      <button
        className="flex w-full items-center justify-between text-left text-sm font-medium text-white"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>Advanced constraints</span>
        <span className="text-slate-400">{isOpen ? "Hide" : "Show"}</span>
      </button>

      {isOpen ? (
        <div className="space-y-4">
          <label className="flex items-center justify-between gap-3 text-sm text-slate-200">
            <span>Avoid cliches</span>
            <input
              checked={constraints.avoidCliches}
              type="checkbox"
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    avoidCliches: event.target.checked,
                  },
                }))
              }
            />
          </label>

          <div className="field">
            <label>Rhyme density: {constraints.rhymeDensity}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={constraints.rhymeDensity}
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    rhymeDensity: Number(event.target.value),
                  },
                }))
              }
            />
          </div>

          <div className="field">
            <label>Weirdness: {constraints.weirdness}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={constraints.weirdness}
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    weirdness: Number(event.target.value),
                  },
                }))
              }
            />
          </div>

          <div className="field">
            <label>Line length</label>
            <select
              value={constraints.lineLength}
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    lineLength: event.target.value as typeof current.constraints.lineLength,
                  },
                }))
              }
            >
              <option value="short">Short</option>
              <option value="medium">Medium</option>
              <option value="long">Long</option>
              <option value="varied">Varied</option>
            </select>
          </div>

          <div className="field">
            <label>Explicitness</label>
            <select
              value={constraints.explicitness}
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    explicitness: event.target.value as typeof current.constraints.explicitness,
                  },
                }))
              }
            >
              <option value="clean">Clean</option>
              <option value="edgy">Edgy</option>
              <option value="explicit">Explicit</option>
            </select>
          </div>

          <div className="field">
            <label>Negative prompt</label>
            <textarea
              rows={3}
              value={constraints.negativePrompt}
              onChange={(event) =>
                updateConfig((current) => ({
                  ...current,
                  constraints: {
                    ...current.constraints,
                    negativePrompt: event.target.value,
                  },
                }))
              }
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
