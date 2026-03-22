import { useStudioStore } from "~/store/studioStore";

export function HookBuilder() {
  const hook = useStudioStore((store) => store.config.hook);
  const updateConfig = useStudioStore((store) => store.updateConfig);

  return (
    <section className="space-y-4">
      <div className="field">
        <label>Hook phrase</label>
        <input
          value={hook.phrase}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              hook: { ...current.hook, phrase: event.target.value },
            }))
          }
        />
      </div>

      <div className="field">
        <label>Hook style</label>
        <select
          value={hook.style}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              hook: { ...current.hook, style: event.target.value as typeof current.hook.style },
            }))
          }
        >
          <option value="chant">Chant</option>
          <option value="melodic">Melodic</option>
          <option value="repetitive">Repetitive</option>
        </select>
      </div>

      <div className="field">
        <label>Hook strength: {hook.strength}</label>
        <input
          type="range"
          min="0"
          max="100"
          value={hook.strength}
          onChange={(event) =>
            updateConfig((current) => ({
              ...current,
              hook: { ...current.hook, strength: Number(event.target.value) },
            }))
          }
        />
      </div>
    </section>
  );
}
