import { useStudioStore } from "~/store/studioStore";

export function PromptDebugView() {
  const config = useStudioStore((store) => store.config);
  const lastPrompt = useStudioStore((store) => store.generation.lastPrompt);
  const rawOutput = useStudioStore((store) => store.generation.lastRawOutput);

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Compiled prompt</p>
        <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-200">
          {lastPrompt ?? "Generate lyrics to inspect the compiled prompt."}
        </pre>
      </section>

      <section className="space-y-4">
        <article className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Config JSON</p>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-200">
            {JSON.stringify(config, null, 2)}
          </pre>
        </article>

        <article className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Raw output</p>
          <pre className="mt-4 overflow-x-auto whitespace-pre-wrap text-sm leading-6 text-slate-200">
            {rawOutput ?? "Mock output will appear here after generation."}
          </pre>
        </article>
      </section>
    </div>
  );
}
