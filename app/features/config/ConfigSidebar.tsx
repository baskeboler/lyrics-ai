import { useMemo, useState, type ReactNode } from "react";

import { useStudioStore } from "~/store/studioStore";

import { AdvancedConstraintsPanel } from "./AdvancedConstraintsPanel";
import { ContentForm } from "./ContentForm";
import { HookBuilder } from "./HookBuilder";
import { SongDNAForm } from "./SongDNAForm";
import { StructureEditor } from "./StructureEditor";

type SidebarGroupProps = {
  title: string;
  description: string;
  summary: string;
  defaultOpen?: boolean;
  children: ReactNode;
};

function SidebarGroup({ title, description, summary, defaultOpen = false, children }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className={isOpen ? "sidebar-panel sidebar-panel-open" : "sidebar-panel"}>
      <button className="sidebar-disclosure" type="button" onClick={() => setIsOpen((current) => !current)}>
        <div className="min-w-0">
          <p className="text-base font-semibold text-white">{title}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{description}</p>
          {!isOpen ? <p className="sidebar-summary">{summary}</p> : null}
        </div>
        <span className="mt-0.5 text-[0.68rem] uppercase tracking-[0.24em] text-slate-500">{isOpen ? "Hide" : "Open"}</span>
      </button>

      {isOpen ? <div className="studio-divider px-4 pb-4 pt-4">{children}</div> : null}
    </section>
  );
}

export function ConfigSidebar() {
  const config = useStudioStore((store) => store.config);
  const essentialsSummary = useMemo(
    () => [config.genre, config.complexity, `${config.energy} energy`, config.language].filter(Boolean).join(" · "),
    [config.complexity, config.energy, config.genre, config.language],
  );
  const contentSummary = useMemo(
    () =>
      [config.theme || "No theme yet", config.tones.slice(0, 2).join(", "), `${config.perspective} person`]
        .filter(Boolean)
        .join(" · "),
    [config.perspective, config.theme, config.tones],
  );
  const structureSummary = useMemo(
    () => `${config.structure.length} sections · ${config.structure.slice(0, 4).join(" / ")}`,
    [config.structure],
  );
  const hookSummary = useMemo(
    () =>
      [config.hook.phrase || "No hook phrase", config.hook.style, `${config.hook.strength}% strength`]
        .filter(Boolean)
        .join(" · "),
    [config.hook.phrase, config.hook.strength, config.hook.style],
  );

  return (
    <div className="sidebar-shell space-y-3">
      <div className="space-y-2 px-1 pb-2">
        <p className="sidebar-topline">Brief setup</p>
        <h2 className="sidebar-title">Prompt, shape, and constraints</h2>
        <p className="sidebar-copy">Keep the active brief visible, expand only what you need, then get back to the draft.</p>
      </div>

      <SidebarGroup
        title="Essentials"
        description="Core sound, genre, and writing intensity."
        summary={essentialsSummary}
        defaultOpen
      >
        <SongDNAForm />
      </SidebarGroup>

      <SidebarGroup
        title="Content"
        description="What the song is about and how it speaks."
        summary={contentSummary}
      >
        <ContentForm />
      </SidebarGroup>

      <SidebarGroup title="Song shape" description="Shape the section flow before generating." summary={structureSummary}>
        <StructureEditor />
      </SidebarGroup>

      <SidebarGroup title="Hook" description="Anchor the chorus around a memorable phrase." summary={hookSummary}>
        <HookBuilder />
      </SidebarGroup>

      <AdvancedConstraintsPanel />
    </div>
  );
}
