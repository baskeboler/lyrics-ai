import { useStudioStore } from "~/store/studioStore";

export function HistoryView() {
  const history = useStudioStore((store) => store.history);
  const variations = useStudioStore((store) => store.variations);
  const restoreSnapshot = useStudioStore((store) => store.restoreSnapshot);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-4">
        <div className="space-y-2">
          <p className="section-kicker">History snapshots</p>
          <h2 className="section-title">Restore earlier drafts</h2>
          <p className="section-copy">Jump back to saved states without losing the current editing rhythm.</p>
        </div>

        <div className="space-y-3">
          {history.map((snapshot, index) => (
            <article className="studio-surface-muted rounded-[26px] px-4 py-4" key={snapshot.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{new Date(snapshot.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">{snapshot.document.sections.length} sections saved</p>
                </div>
                <div className="flex items-center gap-2">
                  {index === 0 ? (
                    <span className="rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-3 py-1 text-[0.68rem] uppercase tracking-[0.2em] text-amber-100">
                      Latest
                    </span>
                  ) : null}
                  <button className="secondary-button" type="button" onClick={() => restoreSnapshot(snapshot.id)}>
                    Restore
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-surface-muted rounded-[28px] p-5">
        <p className="section-kicker">Variations</p>
        <div className="mt-4 space-y-3">
          {variations.length === 0 ? (
            <p className="text-sm leading-6 text-slate-400">Create a variation from the header to pin alternate drafts here.</p>
          ) : (
            variations.map((variation) => (
              <article className="rounded-[22px] border border-white/8 bg-white/[0.03] px-4 py-4" key={variation.id}>
                <h3 className="text-sm font-medium text-white">{variation.name}</h3>
                <p className="mt-1 text-sm leading-6 text-slate-400">{variation.summary}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
