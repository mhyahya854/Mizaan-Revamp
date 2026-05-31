import { Link, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Search } from "lucide-react";
import { useState } from "react";

import {
  createPageFromTemplate,
  getImplementedTemplates,
  getSpaceLabel,
} from "@/lib/page/page-workspace";
import { PageTemplatePicker } from "@/components/page/PageTemplatePicker";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { ItemCategory } from "@/lib/vault/types";

const DESCRIPTIONS: Record<ItemCategory, string> = {
  notes: "Quick captures, meeting notes, lecture notes, journals, and long-form pages.",
  documents: "Document records for files worth keeping. Import and preview arrive in later phases.",
  projects: "Long-running threads of work linked to notes, documents, and people.",
  people: "Personal profiles and relationship context, not a sales CRM.",
  finance: "Local finance records without bank sync, payment APIs, or online connections.",
  calendar: "Local calendar/event records. Full calendar engine and reminders are later phases.",
  trackers: "Habit and progress tracker pages. Full tracker engine is later.",
  databases: "Editable local table pages. Formulas, rollups, charts, and advanced views are later.",
  templates: "Page creation blueprints that create real local prototype items.",
};

export function SpacePage({ category }: { category: ItemCategory }) {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const q = query.trim().toLowerCase();
  const items = snapshot.items
    .filter((item) => item.category === category && !item.archivedAt && !item.deletedAt)
    .filter(
      (item) =>
        !q || item.title.toLowerCase().includes(q) || item.tags.join(" ").toLowerCase().includes(q),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const templates = getImplementedTemplates().filter((template) => template.category === category);

  function createPage() {
    setTemplatePickerOpen(true);
  }

  function applyTemplate(templateId: string) {
    const item = createPageFromTemplate(provider, templateId, { category });
    navigate({ to: "/page/$id", params: { id: item.id } });
    setTemplatePickerOpen(false);
  }

  return (
    <div className="mx-auto w-full max-w-[1100px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Space</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">
            {getSpaceLabel(category)}
          </h1>
          <p className="mt-1 max-w-2xl text-[13.5px] text-soft">{DESCRIPTIONS[category]}</p>
        </div>
        <button
          onClick={createPage}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New {singularLabel(category)}
        </button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${getSpaceLabel(category).toLowerCase()}`}
            className="w-48 bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="rounded-sm border-b-2 border-foreground px-2 py-1 text-foreground -mb-[9px] pb-[9px]">
          All pages
        </span>
        <span className="text-faint">{items.length} local items</span>
      </div>

      {templates.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">Templates</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => applyTemplate(template.id)}
                className="rounded-sm border hairline bg-surface px-3 py-2 text-left hover:bg-muted/40"
              >
                <span className="block text-[13px] text-foreground">{template.name}</span>
                <span className="block max-w-[220px] truncate text-[11.5px] text-faint">
                  {template.summary}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <table className="mt-5 w-full border-collapse text-[13.5px]">
        <thead className="text-[11px] uppercase tracking-wider text-faint">
          <tr className="border-b hairline">
            <th className="py-2 text-left font-medium">Title</th>
            <th className="hidden py-2 text-left font-medium sm:table-cell">Status</th>
            <th className="hidden py-2 text-left font-medium md:table-cell">Tags</th>
            <th className="py-2 text-right font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b hairline hover:bg-muted/40">
              <td className="py-2.5">
                <Link
                  to="/page/$id"
                  params={{ id: item.id }}
                  className="flex min-w-0 items-center gap-2"
                >
                  <span className="grid h-6 w-6 place-items-center rounded-sm border hairline text-[12px]">
                    {item.icon}
                  </span>
                  <span className="min-w-0 truncate text-foreground">{item.title}</span>
                </Link>
              </td>
              <td className="hidden py-2.5 text-soft sm:table-cell">
                {item.status ?? "No status"}
              </td>
              <td className="hidden py-2.5 text-faint md:table-cell">
                {item.tags.length ? item.tags.join(", ") : "No tags"}
              </td>
              <td className="py-2.5 text-right text-faint">{formatDate(item.updatedAt)}</td>
            </tr>
          ))}
          {!items.length && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-[13px] text-faint">
                No local pages here yet. Use the New action or a template to create a real item.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <PageTemplatePicker
        open={templatePickerOpen}
        category={category}
        items={snapshot.items}
        onClose={() => setTemplatePickerOpen(false)}
        onSelect={applyTemplate}
      />
    </div>
  );
}

function singularLabel(category: ItemCategory) {
  const labels: Record<ItemCategory, string> = {
    notes: "note",
    documents: "document",
    projects: "project",
    people: "person",
    finance: "finance record",
    calendar: "event",
    trackers: "tracker",
    databases: "database",
    templates: "template",
  };
  return labels[category];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
