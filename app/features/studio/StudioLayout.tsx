import type { ReactNode } from "react";

type StudioLayoutProps = {
  sidebar?: ReactNode;
  children: ReactNode;
};

export function StudioLayout({ sidebar, children }: StudioLayoutProps) {
  if (!sidebar) {
    return <section className="min-w-0">{children}</section>;
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
      <aside>{sidebar}</aside>
      <section className="min-w-0">{children}</section>
    </div>
  );
}
