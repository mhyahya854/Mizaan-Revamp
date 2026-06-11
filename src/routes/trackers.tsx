import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, FilePlus2, Search, Target } from "lucide-react";
import { useMemo, useState } from "react";

import {
  computeTrackerTotals,
  createTrackerRecordInput,
  getTrackerDisplayFields,
  getTrackerPrivacySummary,
  isTrackerRecordItem,
  normalizeTrackerMetadataForItem,
  type CreateTrackerRecordOptions,
} from "@/lib/trackers/tracker-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/trackers")({
  head: () => ({ meta: [{ title: "Trackers - Mizaan" }] }),
  component: TrackersPage,
});

function TrackersPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const trackersSpace = snapshot.items.find(
    (item) =>
      item.category === "trackers" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const trackerRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isTrackerRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchableTrackerText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );
  const totals = computeTrackerTotals(trackerRecords);

  async function createTracker(preset: CreateTrackerRecordOptions, blocksTitle = "Tracker notes") {
    const item = await provider.createItem(
      createTrackerRecordInput({
        parentId: trackersSpace?.id,
        ...preset,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: blocksTitle },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This tracker is local metadata. Streaks, charts, reminders, notifications, AI coaching, wearable imports, and medical tracking claims are not implemented.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">
            Local tracker foundation
          </p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Trackers</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Trackers are provider-backed local items with typed frequency, target, current value,
            check-in, relation, and metadata-only privacy fields. This route does not fake streaks,
            charts, reminders, notifications, coaching, or health integrations.
          </p>
        </div>
        <button
          onClick={() =>
            createTracker({ title: "Tracker - Untitled", status: "active" }, "Tracker notes")
          }
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New tracker
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <StatCard label="Records" value={String(totals.recordCount)} detail="real local items" />
        <StatCard label="Active" value={String(totals.activeCount)} detail="provider metadata" />
        <StatCard label="Targets" value={String(totals.withTargetCount)} detail="numeric targets" />
        <StatCard label="Check-ins" value={String(totals.checkInCount)} detail="real entries" />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <Target className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current tracker truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Check-ins are real local metadata entries only when added. Private/sensitive flags are
              metadata only and do not encrypt, lock, hide from search, or hide from graph.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Create tracker
        </h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <CreateButton
            title="Habit"
            detail="Daily target metadata"
            onClick={() =>
              createTracker({ title: "Habit Tracker - Untitled", type: "habit", status: "active" })
            }
          />
          <CreateButton
            title="Study"
            detail="Study minutes or sessions"
            onClick={() =>
              createTracker({
                title: "Study Tracker - Untitled",
                type: "study",
                status: "active",
                frequency: "weekly",
                unit: "minutes",
              })
            }
          />
          <CreateButton
            title="Reading"
            detail="Pages, books, chapters"
            onClick={() =>
              createTracker({
                title: "Reading Tracker - Untitled",
                type: "reading",
                status: "active",
                unit: "pages",
              })
            }
          />
          <CreateButton
            title="Productivity"
            detail="Work sessions"
            onClick={() =>
              createTracker({
                title: "Productivity Tracker - Untitled",
                type: "productivity",
                status: "active",
                unit: "sessions",
              })
            }
          />
          <CreateButton
            title="Finance"
            detail="Savings or spending"
            onClick={() =>
              createTracker({
                title: "Finance Tracker - Untitled",
                type: "finance",
                status: "active",
                frequency: "monthly",
              })
            }
          />
          <CreateButton
            title="Custom"
            detail="Custom local metric"
            onClick={() =>
              createTracker({
                title: "Custom Tracker - Untitled",
                type: "custom",
                status: "active",
              })
            }
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search trackers, notes, unit, relation IDs"
            className="w-80 max-w-[68vw] bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="-mb-[9px] rounded-sm border-b-2 border-foreground px-2 py-1 pb-[9px] text-foreground">
          Tracker records
        </span>
        <span className="text-faint">{trackerRecords.length} local records</span>
        <span className="text-faint">{totals.privateFlagCount} private flags</span>
        <span className="text-faint">{totals.invalidNumberCount} invalid numbers</span>
      </div>

      {trackerRecords.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {trackerRecords.map((item) => (
            <TrackerCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No tracker records yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a provider-backed tracker record now. Streaks, charts, reminders, notifications,
            AI coaching, wearable integrations, and medical tracking are intentionally not shown as
            working controls in this phase.
          </p>
          <button
            onClick={() => createTracker({ title: "Tracker - Untitled", status: "active" })}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New tracker
          </button>
        </div>
      )}
    </div>
  );
}

function TrackerCard({ item }: { item: MizaanItem }) {
  const metadata = normalizeTrackerMetadataForItem(item);
  const display = getTrackerDisplayFields(metadata);
  const privacy = getTrackerPrivacySummary(metadata);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "T"}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="block truncate text-[15px] font-medium hover:underline"
          >
            {display.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-soft">
            {metadata.notes || item.summary || "Provider-backed local tracker record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.typeLabel}</Badge>
        <Badge>{display.statusLabel}</Badge>
        <Badge>{display.frequencyLabel}</Badge>
        {metadata.private && <Badge>Private metadata</Badge>}
        {metadata.sensitive && <Badge>Sensitive metadata</Badge>}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Progress" value={display.progressLabel} />
        <Meta label="Check-ins" value={String(display.checkInCount)} />
        <Meta label="Start" value={display.startDate || "Not set"} />
        <Meta label="End" value={display.endDate || "Not set"} />
        <Meta label="Unit" value={display.unit || "Not set"} />
        <Meta label="Relations" value={String(display.relationCount)} />
      </dl>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          {privacy.private || privacy.sensitive
            ? "Privacy flags are metadata only. This tracker remains visible to current search and graph foundations."
            : "Metadata-only local tracker record; no fake streaks, charts, reminders, notifications, or integrations are active."}
        </span>
      </div>
    </article>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border hairline bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 truncate text-[26px] font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[12px] text-faint">{detail}</div>
    </div>
  );
}

function CreateButton({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border hairline bg-surface px-3 py-2 text-left hover:bg-muted/40"
    >
      <span className="block text-[13px] text-foreground">{title}</span>
      <span className="block text-[11.5px] text-faint">{detail}</span>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border hairline bg-background px-2 py-0.5 text-faint">
      {children}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-faint">{label}</dt>
      <dd className="truncate text-soft">{value}</dd>
    </div>
  );
}

function searchableTrackerText(item: MizaanItem) {
  const metadata = normalizeTrackerMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.trackerTitle,
    metadata.trackerType,
    metadata.trackerStatus,
    metadata.frequency,
    metadata.targetValue === null ? "" : String(metadata.targetValue),
    metadata.currentValue === null ? "" : String(metadata.currentValue),
    metadata.unit,
    metadata.startDate,
    metadata.endDate,
    metadata.notes,
    metadata.checkIns
      .map((entry) => [entry.date, entry.value, entry.unit, entry.note].filter(Boolean).join(" "))
      .join(" "),
    metadata.linkedProjectIds.join(" "),
    metadata.linkedTaskIds.join(" "),
    metadata.linkedPersonIds.join(" "),
    metadata.linkedDocumentIds.join(" "),
    metadata.linkedFinanceIds.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
