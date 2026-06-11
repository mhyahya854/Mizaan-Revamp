import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, FilePlus2, ListTodo, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { isProjectRecordItem } from "@/lib/projects/project-record";
import {
  computeTaskTotals,
  createTaskRecordInput,
  getTaskDisplayFields,
  getTaskPriorityLabel,
  getTaskStateSummary,
  getTaskStatusLabel,
  groupTaskRecordsByStatus,
  isTaskRecordItem,
  normalizeTaskMetadataForItem,
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  updateTaskMetadata,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/tasks/task-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({ meta: [{ title: "Tasks - Mizaan" }] }),
  component: TasksPage,
});

function TasksPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">("all");
  const [viewMode, setViewMode] = useState<"list" | "board">("board");
  const q = query.trim().toLowerCase();
  const tasksSpace = snapshot.items.find(
    (item) =>
      item.category === "tasks" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const projectsById = useMemo(() => {
    const entries = snapshot.items
      .filter((item) => isProjectRecordItem(item) && !item.archivedAt && !item.deletedAt)
      .map((item) => [item.id, item] as const);
    return new Map(entries);
  }, [snapshot.items]);
  const taskRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isTaskRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => {
          const metadata = normalizeTaskMetadataForItem(item);
          if (statusFilter !== "all" && metadata.taskStatus !== statusFilter) return false;
          if (priorityFilter !== "all" && metadata.taskPriority !== priorityFilter) return false;
          if (!q) return true;
          return searchableTaskText(item, projectsById.get(metadata.taskProjectId)).includes(q);
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [priorityFilter, projectsById, q, snapshot.items, statusFilter],
  );
  const allTaskRecords = useMemo(
    () =>
      snapshot.items.filter(
        (item) => isTaskRecordItem(item) && !item.archivedAt && !item.deletedAt,
      ),
    [snapshot.items],
  );
  const totals = computeTaskTotals(allTaskRecords);
  const groupedTaskRecords = useMemo(() => groupTaskRecordsByStatus(taskRecords), [taskRecords]);

  async function createTask(preset: {
    title: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }) {
    const item = await provider.createItem({
      ...createTaskRecordInput(preset),
      parentId: tasksSpace?.id,
    });
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: "Task notes" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This task is local metadata. Recurrence, reminders, dependencies, native notifications, and calendar scheduling are not implemented.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  async function updateTaskStatus(item: MizaanItem, taskStatus: TaskStatus) {
    const metadata = normalizeTaskMetadataForItem(item);
    const next = updateTaskMetadata(metadata, {
      taskStatus,
      taskCompletedAt: taskStatus === "done" ? new Date().toISOString().slice(0, 10) : "",
    });
    await provider.updateItem(item.id, {
      status: getTaskStatusLabel(next.taskStatus),
      properties: {
        ...item.properties,
        status: getTaskStatusLabel(next.taskStatus),
      },
      metadata: next,
    });
  }

  async function updateTaskPriority(item: MizaanItem, taskPriority: TaskPriority) {
    const metadata = normalizeTaskMetadataForItem(item);
    const next = updateTaskMetadata(metadata, { taskPriority });
    await provider.updateItem(item.id, {
      properties: {
        ...item.properties,
        priority: getTaskPriorityLabel(next.taskPriority),
      },
      metadata: next,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Local task foundation</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Tasks</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Tasks are provider-backed local items with typed status, priority, due dates, notes, and
            project links. This route does not fake recurrence, reminders, dependencies, native
            notifications, or calendar scheduling.
          </p>
        </div>
        <button
          onClick={() => createTask({ title: "Task - Untitled", status: "todo" })}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New task
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <StatCard label="Records" value={String(totals.recordCount)} detail="real local items" />
        <StatCard label="Active" value={String(totals.activeCount)} detail="not done/archived" />
        <StatCard label="Overdue" value={String(totals.overdueCount)} detail="due date only" />
        <StatCard label="Linked" value={String(totals.linkedProjectCount)} detail="project ids" />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <ListTodo className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current task truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Task status and priority edits update provider item metadata. Overdue counts are only
              a date comparison over local task metadata, not a reminder or notification system.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">Create task</h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <CreateButton
            title="Todo"
            detail="Unlinked task"
            onClick={() => createTask({ title: "Todo Task - Untitled", status: "todo" })}
          />
          <CreateButton
            title="In progress"
            detail="Started task"
            onClick={() =>
              createTask({ title: "In-progress Task - Untitled", status: "in-progress" })
            }
          />
          <CreateButton
            title="Waiting"
            detail="Blocked externally"
            onClick={() => createTask({ title: "Waiting Task - Untitled", status: "waiting" })}
          />
          <CreateButton
            title="High priority"
            detail="No reminder implied"
            onClick={() => createTask({ title: "High-priority Task - Untitled", priority: "high" })}
          />
          <CreateButton
            title="Custom"
            detail="Blank task metadata"
            onClick={() => createTask({ title: "Custom Task - Untitled" })}
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search tasks, notes, projects, relation IDs"
            className="w-80 max-w-[68vw] bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value as TaskStatus | "all")}
          className="rounded-sm border hairline bg-surface px-2 py-1 text-[12.5px] outline-none"
          aria-label="Filter by task status"
        >
          <option value="all">All statuses</option>
          {TASK_STATUS_VALUES.map((status) => (
            <option key={status} value={status}>
              {getTaskStatusLabel(status)}
            </option>
          ))}
        </select>
        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value as TaskPriority | "all")}
          className="rounded-sm border hairline bg-surface px-2 py-1 text-[12.5px] outline-none"
          aria-label="Filter by task priority"
        >
          <option value="all">All priorities</option>
          {TASK_PRIORITY_VALUES.map((priority) => (
            <option key={priority} value={priority}>
              {getTaskPriorityLabel(priority)}
            </option>
          ))}
        </select>
        <button
          onClick={() => setViewMode("list")}
          aria-pressed={viewMode === "list"}
          className={`-mb-[9px] rounded-sm border-b-2 px-2 py-1 pb-[9px] ${
            viewMode === "list"
              ? "border-foreground text-foreground"
              : "border-transparent hover:text-foreground"
          }`}
        >
          List
        </button>
        <button
          onClick={() => setViewMode("board")}
          aria-pressed={viewMode === "board"}
          className={`-mb-[9px] rounded-sm border-b-2 px-2 py-1 pb-[9px] ${
            viewMode === "board"
              ? "border-foreground text-foreground"
              : "border-transparent hover:text-foreground"
          }`}
        >
          Board
        </button>
        <span className="text-faint">Task records</span>
        <span className="text-faint">{taskRecords.length} visible</span>
        <span className="text-faint">{totals.unlinkedCount} unlinked</span>
      </div>

      {viewMode === "board" ? (
        <div className="mt-5 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {TASK_STATUS_VALUES.filter((status) => status !== "archived").map((status) => (
            <TaskBoardColumn
              key={status}
              status={status}
              items={groupedTaskRecords[status]}
              projectsById={projectsById}
              onStatusChange={updateTaskStatus}
            />
          ))}
        </div>
      ) : taskRecords.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {taskRecords.map((item) => (
            <TaskCard
              key={item.id}
              item={item}
              project={projectsById.get(normalizeTaskMetadataForItem(item).taskProjectId)}
              onStatusChange={updateTaskStatus}
              onPriorityChange={updateTaskPriority}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No task records match</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a provider-backed task record now. Recurrence, reminders, dependencies, calendar
            scheduling, native notifications, and mobile capture are intentionally not shown as
            working controls in this phase.
          </p>
          <button
            onClick={() => createTask({ title: "Task - Untitled", status: "todo" })}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New task
          </button>
        </div>
      )}
    </div>
  );
}

function TaskBoardColumn({
  status,
  items,
  projectsById,
  onStatusChange,
}: {
  status: TaskStatus;
  items: MizaanItem[];
  projectsById: Map<string, MizaanItem>;
  onStatusChange: (item: MizaanItem, status: TaskStatus) => void | Promise<void>;
}) {
  return (
    <section
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        const itemId = event.dataTransfer.getData("mizaan-task-id");
        const item = items.find((entry) => entry.id === itemId);
        if (item) return;
        const serialized = event.dataTransfer.getData("mizaan-task-record");
        if (!serialized) return;
        try {
          const parsed = JSON.parse(serialized) as MizaanItem;
          void onStatusChange(parsed, status);
        } catch {
          // Ignore malformed drag payloads from outside this board.
        }
      }}
      className="flex min-h-[460px] w-72 shrink-0 flex-col rounded-md border hairline bg-muted/15 p-3"
    >
      <div className="mb-3 flex items-center justify-between border-b hairline pb-2">
        <h3 className="text-[13px] font-semibold text-foreground">{getTaskStatusLabel(status)}</h3>
        <span className="rounded-full border hairline bg-background px-2 py-0.5 text-[10.5px] font-medium text-faint">
          {items.length}
        </span>
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto">
        {items.map((item) => (
          <TaskBoardCard
            key={item.id}
            item={item}
            project={projectsById.get(normalizeTaskMetadataForItem(item).taskProjectId)}
          />
        ))}
        {!items.length && (
          <div className="rounded-md border border-dashed hairline py-8 text-center text-[12px] text-faint">
            Drop tasks here
          </div>
        )}
      </div>
    </section>
  );
}

function TaskBoardCard({ item, project }: { item: MizaanItem; project?: MizaanItem }) {
  const metadata = normalizeTaskMetadataForItem(item);
  const display = getTaskDisplayFields(metadata);

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("mizaan-task-id", item.id);
        event.dataTransfer.setData("mizaan-task-record", JSON.stringify(item));
      }}
      className="cursor-grab rounded-md border hairline bg-surface p-3 active:cursor-grabbing"
    >
      <Link
        to="/page/$id"
        params={{ id: item.id }}
        className="block truncate text-[13.5px] font-semibold hover:underline"
      >
        {display.title}
      </Link>
      <p className="mt-1 line-clamp-2 text-[11.5px] leading-relaxed text-soft">
        {metadata.notes || item.summary || "No notes"}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5 text-[10.5px] text-faint">
        <span className="rounded-full border hairline bg-background px-2 py-0.5">
          {display.priorityLabel}
        </span>
        {display.dueDate && (
          <span className="rounded-full border hairline bg-background px-2 py-0.5">
            Due {display.dueDate}
          </span>
        )}
        <span className="rounded-full border hairline bg-background px-2 py-0.5">
          {project?.title || "Unlinked"}
        </span>
      </div>
    </article>
  );
}

function TaskCard({
  item,
  project,
  onStatusChange,
  onPriorityChange,
}: {
  item: MizaanItem;
  project?: MizaanItem;
  onStatusChange: (item: MizaanItem, status: TaskStatus) => void;
  onPriorityChange: (item: MizaanItem, priority: TaskPriority) => void;
}) {
  const metadata = normalizeTaskMetadataForItem(item);
  const display = getTaskDisplayFields(metadata);
  const state = getTaskStateSummary(metadata);

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
            {metadata.notes || item.summary || "Provider-backed local task record."}
          </p>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <label className="block rounded-sm border hairline bg-background px-2 py-1.5">
          <span className="block text-[10.5px] uppercase tracking-wider text-faint">Status</span>
          <select
            value={metadata.taskStatus}
            onChange={(event) => onStatusChange(item, event.target.value as TaskStatus)}
            className="mt-1 w-full bg-transparent text-[12.5px] outline-none"
          >
            {TASK_STATUS_VALUES.map((status) => (
              <option key={status} value={status}>
                {getTaskStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>
        <label className="block rounded-sm border hairline bg-background px-2 py-1.5">
          <span className="block text-[10.5px] uppercase tracking-wider text-faint">Priority</span>
          <select
            value={metadata.taskPriority}
            onChange={(event) => onPriorityChange(item, event.target.value as TaskPriority)}
            className="mt-1 w-full bg-transparent text-[12.5px] outline-none"
          >
            {TASK_PRIORITY_VALUES.map((priority) => (
              <option key={priority} value={priority}>
                {getTaskPriorityLabel(priority)}
              </option>
            ))}
          </select>
        </label>
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Project" value={project?.title || "Unlinked"} />
        <Meta label="Due" value={display.dueDate || "Not set"} />
        <Meta label="Start" value={display.startDate || "Not set"} />
        <Meta label="Relations" value={String(display.relationCount)} />
      </dl>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          {state.overdue
            ? "This task is overdue by local date comparison only. No reminder or native notification is active."
            : "Metadata-only local task record; recurrence, dependencies, reminders, and notifications are not active."}
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

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-faint">{label}</dt>
      <dd className="truncate text-soft">{value}</dd>
    </div>
  );
}

function searchableTaskText(item: MizaanItem, project?: MizaanItem) {
  const metadata = normalizeTaskMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.taskTitle,
    metadata.taskStatus,
    metadata.taskPriority,
    metadata.taskStartDate,
    metadata.taskDueDate,
    metadata.taskCompletedAt,
    metadata.taskProjectId,
    project?.title,
    metadata.notes,
    metadata.linkedPageIds.join(" "),
    metadata.linkedDocumentIds.join(" "),
    metadata.linkedPersonIds.join(" "),
    metadata.linkedFinanceIds.join(" "),
    metadata.linkedCalendarEventIds.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
