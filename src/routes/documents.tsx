import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents - Mizaan" }] }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return <SpacePage category="documents" />;
}
