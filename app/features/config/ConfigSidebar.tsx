import type { ReactNode } from "react";

import { AdvancedConstraintsPanel } from "./AdvancedConstraintsPanel";
import { ContentForm } from "./ContentForm";
import { HookBuilder } from "./HookBuilder";
import { SongDNAForm } from "./SongDNAForm";
import { StructureEditor } from "./StructureEditor";

function SidebarGroup({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section className="studio-surface rounded-[28px] border border-white/10 px-4 py-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{description}</p>
      </div>
      {children}
    </section>
  );
}

export function ConfigSidebar() {
  return (
    <div className="space-y-4">
      <SidebarGroup title="Song DNA" description="Core sound, genre, and writing intensity.">
        <SongDNAForm />
      </SidebarGroup>

      <SidebarGroup title="Content" description="What the song is about and how it speaks.">
        <ContentForm />
      </SidebarGroup>

      <SidebarGroup title="Structure" description="Shape the section flow before generating.">
        <StructureEditor />
      </SidebarGroup>

      <SidebarGroup title="Hook builder" description="Anchor the chorus around a memorable phrase.">
        <HookBuilder />
      </SidebarGroup>

      <AdvancedConstraintsPanel />
    </div>
  );
}
