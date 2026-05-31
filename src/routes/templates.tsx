import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { createPageFromTemplate, getImplementedTemplates } from "@/lib/page/page-workspace";
import { useVaultProvider } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates - Mizaan" }] }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const provider = useVaultProvider();
  const navigate = useNavigate();

  function createFromTemplate(templateId: string) {
    const item = createPageFromTemplate(provider, templateId);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Blueprints</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Templates</h1>
      <p className="mt-1 max-w-2xl text-[13.5px] text-soft">
        Templates create real local prototype pages. Editable template management is a later phase.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {getImplementedTemplates().map((template) => (
          <button
            key={template.id}
            onClick={() => createFromTemplate(template.id)}
            className="rounded-md border hairline bg-surface p-4 text-left hover:bg-muted/40"
          >
            <span className="grid h-9 w-9 place-items-center rounded-sm border hairline bg-background text-[13px]">
              {template.icon}
            </span>
            <span className="mt-3 block text-[14px] font-medium">{template.name}</span>
            <span className="mt-1 block text-[12.5px] text-faint">{template.summary}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
