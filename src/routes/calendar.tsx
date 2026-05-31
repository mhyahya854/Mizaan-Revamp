import { createFileRoute } from "@tanstack/react-router";

import { CalendarView } from "@/components/calendar/CalendarView";

export const Route = createFileRoute("/calendar")({
  head: () => ({ meta: [{ title: "Calendar - Mizaan" }] }),
  component: CalendarPage,
});

function CalendarPage() {
  return <CalendarView />;
}
