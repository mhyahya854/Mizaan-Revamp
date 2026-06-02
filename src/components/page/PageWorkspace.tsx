import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useRightPanel } from "@/hooks/use-right-panel";

import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { PageEditorSurface } from "./PageEditorSurface";
import { PageHeader } from "./PageHeader";
import { PageRightPanel } from "./PageRightPanel";
import { PageSubpages } from "./PageSubpages";
import { DatabaseTable } from "@/components/database/DatabaseTable";
import { buildPageWorkspaceModel, createPageFromTemplate } from "@/lib/page/page-workspace";
import {
  isVaultSnapshotHydrating,
  useVaultProvider,
  useVaultSnapshot,
} from "@/lib/vault/use-vault";
import { PageTemplatePicker } from "./PageTemplatePicker";
import {
  isDocumentRecordItem,
  normalizeDocumentMetadataForItem,
  updateDocumentMetadata,
} from "@/lib/documents/document-record";
import {
  isProjectRecordItem,
  normalizeProjectMetadataForItem,
  updateProjectMetadata,
} from "@/lib/projects/project-record";
import {
  isTaskRecordItem,
  normalizeTaskMetadataForItem,
  updateTaskMetadata,
} from "@/lib/tasks/task-record";
import {
  isPersonRecordItem,
  normalizePersonMetadataForItem,
  updatePersonMetadata,
} from "@/lib/people/person-record";
import {
  isInteractionRecordItem,
  normalizeInteractionMetadataForItem,
  updateInteractionMetadata,
} from "@/lib/people/interaction-record";
import {
  isFinanceRecordItem,
  normalizeFinanceMetadataForItem,
  updateFinanceMetadata,
} from "@/lib/finance/finance-record";

export function PageWorkspace({ itemId }: { itemId: string }) {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const model = buildPageWorkspaceModel(provider, itemId, snapshot);
  const [draftTitle, setDraftTitle] = useState(model.item.title);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);
  const { isRightPanelOpen } = useRightPanel();

  useEffect(() => {
    setDraftTitle(model.item.title);
  }, [model.item.title]);

  function updateTitle(title: string) {
    const nextTitle = title || "Untitled";
    setDraftTitle(title);
    if (model.state !== "ready") return;

    if (isDocumentRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updateDocumentMetadata(normalizeDocumentMetadataForItem(model.item), {
          documentTitle: nextTitle,
        }),
      });
      return;
    }

    if (isProjectRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updateProjectMetadata(normalizeProjectMetadataForItem(model.item), {
          projectTitle: nextTitle,
        }),
      });
      return;
    }

    if (isTaskRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updateTaskMetadata(normalizeTaskMetadataForItem(model.item), {
          taskTitle: nextTitle,
        }),
      });
      return;
    }

    if (isPersonRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updatePersonMetadata(normalizePersonMetadataForItem(model.item), {
          displayName: nextTitle,
        }),
      });
      return;
    }

    if (isInteractionRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updateInteractionMetadata(normalizeInteractionMetadataForItem(model.item), {
          interactionTitle: nextTitle,
        }),
      });
      return;
    }

    if (isFinanceRecordItem(model.item)) {
      provider.updateItem(model.item.id, {
        title: nextTitle,
        metadata: updateFinanceMetadata(normalizeFinanceMetadataForItem(model.item), {
          financeTitle: nextTitle,
        }),
      });
      return;
    }

    provider.updateItem(model.item.id, { title: nextTitle });
  }

  function handleCreateChild() {
    setTemplatePickerOpen(true);
  }

  function createChildFromTemplate(templateId: string) {
    const child = createPageFromTemplate(provider, templateId, {
      category: model.item.category,
      parentId: model.item.id,
    });
    navigate({ to: "/page/$id", params: { id: child.id } });
    setTemplatePickerOpen(false);
  }

  if (isVaultSnapshotHydrating(snapshot)) {
    return (
      <div className="mx-auto w-full max-w-[760px] px-6 pt-12 md:px-10">
        <div className="rounded-md border hairline bg-surface p-6 text-[13.5px] text-soft">
          Loading the local prototype vault...
        </div>
      </div>
    );
  }

  if (model.state === "missing") {
    return (
      <div className="mx-auto w-full max-w-[760px] px-6 pt-12 md:px-10">
        <PageBreadcrumbs breadcrumbs={model.breadcrumbs} />
        <div className="mt-8 rounded-md border hairline bg-surface p-6">
          <h1 className="font-editorial text-[30px]">Page not found</h1>
          <p className="mt-2 text-[13.5px] text-soft">
            This item is not present in the active prototype vault. It may have been removed, or
            this route may refer to older local data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col lg:flex-row">
      <article className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[820px] px-6 pb-24 pt-8 md:px-12">
          <PageBreadcrumbs breadcrumbs={model.breadcrumbs} />
          <PageHeader
            model={model}
            title={draftTitle}
            onTitleChange={updateTitle}
            onCreateChild={handleCreateChild}
            onArchive={() => provider.archiveItem(model.item.id)}
            onRestore={() => provider.restoreItem(model.item.id)}
          />
          {model.item.type === "database" ? (
            <DatabaseTable item={model.item} provider={provider} />
          ) : (
            <PageEditorSurface itemId={model.item.id} blocks={model.blocks} provider={provider} />
          )}
          <PageSubpages model={model} onCreateChild={handleCreateChild} />
          <div className="mt-8 rounded-md border hairline bg-surface-muted/60 px-3 py-2 text-[12px] text-faint">
            {model.providerWarning}
          </div>
        </div>
      </article>
      {isRightPanelOpen && (
        <PageRightPanel model={model} provider={provider} items={snapshot.items} />
      )}
      <PageTemplatePicker
        open={templatePickerOpen}
        category={model.item.category}
        items={snapshot.items}
        title="Create child page"
        onClose={() => setTemplatePickerOpen(false)}
        onSelect={createChildFromTemplate}
      />
    </div>
  );
}
