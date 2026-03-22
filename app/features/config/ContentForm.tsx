import { useStudioStore } from "~/store/studioStore";

export function ContentForm() {
  const config = useStudioStore((store) => store.config);
  const updateConfig = useStudioStore((store) => store.updateConfig);

  return (
    <section className="space-y-4">
      <div className="field">
        <label>Theme</label>
        <textarea
          rows={3}
          value={config.theme}
          onChange={(event) => updateConfig((current) => ({ ...current, theme: event.target.value }))}
        />
      </div>

      <div className="field">
        <label>Tones</label>
        <input
          value={config.tones.join(", ")}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              tones: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            }))
          }
        />
      </div>

      <div className="field">
        <label>Perspective</label>
        <select
          value={config.perspective}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              perspective: event.target.value as typeof current.perspective,
            }))
          }
        >
          <option value="first">First person</option>
          <option value="second">Second person</option>
          <option value="third">Third person</option>
        </select>
      </div>
    </section>
  );
}
