import { useStudioStore } from "~/store/studioStore";

export function HistoryView() {
  const history = useStudioStore((store) => store.history);
  const variations = useStudioStore((store) => store.variations);
  const restoreSnapshot = useStudioStore((store) => store.restoreSnapshot);

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <section className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">History snapshots</p>
            <h2 className="text-xl font-semibold text-white">Restore earlier drafts</h2>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          {history.map((snapshot) => (
            <article className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4" key={snapshot.id}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-white">{new Date(snapshot.createdAt).toLocaleString()}</p>
                  <p className="text-sm text-slate-400">{snapshot.document.sections.length} sections saved</p>
                </div>
                <button className="secondary-button" type="button" onClick={() => restoreSnapshot(snapshot.id)}>
                  Restore
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Variations</p>
        <div className="mt-4 space-y-3">
          {variations.length === 0 ? (
            <p className="text-sm leading-6 text-slate-400">Create a variation from the header to pin alternate drafts here.</p>
          ) : (
            variations.map((variation) => (
              <article className="rounded-2xl border border-white/10 bg-black/15 px-4 py-4" key={variation.id}>
                <h3 className="text-sm font-medium text-white">{variation.name}</h3>
                <p className="mt-1 text-sm text-slate-400">{variation.summary}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
