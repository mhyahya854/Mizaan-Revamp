import { X } from "lucide-react";

import {
  getImplementedTemplates,
  getSpaceLabel,
  getTemplatesForCategory,
} from "@/lib/page/page-workspace";
import type { ItemCategory, MizaanItem } from "@/lib/vault/types";

export function PageTemplatePicker({
  open,
  category,
  items,
  title = "Choose a template",
  onClose,
  onSelect,
}: {
  open: boolean;
  category?: ItemCategory;
  items: MizaanItem[];
  title?: string;
  onClose: () => void;
  onSelect: (templateId: string) => void;
}) {
  if (!open) return null;

  const recentlyUsedIds = items
    .filter((item) => typeof item.metadata.templateId === "string")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .map((item) => String(item.metadata.templateId));
  const recentTemplates = unique(recentlyUsedIds)
    .flatMap((id) => getImplementedTemplates().filter((template) => template.id === id))
    .slice(0, 4);
  const relevantTemplates = getTemplatesForCategory(category);
  const otherTemplates = getImplementedTemplates().filter(
    (template) =>
      !relevantTemplates.some((entry) => entry.id === template.id) &&
      !recentTemplates.some((entry) => entry.id === template.id),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[10vh]">
      <button className="absolute inset-0 bg-foreground/15" onClick={onClose} aria-label="Close" />
      <div className="relative max-h-[78vh] w-full max-w-[720px] overflow-hidden rounded-md border hairline bg-popover shadow-2xl">
        <header className="flex items-start justify-between gap-3 border-b hairline px-4 py-3">
          <div>
            <h2 className="font-editorial text-[22px]">{title}</h2>
            <p className="mt-1 text-[12.5px] text-faint">
              Every new Mizaan page starts from a local template, including a blank page.
            </p>
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-sm text-faint hover:bg-muted hover:text-foreground"
            aria-label="Close template picker"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="max-h-[62vh] overflow-y-auto p-4">
          {recentTemplates.length > 0 && (
            <TemplateSection
              title="Recently used"
              templates={recentTemplates}
              onSelect={onSelect}
            />
          )}
          <TemplateSection
            title={category ? `${getSpaceLabel(category)} templates` : "Templates"}
            templates={relevantTemplates}
            onSelect={onSelect}
          />
          {otherTemplates.length > 0 && (
            <TemplateSection
              title="Other templates"
              templates={otherTemplates}
              onSelect={onSelect}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function TemplateSection({
  title,
  templates,
  onSelect,
}: {
  title: string;
  templates: ReturnType<typeof getImplementedTemplates>;
  onSelect: (templateId: string) => void;
}) {
  return (
    <section className="mb-5 last:mb-0">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-faint">{title}</h3>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="flex items-start gap-3 rounded-md border hairline bg-surface px-3 py-3 text-left hover:bg-muted/40"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline bg-background text-[13px]">
              {template.icon}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13.5px] font-medium">{template.name}</span>
              <span className="mt-0.5 block line-clamp-2 text-[12px] text-faint">
                {template.summary}
              </span>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

function unique(values: string[]) {
  return values.filter((value, index) => values.indexOf(value) === index);
}

