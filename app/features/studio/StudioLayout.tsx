import type { ReactNode } from "react";

type StudioLayoutProps = {
  sidebar: ReactNode;
  children: ReactNode;
};

export function StudioLayout({ sidebar, children }: StudioLayoutProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <aside>{sidebar}</aside>
      <section>{children}</section>
    </div>
  );
}
