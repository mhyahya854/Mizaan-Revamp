import { AlertTriangle, Plus } from "lucide-react";

import {
  PROJECT_PRIORITY_VALUES,
  PROJECT_STATUS_VALUES,
  getProjectDisplayFields,
  getProjectPriorityLabel,
  getProjectStateSummary,
  getProjectStatusLabel,
  normalizeProjectMetadataForItem,
  updateProjectMetadata,
  type ProjectPriority,
  type ProjectStatus,
} from "@/lib/projects/project-record";
import {
  TASK_PRIORITY_VALUES,
  TASK_STATUS_VALUES,
  createTaskRecordInput,
  getTaskDisplayFields,
  getTaskPriorityLabel,
  getTaskStateSummary,
  getTaskStatusLabel,
  isTaskRecordItem,
  normalizeTaskMetadataForItem,
  updateTaskMetadata,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/tasks/task-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function ProjectMetadataPanel({
  item,
  provider,
  items,
}: {
  item: MizaanItem;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const metadata = normalizeProjectMetadataForItem(item);
  const display = getProjectDisplayFields(metadata);
  const linkedTasks = getLinkedTasks(item.id, metadata.linkedTaskIds, items);
  const summary = getProjectStateSummary(metadata, linkedTasks);

  async function persist(patch: Record<string, unknown>) {
    const next = updateProjectMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.projectTitle || "Untitled project",
      status: getProjectStatusLabel(next.projectStatus),
      summary: next.projectDescription || item.summary,
      properties: {
        status: getProjectStatusLabel(next.projectStatus),
        priority: getProjectPriorityLabel(next.projectPriority),
        deadline: next.projectDeadline,
        area: next.projectArea,
      },
      metadata: next,
    });
  }

  async function createLinkedTask() {
    const task = await provider.createItem(
      createTaskRecordInput({
        title: "Untitled task",
        status: "todo",
        priority: "none",
        projectId: item.id,
      }),
    );
    const nextLinkedTaskIds = uniqueStrings([...metadata.linkedTaskIds, task.id]);
    persist({ linkedTaskIds: nextLinkedTaskIds });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          P
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Project metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed project record. Tasks are real local task items linked to this project.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Project title"
          value={metadata.projectTitle}
          onChange={(value) => persist({ projectTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Status"
            value={metadata.projectStatus}
            options={PROJECT_STATUS_VALUES.map((value) => ({
              value,
              label: getProjectStatusLabel(value),
            }))}
            onChange={(value) => persist({ projectStatus: value as ProjectStatus })}
          />
          <SelectField
            label="Priority"
            value={metadata.projectPriority}
            options={PROJECT_PRIORITY_VALUES.map((value) => ({
              value,
              label: getProjectPriorityLabel(value),
            }))}
            onChange={(value) => persist({ projectPriority: value as ProjectPriority })}
          />
        </div>
        <TextField
          label="Area"
          value={metadata.projectArea}
          onChange={(value) => persist({ projectArea: value })}
          placeholder="Life area or category"
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Start date"
            value={metadata.projectStartDate}
            onChange={(value) => persist({ projectStartDate: value })}
            type="date"
          />
          <TextField
            label="Deadline"
            value={metadata.projectDeadline}
            onChange={(value) => persist({ projectDeadline: value })}
            type="date"
          />
        </div>
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-wider text-faint">
            Description
          </span>
          <textarea
            value={metadata.projectDescription}
            onChange={(event) => persist({ projectDescription: event.target.value })}
            placeholder="Scope, outcome, or project notes"
            className="mt-1 min-h-[70px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
          />
        </label>
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Notes</span>
          <textarea
            value={metadata.notes}
            onChange={(event) => persist({ notes: event.target.value })}
            placeholder="Internal project notes"
            className="mt-1 min-h-[62px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Status" value={display.statusLabel} />
        <StateRow label="Priority" value={display.priorityLabel} />
        <StateRow
          label="Tasks"
          value={`${summary.completedTaskCount}/${linkedTasks.length} done`}
        />
        <StateRow label="Documents" value={String(display.documentCount)} />
        <StateRow label="People" value={String(display.personCount)} />
        <StateRow label="Finance" value={String(display.financeCount)} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-faint">
            Linked tasks
          </h4>
          <button
            onClick={createLinkedTask}
            className="inline-flex items-center gap-1 rounded-sm border hairline bg-background px-2 py-1 text-[11.5px] hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
            New task
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {linkedTasks.map((task) => (
            <TaskInlineEditor
              key={task.id}
              task={task}
              projectId={item.id}
              provider={provider}
              allItems={items}
            />
          ))}
          {!linkedTasks.length && (
            <div className="rounded-sm border border-dashed hairline px-2 py-3 text-center text-[12px] text-faint">
              No linked task records yet.
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/35 px-2 py-2 text-[11.5px] leading-relaxed text-soft">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          Kanban boards, timeline/Gantt, recurring tasks, reminders, calendar scheduling, native
          notifications, dependencies, and AI planning are not implemented in this foundation.
        </span>
      </div>
    </section>
  );
}

export function TaskMetadataPanel({
  item,
  provider,
  items,
}: {
  item: MizaanItem;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const metadata = normalizeTaskMetadataForItem(item);
  const display = getTaskDisplayFields(metadata);
  const summary = getTaskStateSummary(metadata);
  const project = metadata.taskProjectId
    ? items.find((entry) => entry.id === metadata.taskProjectId)
    : undefined;

  async function persist(patch: Record<string, unknown>) {
    const next = updateTaskMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.taskTitle || "Untitled task",
      status: getTaskStatusLabel(next.taskStatus),
      parentId: next.taskProjectId || undefined,
      summary: next.notes || item.summary,
      properties: {
        status: getTaskStatusLabel(next.taskStatus),
        priority: getTaskPriorityLabel(next.taskPriority),
        dueDate: next.taskDueDate,
        projectId: next.taskProjectId,
      },
      metadata: next,
    });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <h3 className="text-[12.5px] font-semibold text-foreground">Task metadata</h3>
      <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
        Provider-backed task record. Route-level task lists remain future; tasks are managed inside
        linked projects for this phase.
      </p>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Task title"
          value={metadata.taskTitle}
          onChange={(value) => persist({ taskTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Status"
            value={metadata.taskStatus}
            options={TASK_STATUS_VALUES.map((value) => ({
              value,
              label: getTaskStatusLabel(value),
            }))}
            onChange={(value) =>
              persist({
                taskStatus: value as TaskStatus,
                taskCompletedAt: value === "done" ? todayDate() : "",
              })
            }
          />
          <SelectField
            label="Priority"
            value={metadata.taskPriority}
            options={TASK_PRIORITY_VALUES.map((value) => ({
              value,
              label: getTaskPriorityLabel(value),
            }))}
            onChange={(value) => persist({ taskPriority: value as TaskPriority })}
          />
        </div>
        <TextField
          label="Due date"
          value={metadata.taskDueDate}
          onChange={(value) => persist({ taskDueDate: value })}
          type="date"
        />
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Notes</span>
          <textarea
            value={metadata.notes}
            onChange={(event) => persist({ notes: event.target.value })}
            placeholder="Task notes"
            className="mt-1 min-h-[64px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Project" value={project?.title ?? (display.projectId || "Not linked")} />
        <StateRow label="Status" value={display.statusLabel} />
        <StateRow label="Priority" value={display.priorityLabel} />
        <StateRow label="Due" value={display.dueDate || "Not set"} />
        <StateRow label="Overdue" value={summary.overdue ? "Yes" : "No"} />
      </div>
    </section>
  );
}

function TaskInlineEditor({
  task,
  projectId,
  provider,
  allItems,
}: {
  task: MizaanItem;
  projectId: string;
  provider: VaultProvider;
  allItems: MizaanItem[];
}) {
  const metadata = normalizeTaskMetadataForItem(task);
  const display = getTaskDisplayFields(metadata);
  const summary = getTaskStateSummary(metadata);

  async function persist(patch: Record<string, unknown>) {
    const next = updateTaskMetadata(metadata, { taskProjectId: projectId, ...patch });
    await provider.updateItem(task.id, {
      title: next.taskTitle || "Untitled task",
      status: getTaskStatusLabel(next.taskStatus),
      parentId: projectId,
      summary: next.notes || task.summary,
      properties: {
        status: getTaskStatusLabel(next.taskStatus),
        priority: getTaskPriorityLabel(next.taskPriority),
        dueDate: next.taskDueDate,
        projectId,
      },
      metadata: next,
    });
  }

  return (
    <article className="rounded-sm border hairline bg-surface px-2 py-2">
      <TextField
        label="Task title"
        value={metadata.taskTitle}
        onChange={(value) => persist({ taskTitle: value })}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        <SelectField
          label="Status"
          value={metadata.taskStatus}
          options={TASK_STATUS_VALUES.map((value) => ({
            value,
            label: getTaskStatusLabel(value),
          }))}
          onChange={(value) =>
            persist({
              taskStatus: value as TaskStatus,
              taskCompletedAt: value === "done" ? todayDate() : "",
            })
          }
        />
        <SelectField
          label="Priority"
          value={metadata.taskPriority}
          options={TASK_PRIORITY_VALUES.map((value) => ({
            value,
            label: getTaskPriorityLabel(value),
          }))}
          onChange={(value) => persist({ taskPriority: value as TaskPriority })}
        />
        <TextField
          label="Due"
          value={metadata.taskDueDate}
          onChange={(value) => persist({ taskDueDate: value })}
          type="date"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-faint">
        <span className="rounded-full border hairline bg-background px-2 py-0.5">
          {display.statusLabel}
        </span>
        <span className="rounded-full border hairline bg-background px-2 py-0.5">
          {display.priorityLabel}
        </span>
        {summary.overdue && (
          <span className="rounded-full border border-red-500/25 bg-red-500/10 px-2 py-0.5 text-red-700">
            Overdue
          </span>
        )}
        <span className="rounded-full border hairline bg-background px-2 py-0.5">
          {allItems.some((entry) => entry.id === task.id) ? "Provider item" : "Missing"}
        </span>
      </div>
    </article>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1">
      <span className="text-faint">{label}</span>
      <span className="font-medium text-soft">{value}</span>
    </div>
  );
}

function getLinkedTasks(projectId: string, linkedTaskIds: string[], items: MizaanItem[]) {
  const linkedIds = new Set(linkedTaskIds);
  return items
    .filter((item) => isTaskRecordItem(item) && !item.archivedAt && !item.deletedAt)
    .filter((task) => {
      const taskMetadata = normalizeTaskMetadataForItem(task);
      return taskMetadata.taskProjectId === projectId || linkedIds.has(task.id);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function uniqueStrings(values: string[]) {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}


