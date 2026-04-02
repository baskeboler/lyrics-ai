import { useState } from "react";

import { useStudioStore } from "~/store/studioStore";

export function AdvancedConstraintsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const constraints = useStudioStore((store) => store.config.constraints);
  const updateConfig = useStudioStore((store) => store.updateConfig);
  const summary = [
    constraints.avoidCliches ? "avoid cliches" : "cliches allowed",
    `${constraints.rhymeDensity}% rhyme`,
    `${constraints.weirdness}% weirdness`,
    constraints.explicitness,
  ].join(" · ");

  return (
    <section className={isOpen ? "sidebar-panel sidebar-panel-open" : "sidebar-panel"}>
      <button className="sidebar-disclosure" type="button" onClick={() => setIsOpen((current) => !current)}>
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">Advanced constraints</p>
          <p className="mt-1 text-sm text-slate-500">Dial in strictness, weirdness, and negative instructions.</p>
          {!isOpen ? <p className="sidebar-summary">{summary}</p> : null}
        </div>
        <span className="mt-0.5 text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{isOpen ? "Hide" : "Open"}</span>
      </button>

      {isOpen ? (
        <div className="studio-divider space-y-4 px-4 pb-4 pt-4">
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
              className="slider-input"
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
              className="slider-input"
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
