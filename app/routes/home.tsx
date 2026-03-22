import type { Route } from "./+types/home";
import { LyricStudioPage } from "~/features/studio/LyricStudioPage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Lyric Studio" },
    { name: "description", content: "Generate, edit, and iterate on song lyrics in a structured studio workspace." },
  ];
}

export default function Home() {
  return <LyricStudioPage />;
}
