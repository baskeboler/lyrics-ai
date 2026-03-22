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
    <div className="studio-surface rounded-[28px] border border-white/10 px-5 py-5">
      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Variations workspace</p>
      <h2 className="mt-2 text-2xl font-semibold text-white">Ready for comparison flows</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
        The store already captures draft variations. A richer compare and merge view can slot into this tab next.
      </p>
    </div>
  );
}

export function LyricStudioPage() {
  const activeTab = useStudioStore((store) => store.ui.activeTab);
  const setActiveTab = useStudioStore((store) => store.setActiveTab);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.22),_transparent_26%),radial-gradient(circle_at_top_right,_rgba(34,197,94,0.18),_transparent_24%),linear-gradient(180deg,_#07111f_0%,_#111c2f_54%,_#070d16_100%)] px-4 py-4 text-slate-100 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto flex w-full max-w-[1520px] flex-col gap-6">
        <StudioHeader />

        <StudioLayout sidebar={<ConfigSidebar />}>
          <div className="space-y-4">
            <div className="studio-surface rounded-[28px] border border-white/10 px-4 py-4">
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
        </StudioLayout>

        <StudioFooter />
      </div>
    </main>
  );
}
