import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/trackers")({
  head: () => ({ meta: [{ title: "Trackers - Mizaan" }] }),
  component: TrackersPage,
});

function TrackersPage() {
  return <SpacePage category="trackers" />;
}
