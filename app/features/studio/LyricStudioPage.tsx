import { ConfigSidebar } from "~/features/config/ConfigSidebar";
import { HistoryView } from "~/features/history/HistoryView";
import { LyricsEditorView } from "~/features/lyrics/LyricsEditorView";
import { PromptDebugView } from "~/features/prompt-debug/PromptDebugView";
import type { WorkspaceTab } from "~/domain/types";
import { useStudioStore } from "~/store/studioStore";

import { StudioFooter } from "./StudioFooter";
import { StudioHeader } from "./StudioHeader";
import { StudioLayout } from "./StudioLayout";

const tabs: { id: WorkspaceTab; label: string }[] = [
  { id: "lyrics", label: "Lyrics" },
  { id: "variations", label: "Variations" },
  { id: "prompt-debug", label: "Prompt Debug" },
  { id: "history", label: "History" },
];

function VariationsPlaceholder() {
  return (
    <section className="space-y-6">
      <div className="max-w-2xl space-y-3">
        <p className="section-kicker">Variations workspace</p>
        <h2 className="section-title">Comparison-ready drafts live here</h2>
        <p className="section-copy">
          Variations are already being captured from the current document. The next step is a side-by-side compare flow
          with merge decisions, line swaps, and pinned highlights.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="studio-surface-muted rounded-[28px] p-5">
          <p className="section-kicker">Draft comparison</p>
          <div className="mt-4 space-y-4">
            {["Current chorus", "Variation hook", "Bridge option"].map((label) => (
              <div className="rounded-[22px] border border-white/8 bg-white/[0.02] px-4 py-4" key={label}>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Preview lines, mark keepers, and promote the strongest phrasing back into the active draft.
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="studio-surface-muted rounded-[28px] p-5">
          <p className="section-kicker">Planned behavior</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <li>Preview alternate hooks and verses without leaving the current draft.</li>
            <li>Promote selected lines back into the active document.</li>
            <li>Keep branch history visible while you iterate.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export function LyricStudioPage() {
  const activeTab = useStudioStore((store) => store.ui.activeTab);
  const setActiveTab = useStudioStore((store) => store.setActiveTab);
  const showSidebar = activeTab !== "prompt-debug";

  return (
    <main className="min-h-screen px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-5">
        <StudioHeader />

        <StudioLayout sidebar={showSidebar ? <ConfigSidebar /> : undefined}>
          <div className="workspace-shell">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 border-b border-white/8 pb-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="section-kicker">Workspace</p>
                  <h2 className="section-title">Write, inspect, and compare from one canvas</h2>
                  {activeTab === "prompt-debug" ? (
                    <p className="section-copy">Prompt Debug expands to a full-width technical workspace for easier inspection.</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      className={activeTab === tab.id ? "tab-button-active" : "tab-button"}
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {activeTab === "lyrics" ? <LyricsEditorView /> : null}
              {activeTab === "prompt-debug" ? <PromptDebugView /> : null}
              {activeTab === "history" ? <HistoryView /> : null}
              {activeTab === "variations" ? <VariationsPlaceholder /> : null}
            </div>
          </div>
        </StudioLayout>

        <StudioFooter />
      </div>
    </main>
  );
}
