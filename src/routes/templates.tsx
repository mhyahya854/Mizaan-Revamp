import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Search } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import {
  createItemFromTemplate,
  getAllTemplates,
  getTemplateCategoryCounts,
  getTemplatePreview,
  getTemplateSearchText,
  getTemplateStatusCounts,
  type TemplateCategory,
  type TemplateDefinition,
  type TemplatePreview,
  type TemplateStatus,
} from "@/lib/templates/template-registry";
import { useVaultProvider } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates - Mizaan" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const provider = useVaultProvider();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | TemplateCategory>("all");
  const [status, setStatus] = useState<"all" | TemplateStatus>("all");
  const templates = useMemo(() => getAllTemplates(), []);
  const categoryCounts = useMemo(() => getTemplateCategoryCounts(templates), [templates]);
  const statusCounts = useMemo(() => getTemplateStatusCounts(templates), [templates]);
  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((template) => {
      if (category !== "all" && template.category !== category) return false;
      if (status !== "all" && template.status !== status) return false;
      return q ? getTemplateSearchText(template).includes(q) : true;
    });
  }, [category, query, status, templates]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(() => templates[0]?.id ?? "");
  const selectedTemplate =
    filteredTemplates.find((template) => template.id === selectedTemplateId) ??
    filteredTemplates[0] ??
    templates.find((template) => template.id === selectedTemplateId) ??
    templates[0];
  const preview = selectedTemplate ? getTemplatePreview(selectedTemplate) : undefined;

  async function createFromTemplate(templateId: string) {
    const item = await createItemFromTemplate(provider, templateId);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 pb-24 pt-10 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Creation registry</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Templates</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Built-in templates create provider-backed local records in the current
            browser/localStorage prototype. Partial and future entries are visible but cannot create
            records.
          </p>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center text-[11.5px]">
          <Metric label="All" value={statusCounts.total} />
          <Metric label="Ready" value={statusCounts.implemented} />
          <Metric label="Partial" value={statusCounts.partial} />
          <Metric label="Future" value={statusCounts.future} />
        </div>
      </header>

      <section className="mt-6 grid gap-2 lg:grid-cols-[1fr_auto]">
        <label className="flex min-w-0 items-center gap-2 rounded-md border hairline bg-surface px-3 py-2">
          <Search className="h-4 w-4 shrink-0 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search templates, metadata defaults, limitations"
            className="h-8 min-w-0 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-faint"
          />
        </label>
        <div className="flex flex-wrap gap-1 rounded-md border hairline bg-surface p-1 text-[12px]">
          {(["all", "implemented", "partial", "future"] as Array<"all" | TemplateStatus>).map(
            (entry) => (
              <button
                key={entry}
                onClick={() => setStatus(entry)}
                className={`rounded-sm px-2.5 py-1 capitalize ${
                  status === entry ? "bg-foreground text-background" : "text-soft hover:bg-muted"
                }`}
              >
                {entry === "implemented" ? "ready" : entry}
              </button>
            ),
          )}
        </div>
      </section>

      <div className="mt-3 flex gap-1.5 overflow-x-auto pb-1 text-[12px] scrollbar-thin">
        <CategoryButton
          active={category === "all"}
          label="All"
          count={templates.length}
          onClick={() => setCategory("all")}
        />
        {(Object.keys(categoryCounts).sort() as TemplateCategory[]).map((entry) => (
          <CategoryButton
            key={entry}
            active={category === entry}
            label={categoryLabel(entry)}
            count={categoryCounts[entry]}
            onClick={() => setCategory(entry)}
          />
        ))}
      </div>

      <main className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3 text-[12px] text-faint">
            <span>{filteredTemplates.length} templates</span>
            <button
              onClick={() => {
                setQuery("");
                setCategory("all");
                setStatus("all");
              }}
              className="rounded-sm border hairline px-2 py-1 hover:bg-muted hover:text-foreground"
            >
              Clear
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                selected={template.id === selectedTemplate.id}
                onSelect={() => setSelectedTemplateId(template.id)}
              />
            ))}
          </div>
          {!filteredTemplates.length && (
            <div className="rounded-md border border-dashed hairline bg-surface px-5 py-10 text-center text-[13px] text-faint">
              No templates match the current filters.
            </div>
          )}
        </section>

        {preview && (
          <TemplatePreviewPanel preview={preview} onCreate={() => createFromTemplate(preview.id)} />
        )}
      </main>
    </div>
  );
}

function TemplateCard({
  template,
  selected,
  onSelect,
}: {
  template: TemplateDefinition;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={`rounded-md border hairline bg-surface p-4 text-left transition-colors hover:bg-muted/40 ${
        selected ? "ring-1 ring-foreground" : ""
      }`}
    >
      <span className="flex items-start justify-between gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background text-[13px]">
          {template.icon}
        </span>
        <StatusBadge status={template.status} />
      </span>
      <span className="mt-3 block truncate text-[14px] font-medium">{template.name}</span>
      <span className="mt-1 block line-clamp-2 text-[12.5px] leading-relaxed text-faint">
        {template.summary}
      </span>
      <span className="mt-3 flex flex-wrap gap-1 text-[10.5px]">
        <span className="rounded-full bg-muted px-2 py-0.5 text-soft">
          {categoryLabel(template.category)}
        </span>
        <span className="rounded-full bg-muted px-2 py-0.5 text-soft">
          {template.targetItemType}
        </span>
      </span>
    </button>
  );
}

function TemplatePreviewPanel({
  preview,
  onCreate,
}: {
  preview: TemplatePreview;
  onCreate: () => void;
}) {
  const metadataEntries = Object.entries(preview.metadata).slice(0, 9);
  const propertyEntries = Object.entries(preview.properties).slice(0, 6);

  return (
    <aside className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wider text-faint">Preview</p>
          <h2 className="mt-1 truncate text-[18px] font-semibold">{preview.name}</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-soft">{preview.description}</p>
        </div>
        <StatusBadge status={preview.status} />
      </div>

      <button
        onClick={onCreate}
        disabled={!preview.canCreate}
        className={`mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-[12.5px] font-medium ${
          preview.canCreate
            ? "bg-foreground text-background hover:opacity-90"
            : "cursor-not-allowed border hairline text-faint"
        }`}
      >
        <FilePlus2 className="h-3.5 w-3.5" />
        {preview.canCreate ? "Create from template" : "Not available"}
      </button>

      <div className="mt-4 grid gap-2 text-[12px]">
        <Meta
          label="Output"
          value={`${categoryLabel(preview.category)} / ${preview.targetItemType}`}
        />
        <Meta label="Title" value={preview.title} />
        <Meta label="Starter blocks" value={String(preview.blockCount)} />
        <Meta label="Tags" value={preview.tags.length ? preview.tags.join(", ") : "None"} />
      </div>

      {propertyEntries.length > 0 && (
        <PreviewSection title="Properties">
          {propertyEntries.map(([key, value]) => (
            <Meta key={key} label={key} value={formatValue(value)} />
          ))}
        </PreviewSection>
      )}

      {metadataEntries.length > 0 && (
        <PreviewSection title="Metadata Defaults">
          {metadataEntries.map(([key, value]) => (
            <Meta key={key} label={key} value={formatValue(value)} />
          ))}
        </PreviewSection>
      )}

      {preview.limitations.length > 0 && (
        <PreviewSection title="Limitations">
          <ul className="space-y-1.5 text-[12px] leading-relaxed text-faint">
            {preview.limitations.map((limitation) => (
              <li key={limitation}>{limitation}</li>
            ))}
          </ul>
        </PreviewSection>
      )}
    </aside>
  );
}

function PreviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4 border-t hairline pt-3">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-faint">{title}</h3>
      <div className="mt-2 grid gap-1.5">{children}</div>
    </section>
  );
}

function CategoryButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-sm border hairline px-2.5 py-1 ${
        active ? "bg-foreground text-background" : "bg-surface text-soft hover:bg-muted"
      }`}
    >
      {label} <span className="opacity-70">{count}</span>
    </button>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border hairline bg-surface px-3 py-2">
      <div className="text-[18px] font-semibold leading-none">{value}</div>
      <div className="mt-1 text-faint">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: TemplateStatus }) {
  const label = status === "implemented" ? "Ready" : status === "partial" ? "Partial" : "Future";
  return (
    <span className="rounded-full border hairline bg-background px-2 py-0.5 text-[10.5px] capitalize text-faint">
      {label}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <span className="block truncate text-faint">{label}</span>
      <span className="block truncate text-soft">{value}</span>
    </div>
  );
}

function categoryLabel(category: TemplateCategory) {
  const labels: Record<TemplateCategory, string> = {
    notes: "Notes",
    documents: "Documents",
    projects: "Projects",
    tasks: "Tasks",
    people: "People",
    finance: "Finance",
    calendar: "Calendar",
    trackers: "Trackers",
    goals: "Goals",
    databases: "Databases",
    templates: "Templates",
  };
  return labels[category];
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) return value.length ? value.join(", ") : "None";
  if (value === null || value === undefined || value === "") return "None";
  if (typeof value === "object") return "Object";
  return String(value);
}
