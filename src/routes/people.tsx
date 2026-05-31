import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "People - Mizaan" }] }),
  component: PeoplePage,
});

function PeoplePage() {
  return <SpacePage category="people" />;
}
