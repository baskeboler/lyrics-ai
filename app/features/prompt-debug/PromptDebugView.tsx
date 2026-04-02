import { CopyToClipboardButton } from "~/components/CopyToClipboardButton";
import { useStudioStore } from "~/store/studioStore";

export function PromptDebugView() {
  const config = useStudioStore((store) => store.config);
  const lastPrompt = useStudioStore((store) => store.generation.lastPrompt);
  const rawOutput = useStudioStore((store) => store.generation.lastRawOutput);
  const compiledPrompt = lastPrompt ?? "Generate lyrics to inspect the compiled prompt.";
  const configJson = JSON.stringify(config, null, 2);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
      <section className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker">Compiled prompt</p>
            <h2 className="mt-2 text-lg font-semibold text-white">Inspect the exact instructions being sent</h2>
          </div>
          <CopyToClipboardButton text={compiledPrompt} />
        </div>
        <pre className="technical-pre whitespace-pre-wrap">{compiledPrompt}</pre>
      </section>

      <section className="space-y-4">
        <article className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="section-kicker">Config JSON</p>
              <h3 className="mt-2 text-base font-semibold text-white">Current generation inputs</h3>
            </div>
            <CopyToClipboardButton text={configJson} />
          </div>
          <pre className="technical-pre whitespace-pre-wrap">{configJson}</pre>
        </article>

        <article className="space-y-3">
          <div>
            <p className="section-kicker">Raw output</p>
            <h3 className="mt-2 text-base font-semibold text-white">Latest model response</h3>
          </div>
          <pre className="technical-pre whitespace-pre-wrap">
            {rawOutput ?? "Mock output will appear here after generation."}
          </pre>
        </article>
      </section>
    </div>
  );
}
