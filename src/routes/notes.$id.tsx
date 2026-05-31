import { createFileRoute } from "@tanstack/react-router";

import { PageWorkspace } from "@/components/page/PageWorkspace";

export const Route = createFileRoute("/notes/$id")({
  head: () => ({ meta: [{ title: "Note - Mizaan" }] }),
  component: NoteDetail,
});

function NoteDetail() {
  const { id } = Route.useParams();
  return <PageWorkspace itemId={id} />;
}
