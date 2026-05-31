import { createFileRoute } from "@tanstack/react-router";

import { PageWorkspace } from "@/components/page/PageWorkspace";

export const Route = createFileRoute("/page/$id")({
  head: () => ({ meta: [{ title: "Page - Mizaan" }] }),
  component: PageRoute,
});

function PageRoute() {
  const { id } = Route.useParams();
  return <PageWorkspace itemId={id} />;
}
