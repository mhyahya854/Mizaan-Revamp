import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, FilePlus2, Flag, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  computeGoalTotals,
  createGoalRecordInput,
  getGoalDisplayFields,
  getGoalPrivacySummary,
  isGoalRecordItem,
  normalizeGoalMetadataForItem,
  type CreateGoalRecordOptions,
} from "@/lib/goals/goal-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals - Mizaan" }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const goalsSpace = snapshot.items.find(
    (item) =>
      item.category === "goals" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const goalRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isGoalRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchableGoalText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );
  const totals = computeGoalTotals(goalRecords);

  async function createGoal(preset: CreateGoalRecordOptions, blocksTitle = "Goal notes") {
    const item = await provider.createItem(
      createGoalRecordInput({
        parentId: goalsSpace?.id,
        ...preset,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: blocksTitle },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This goal is local metadata. Progress history, reminders, notifications, AI coaching, and cloud sync are not implemented.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Local goals foundation</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Goals</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Goals are provider-backed local items with typed status, horizon, target date, progress,
            priority, relation, and metadata-only privacy fields. This route does not fake progress
            charts, history, reminders, notifications, coaching, or cloud sync.
          </p>
        </div>
        <button
          onClick={() => createGoal({ title: "Goal - Untitled", status: "active" })}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New goal
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <StatCard label="Records" value={String(totals.recordCount)} detail="real local items" />
        <StatCard label="Active" value={String(totals.activeCount)} detail="provider metadata" />
        <StatCard label="Overdue" value={String(totals.overdueCount)} detail="target date only" />
        <StatCard label="Priority" value={String(totals.highPriorityCount)} detail="high/urgent" />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <Flag className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current goal truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Progress is a typed metadata field, not an automated progress history. Private and
              sensitive flags are metadata only and do not hide records from search or graph.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">Create goal</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <CreateButton
            title="Short-term"
            detail="Near-term target"
            onClick={() =>
              createGoal({
                title: "Short-term Goal - Untitled",
                horizon: "short-term",
                status: "active",
              })
            }
          />
          <CreateButton
            title="Medium-term"
            detail="Quarter or semester"
            onClick={() =>
              createGoal({
                title: "Medium-term Goal - Untitled",
                horizon: "medium-term",
                status: "active",
              })
            }
          />
          <CreateButton
            title="Long-term"
            detail="Year-scale outcome"
            onClick={() =>
              createGoal({
                title: "Long-term Goal - Untitled",
                horizon: "long-term",
                status: "active",
              })
            }
          />
          <CreateButton
            title="Lifetime"
            detail="Long horizon"
            onClick={() => createGoal({ title: "Lifetime Goal - Untitled", horizon: "lifetime" })}
          />
          <CreateButton
            title="Custom"
            detail="Custom horizon"
            onClick={() => createGoal({ title: "Custom Goal - Untitled", horizon: "custom" })}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search goals, notes, target dates, relation IDs"
            className="w-80 max-w-[68vw] bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="-mb-[9px] rounded-sm border-b-2 border-foreground px-2 py-1 pb-[9px] text-foreground">
          Goal records
        </span>
        <span className="text-faint">{goalRecords.length} local records</span>
        <span className="text-faint">{totals.privateFlagCount} private flags</span>
        <span className="text-faint">{totals.invalidProgressCount} invalid progress</span>
      </div>

      {goalRecords.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {goalRecords.map((item) => (
            <GoalCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No goal records yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a provider-backed goal record now. Progress history, fake charts, reminders,
            notifications, AI coaching, cloud sync, and mobile capture are intentionally not shown
            as working controls in this phase.
          </p>
          <button
            onClick={() => createGoal({ title: "Goal - Untitled", status: "active" })}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New goal
          </button>
        </div>
      )}
    </div>
  );
}

function GoalCard({ item }: { item: MizaanItem }) {
  const metadata = normalizeGoalMetadataForItem(item);
  const display = getGoalDisplayFields(metadata);
  const privacy = getGoalPrivacySummary(metadata);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "G"}
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
            {metadata.notes || item.summary || "Provider-backed local goal record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.statusLabel}</Badge>
        <Badge>{display.horizonLabel}</Badge>
        <Badge>{display.priorityLabel}</Badge>
        {metadata.private && <Badge>Private metadata</Badge>}
        {metadata.sensitive && <Badge>Sensitive metadata</Badge>}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Progress" value={display.progressLabel} />
        <Meta label="Target date" value={display.targetDate || "Not set"} />
        <Meta label="Projects" value={String(display.projectCount)} />
        <Meta label="Trackers" value={String(display.trackerCount)} />
        <Meta label="Finance" value={String(display.financeCount)} />
        <Meta label="Relations" value={String(display.relationCount)} />
      </dl>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          {privacy.private || privacy.sensitive
            ? "Privacy flags are metadata only. This goal remains visible to current search and graph foundations."
            : "Metadata-only local goal record; no progress history, fake charts, reminders, notifications, or coaching are active."}
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

function searchableGoalText(item: MizaanItem) {
  const metadata = normalizeGoalMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.goalTitle,
    metadata.goalStatus,
    metadata.goalHorizon,
    metadata.priority,
    metadata.targetDate,
    metadata.progressValue === null ? "" : String(metadata.progressValue),
    metadata.progressUnit,
    metadata.notes,
    metadata.linkedProjectIds.join(" "),
    metadata.linkedTaskIds.join(" "),
    metadata.linkedTrackerIds.join(" "),
    metadata.linkedPersonIds.join(" "),
    metadata.linkedDocumentIds.join(" "),
    metadata.linkedFinanceIds.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
