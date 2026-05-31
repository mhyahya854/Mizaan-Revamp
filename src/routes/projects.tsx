import { createFileRoute } from "@tanstack/react-router";

import { SpacePage } from "@/components/space/SpacePage";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects - Mizaan" }] }),
  component: ProjectsPage,
});

function ProjectsPage() {
  return <SpacePage category="projects" />;
}
