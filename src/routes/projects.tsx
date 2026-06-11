import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Briefcase, FilePlus2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

import {
  createProjectRecordInput,
  getProjectDisplayFields,
  getProjectStateSummary,
  isProjectRecordItem,
  normalizeProjectMetadataForItem,
  PROJECT_STATUS_VALUES,
  getProjectStatusLabel,
  updateProjectMetadata,
  type ProjectStatus,
} from "@/lib/projects/project-record";
import { createPageFromTemplate, getImplementedTemplates } from "@/lib/page/page-workspace";
import {
  getTaskDisplayFields,
  isTaskRecordItem,
  normalizeTaskMetadataForItem,
  TASK_STATUS_VALUES,
  getTaskStatusLabel,
  updateTaskMetadata,
  type TaskStatus,
} from "@/lib/tasks/task-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/projects")({
  head: () => ({ meta: [{ title: "Projects - Mizaan" }] }),
  component: ProjectsPage,
});

const PROJECT_TEMPLATE_IDS = [
  "project-plan",
  "study-project",
  "research-project",
  "personal-project",
];

function ProjectsPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "projects-kanban" | "tasks-kanban">("list");
  const q = query.trim().toLowerCase();
  const projectSpace = snapshot.items.find(
    (item) =>
      item.category === "projects" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const taskRecords = useMemo(
    () =>
      snapshot.items.filter(
        (item) => isTaskRecordItem(item) && !item.archivedAt && !item.deletedAt,
      ),
    [snapshot.items],
  );
  const filteredTaskRecords = useMemo(() => {
    const qText = query.trim().toLowerCase();
    if (!qText) return taskRecords;
    return taskRecords.filter(
      (task) =>
        task.title.toLowerCase().includes(qText) ||
        (task.summary || "").toLowerCase().includes(qText),
    );
  }, [taskRecords, query]);
  const projectRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isProjectRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchableProjectText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );
  const templates = getImplementedTemplates().filter((template) =>
    PROJECT_TEMPLATE_IDS.includes(template.id),
  );
  const linkedTaskCount = taskRecords.filter((task) => {
    const metadata = normalizeTaskMetadataForItem(task);
    return Boolean(metadata.taskProjectId);
  }).length;

  async function createProject() {
    const item = await provider.createItem(
      createProjectRecordInput({
        parentId: projectSpace?.id,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: "Project brief" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Working notes" },
      { type: "paragraph", content: "" },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  async function createFromTemplate(templateId: string) {
    const item = await createPageFromTemplate(provider, templateId, {
      parentId: projectSpace?.id,
    });
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  async function handleMoveProject(id: string, newStatus: ProjectStatus) {
    const project = snapshot.items.find((entry) => entry.id === id);
    if (!project) return;
    const metadata = normalizeProjectMetadataForItem(project);
    const nextMetadata = updateProjectMetadata(metadata, { projectStatus: newStatus });
    await provider.updateItem(project.id, {
      status: getProjectStatusLabel(newStatus),
      properties: {
        ...project.properties,
        status: getProjectStatusLabel(newStatus),
      },
      metadata: nextMetadata,
    });
  }

  async function handleMoveTask(id: string, newStatus: TaskStatus) {
    const task = snapshot.items.find((entry) => entry.id === id);
    if (!task) return;
    const metadata = normalizeTaskMetadataForItem(task);
    const nextMetadata = updateTaskMetadata(metadata, {
      taskStatus: newStatus,
      taskCompletedAt: newStatus === "done" ? new Date().toISOString().slice(0, 10) : "",
    });
    await provider.updateItem(task.id, {
      status: getTaskStatusLabel(newStatus),
      properties: {
        ...task.properties,
        status: getTaskStatusLabel(newStatus),
      },
      metadata: nextMetadata,
    });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Local project records</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Projects</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Projects are provider-backed Mizaan items in the current browser/localStorage prototype.
            Tasks are real linked task records. Kanban, timelines, recurring tasks, reminders, and
            native notifications remain future phases.
          </p>
        </div>
        <button
          onClick={createProject}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New project
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-3">
        <StatCard label="Projects" value={String(projectRecords.length)} detail="real records" />
        <StatCard label="Linked tasks" value={String(linkedTaskCount)} detail="real task items" />
        <StatCard label="Prototype storage" value="Local" detail="browser provider, not SQLite" />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <Briefcase className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current project truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Project and task metadata persists through `VaultProvider` item records. This route
              does not invent progress, dashboards, schedules, or task analytics. Counts come only
              from linked provider records.
            </p>
          </div>
        </div>
      </section>

      {templates.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">
            Project templates
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => createFromTemplate(template.id)}
                className="rounded-sm border hairline bg-surface px-3 py-2 text-left hover:bg-muted/40"
              >
                <span className="block text-[13px] text-foreground">{template.name}</span>
                <span className="block text-[11.5px] text-faint">{template.summary}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={
              viewMode === "tasks-kanban"
                ? "Search tasks..."
                : "Search projects, status, priority..."
            }
            className="w-64 bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <button
          onClick={() => setViewMode("list")}
          className={cn(
            "rounded-sm px-2.5 py-1 -mb-[9px] pb-[9px] border-b-2 font-medium transition-colors",
            viewMode === "list"
              ? "border-foreground text-foreground animate-in fade-in duration-200"
              : "border-transparent text-sidebar-muted hover:text-foreground",
          )}
        >
          Project List
        </button>
        <button
          onClick={() => setViewMode("projects-kanban")}
          className={cn(
            "rounded-sm px-2.5 py-1 -mb-[9px] pb-[9px] border-b-2 font-medium transition-colors",
            viewMode === "projects-kanban"
              ? "border-foreground text-foreground animate-in fade-in duration-200"
              : "border-transparent text-sidebar-muted hover:text-foreground",
          )}
        >
          Projects Kanban
        </button>
        <button
          onClick={() => setViewMode("tasks-kanban")}
          className={cn(
            "rounded-sm px-2.5 py-1 -mb-[9px] pb-[9px] border-b-2 font-medium transition-colors",
            viewMode === "tasks-kanban"
              ? "border-foreground text-foreground animate-in fade-in duration-200"
              : "border-transparent text-sidebar-muted hover:text-foreground",
          )}
        >
          Tasks Kanban
        </button>
        <span className="ml-auto text-faint">
          {viewMode === "tasks-kanban"
            ? `${filteredTaskRecords.length} tasks`
            : `${projectRecords.length} projects`}
        </span>
      </div>

      {viewMode === "list" && (
        <>
          {projectRecords.length > 0 ? (
            <div className="mt-5 grid gap-3 lg:grid-cols-2">
              {projectRecords.map((item) => (
                <ProjectCard key={item.id} item={item} taskRecords={taskRecords} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
              <h2 className="font-editorial text-[24px]">No project records yet</h2>
              <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
                Create a provider-backed project record now.
              </p>
              <button
                onClick={createProject}
                className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
              >
                New project
              </button>
            </div>
          )}
        </>
      )}

      {viewMode === "projects-kanban" && (
        <div className="mt-5 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {PROJECT_STATUS_VALUES.map((status) => {
            const cols = projectRecords.filter((item) => {
              const meta = normalizeProjectMetadataForItem(item);
              return meta.projectStatus === status;
            });
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData("mizaan-project-id");
                  if (id) handleMoveProject(id, status);
                }}
                className="w-72 shrink-0 rounded-md bg-muted/15 border hairline p-3 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between border-b hairline pb-2 mb-3">
                  <h3 className="text-[13px] font-semibold capitalize text-foreground">
                    {getProjectStatusLabel(status)}
                  </h3>
                  <span className="rounded-full bg-background border hairline px-2 py-0.5 text-[10.5px] text-faint font-medium">
                    {cols.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {cols.map((item) => {
                    const meta = normalizeProjectMetadataForItem(item);
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("mizaan-project-id", item.id);
                        }}
                        className="rounded-md border hairline bg-surface p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow relative group"
                      >
                        <Link
                          to="/page/$id"
                          params={{ id: item.id }}
                          className="block text-[13.5px] font-semibold hover:underline truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-[11.5px] text-soft line-clamp-2">
                          {meta.projectDescription || item.summary || "No description"}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-faint uppercase tracking-wider font-semibold">
                            {meta.projectPriority || "none"}
                          </span>
                          <select
                            value={meta.projectStatus}
                            onChange={(e) =>
                              handleMoveProject(item.id, e.target.value as ProjectStatus)
                            }
                            className="text-[11px] rounded bg-muted/50 border border-transparent px-1 py-0.5 text-soft outline-none hover:border-input"
                          >
                            {PROJECT_STATUS_VALUES.map((opt) => (
                              <option key={opt} value={opt}>
                                {getProjectStatusLabel(opt)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {!cols.length && (
                    <div className="py-8 text-center text-[12px] text-faint border border-dashed hairline rounded-md">
                      Drop projects here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "tasks-kanban" && (
        <div className="mt-5 flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {TASK_STATUS_VALUES.filter((s) => s !== "archived").map((status) => {
            const cols = filteredTaskRecords.filter((item) => {
              const meta = normalizeTaskMetadataForItem(item);
              return meta.taskStatus === status;
            });
            return (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const id = e.dataTransfer.getData("mizaan-task-id");
                  if (id) handleMoveTask(id, status);
                }}
                className="w-72 shrink-0 rounded-md bg-muted/15 border hairline p-3 flex flex-col min-h-[500px]"
              >
                <div className="flex items-center justify-between border-b hairline pb-2 mb-3">
                  <h3 className="text-[13px] font-semibold capitalize text-foreground">
                    {getTaskStatusLabel(status)}
                  </h3>
                  <span className="rounded-full bg-background border hairline px-2 py-0.5 text-[10.5px] text-faint font-medium">
                    {cols.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {cols.map((item) => {
                    const meta = normalizeTaskMetadataForItem(item);
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("mizaan-task-id", item.id);
                        }}
                        className="rounded-md border hairline bg-surface p-3 cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow relative group"
                      >
                        <Link
                          to="/page/$id"
                          params={{ id: item.id }}
                          className="block text-[13.5px] font-semibold hover:underline truncate"
                        >
                          {item.title}
                        </Link>
                        <p className="mt-1 text-[11.5px] text-soft line-clamp-2">
                          {meta.notes || item.summary || "No description"}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-faint uppercase tracking-wider font-semibold">
                            {meta.taskPriority || "none"}
                          </span>
                          <select
                            value={meta.taskStatus}
                            onChange={(e) => handleMoveTask(item.id, e.target.value as TaskStatus)}
                            className="text-[11px] rounded bg-muted/50 border border-transparent px-1 py-0.5 text-soft outline-none hover:border-input"
                          >
                            {TASK_STATUS_VALUES.map((opt) => (
                              <option key={opt} value={opt}>
                                {getTaskStatusLabel(opt)}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                  {!cols.length && (
                    <div className="py-8 text-center text-[12px] text-faint border border-dashed hairline rounded-md">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProjectCard({ item, taskRecords }: { item: MizaanItem; taskRecords: MizaanItem[] }) {
  const metadata = normalizeProjectMetadataForItem(item);
  const display = getProjectDisplayFields(metadata);
  const linkedTasks = getLinkedTasks(item.id, metadata.linkedTaskIds, taskRecords);
  const summary = getProjectStateSummary(metadata, linkedTasks);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "P"}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="block truncate text-[15px] font-medium hover:underline"
          >
            {item.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-soft">
            {metadata.projectDescription || item.summary || "Provider-backed project record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.statusLabel}</Badge>
        <Badge>{display.priorityLabel}</Badge>
        <Badge>{linkedTasks.length} tasks</Badge>
        {display.deadline && <Badge>Due {display.deadline}</Badge>}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Area" value={display.area || "Not set"} />
        <Meta label="Deadline" value={display.deadline || "Not set"} />
        <Meta label="Tasks done" value={`${summary.completedTaskCount}/${linkedTasks.length}`} />
        <Meta
          label="Relations"
          value={`${display.documentCount + display.personCount + display.financeCount} linked`}
        />
      </dl>

      <div className="mt-3 space-y-1.5">
        {linkedTasks.slice(0, 3).map((task) => {
          const taskDisplay = getTaskDisplayFields(normalizeTaskMetadataForItem(task));
          return (
            <div
              key={task.id}
              className="flex items-center justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1 text-[11.5px]"
            >
              <span className="min-w-0 truncate text-soft">{task.title}</span>
              <span className="shrink-0 text-faint">{taskDisplay.statusLabel}</span>
            </div>
          );
        })}
        {linkedTasks.length > 3 && (
          <div className="text-[11.5px] text-faint">{linkedTasks.length - 3} more linked tasks</div>
        )}
        {!linkedTasks.length && (
          <div className="rounded-sm border border-dashed hairline px-2 py-2 text-[11.5px] text-faint">
            No linked tasks yet. Open the project to create task records.
          </div>
        )}
      </div>
    </article>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border hairline bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 text-[26px] font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[12px] text-faint">{detail}</div>
    </div>
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

function getLinkedTasks(projectId: string, linkedTaskIds: string[], taskRecords: MizaanItem[]) {
  const ids = new Set(linkedTaskIds);
  return taskRecords
    .filter((task) => {
      const metadata = normalizeTaskMetadataForItem(task);
      return metadata.taskProjectId === projectId || ids.has(task.id);
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function searchableProjectText(item: MizaanItem) {
  const metadata = normalizeProjectMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.projectTitle,
    metadata.projectStatus,
    metadata.projectPriority,
    metadata.projectOwner,
    metadata.projectArea,
    metadata.projectDeadline,
    metadata.projectDescription,
    metadata.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
