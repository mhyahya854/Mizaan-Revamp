import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/notes/")({
  head: () => ({ meta: [{ title: "Notes - Mizaan" }] }),
  component: NotesIndex,
});

function NotesIndex() {
  return <SpacePage category="notes" />;
}
