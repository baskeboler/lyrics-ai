import { useStudioStore } from "~/store/studioStore";

export function SongDNAForm() {
  const config = useStudioStore((store) => store.config);
  const updateConfig = useStudioStore((store) => store.updateConfig);

  return (
    <section className="space-y-4">
      <div className="field">
        <label>Genre</label>
        <input
          value={config.genre}
          onChange={(event) => updateConfig((current) => ({ ...current, genre: event.target.value }))}
        />
      </div>

      <div className="field">
        <label>Influences</label>
        <input
          value={config.influences.join(", ")}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              influences: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            }))
          }
        />
      </div>

      <div className="field">
        <label>Complexity</label>
        <select
          value={config.complexity}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              complexity: event.target.value as typeof current.complexity,
            }))
          }
        >
          <option value="simple">Simple</option>
          <option value="poetic">Poetic</option>
          <option value="abstract">Abstract</option>
        </select>
      </div>

      <div className="field">
        <label>Language</label>
        <input
          value={config.language}
          onChange={(event) => updateConfig((current) => ({ ...current, language: event.target.value }))}
        />
      </div>

      <div className="field">
        <label>Energy: {config.energy}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={config.energy}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              energy: Number(event.target.value),
            }))
          }
        />
      </div>
    </section>
  );
}
