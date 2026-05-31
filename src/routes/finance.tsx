import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance - Mizaan" }] }),
  component: FinancePage,
});

function FinancePage() {
  return <SpacePage category="finance" />;
}
