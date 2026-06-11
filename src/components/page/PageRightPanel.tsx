import { Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

import { CalendarMetadataPanel } from "@/components/calendar/CalendarMetadataPanel";
import { DocumentMetadataPanel } from "@/components/documents/DocumentMetadataPanel";
import { FinanceMetadataPanel } from "@/components/finance/FinanceMetadataPanel";
import { GoalMetadataPanel } from "@/components/goals/GoalMetadataPanel";
import {
  InteractionMetadataPanel,
  PeopleMetadataPanel,
} from "@/components/people/PeopleMetadataPanel";
import {
  ProjectMetadataPanel,
  TaskMetadataPanel,
} from "@/components/projects/ProjectMetadataPanel";
import { TrackerMetadataPanel } from "@/components/trackers/TrackerMetadataPanel";
import { PageLinkedContext } from "./PageLinkedContext";
import { isDocumentRecordItem } from "@/lib/documents/document-record";
import { isFinanceRecordItem } from "@/lib/finance/finance-record";
import { isGoalRecordItem } from "@/lib/goals/goal-record";
import { isCalendarEventItem } from "@/lib/calendar/calendar-event";
import { isInteractionRecordItem } from "@/lib/people/interaction-record";
import { isPersonRecordItem } from "@/lib/people/person-record";
import { isProjectRecordItem } from "@/lib/projects/project-record";
import { isTaskRecordItem } from "@/lib/tasks/task-record";
import { isTrackerRecordItem } from "@/lib/trackers/tracker-record";
import type { PageWorkspaceModel } from "@/lib/page/page-workspace";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

type Tab = "page-data" | "relations" | "backlinks" | "outgoing" | "files" | "graph" | "history";

const tabs: { id: Tab; label: string }[] = [
  { id: "page-data", label: "Page data" },
  { id: "relations", label: "Relations" },
  { id: "backlinks", label: "Backlinks" },
  { id: "outgoing", label: "Outgoing" },
  { id: "files", label: "Files" },
  { id: "graph", label: "Local Graph" },
  { id: "history", label: "History" },
];

export function PageRightPanel({
  model,
  provider,
  items,
}: {
  model: PageWorkspaceModel;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const [tab, setTab] = useState<Tab>("page-data");
  const eligibleTargets = items
    .filter(
      (item) =>
        item.id !== model.item.id &&
        !item.archivedAt &&
        !item.deletedAt &&
        !model.outgoingLinks.some((link) => link.target.id === item.id),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 8);

  return (
    <aside className="w-full border-t hairline bg-sidebar/35 lg:w-[320px] lg:border-l lg:border-t-0">
      <div className="flex gap-1 overflow-x-auto border-b hairline p-2 lg:flex-wrap">
        {tabs.map((entry) => (
          <button
            key={entry.id}
            onClick={() => setTab(entry.id)}
            className={`rounded-sm px-2 py-1 text-[11.5px] transition-colors ${
              tab === entry.id
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-soft hover:bg-muted"
            }`}
          >
            {entry.label}
          </button>
        ))}
      </div>

      <div className="space-y-5 p-4">
        {tab === "page-data" && <PageDataPanel model={model} provider={provider} items={items} />}
        {tab === "relations" && (
          <RelationsTab model={model} provider={provider} eligibleTargets={eligibleTargets} />
        )}
        {tab === "backlinks" && (
          <PageLinkedContext
            title="Incoming relation backlinks"
            items={model.backlinks}
            direction="source"
          />
        )}
        {tab === "outgoing" && (
          <PageLinkedContext
            title="Outgoing relation links"
            items={model.outgoingLinks}
            direction="target"
          />
        )}
        {tab === "files" && <FilesTab model={model} />}
        {tab === "graph" && <GraphTab model={model} />}
        {tab === "history" && <HistoryTab />}
      </div>
    </aside>
  );
}

function CollapsibleSection({
  title,
  isOpenDefault,
  children,
}: {
  title: string;
  isOpenDefault: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(isOpenDefault);
  return (
    <div className="border-b hairline pb-3 last:border-b-0 last:pb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-1.5 text-left font-semibold text-[11px] uppercase tracking-wider text-faint hover:text-foreground transition-colors"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-3.5 w-3.5 text-soft/80" />
        ) : (
          <ChevronRight className="h-3.5 w-3.5 text-soft/80" />
        )}
      </button>
      {isOpen && <div className="mt-2 space-y-1.5 pl-1 transition-all">{children}</div>}
    </div>
  );
}

function MetadataRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  const formattedValue =
    value === undefined || value === null || value === "" ? (
      <span className="italic text-faint text-[12px]">Not set</span>
    ) : (
      value
    );

  return (
    <div className="flex items-center justify-between text-[12.5px] py-0.5">
      <span className="text-soft font-normal">{label}</span>
      <span className="text-foreground font-medium truncate max-w-[170px]" title={String(value)}>
        {formattedValue}
      </span>
    </div>
  );
}

function PageDataPanel({
  model,
  provider,
  items,
}: {
  model: PageWorkspaceModel;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const hasTags = model.item.tags && model.item.tags.length > 0;
  const [providerInfo, setProviderInfo] = useState({
    name: "Loading...",
    storageLabel: "Loading...",
  });
  useEffect(() => {
    provider.getProviderInfo().then(setProviderInfo);
  }, [provider]);

  return (
    <div className="space-y-4">
      {isDocumentRecordItem(model.item) && (
        <DocumentMetadataPanel item={model.item} provider={provider} />
      )}
      {isProjectRecordItem(model.item) && (
        <ProjectMetadataPanel item={model.item} provider={provider} items={items} />
      )}
      {isTaskRecordItem(model.item) && (
        <TaskMetadataPanel item={model.item} provider={provider} items={items} />
      )}
      {isPersonRecordItem(model.item) && (
        <PeopleMetadataPanel item={model.item} provider={provider} items={items} />
      )}
      {isInteractionRecordItem(model.item) && (
        <InteractionMetadataPanel item={model.item} provider={provider} items={items} />
      )}
      {isFinanceRecordItem(model.item) && (
        <FinanceMetadataPanel item={model.item} provider={provider} />
      )}
      {isTrackerRecordItem(model.item) && (
        <TrackerMetadataPanel item={model.item} provider={provider} />
      )}
      {isGoalRecordItem(model.item) && <GoalMetadataPanel item={model.item} provider={provider} />}
      {isCalendarEventItem(model.item) && (
        <CalendarMetadataPanel item={model.item} provider={provider} />
      )}
      {/* 1. Basic */}
      <CollapsibleSection title="Basic" isOpenDefault={true}>
        <MetadataRow label="Type" value={model.properties.type} />
        <MetadataRow label="Status" value={model.properties.status} />
        <MetadataRow label="Category" value={model.properties.category} />
        <MetadataRow label="Created" value={formatDate(model.properties.createdAt)} />
        <MetadataRow label="Updated" value={formatDate(model.properties.updatedAt)} />
      </CollapsibleSection>

      {/* 2. Tags */}
      <CollapsibleSection title="Tags" isOpenDefault={hasTags}>
        {hasTags ? (
          <div className="flex flex-wrap gap-1 py-0.5">
            {model.item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-muted/65 px-1.5 py-0.5 text-[11px] font-medium text-soft"
              >
                #{tag}
              </span>
            ))}
          </div>
        ) : (
          <div className="text-[12px] italic text-faint py-0.5">None</div>
        )}
      </CollapsibleSection>

      {/* 3. Structure */}
      <CollapsibleSection title="Structure" isOpenDefault={false}>
        <MetadataRow label="Blocks" value={String(model.properties.blocksCount)} />
        <MetadataRow label="Child pages" value={String(model.properties.childPagesCount)} />
        <MetadataRow label="Files" value={String(model.properties.attachedFilesCount)} />
      </CollapsibleSection>

      {/* 4. Links */}
      <CollapsibleSection title="Links" isOpenDefault={false}>
        <MetadataRow label="Relations" value={String(model.properties.outgoingCount)} />
        <MetadataRow label="Backlinks" value={String(model.properties.backlinksCount)} />
        <MetadataRow label="Outgoing" value={String(model.properties.outgoingCount)} />
      </CollapsibleSection>

      {/* 5. Storage */}
      <CollapsibleSection title="Storage" isOpenDefault={false}>
        <MetadataRow label="Provider" value={providerInfo.name} />
        <MetadataRow label="Storage mode" value={providerInfo.storageLabel} />
      </CollapsibleSection>
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RelationsTab({
  model,
  provider,
  eligibleTargets,
}: {
  model: PageWorkspaceModel;
  provider: VaultProvider;
  eligibleTargets: MizaanItem[];
}) {
  return (
    <section>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-faint">Relations</h3>
      <ul className="mt-2 space-y-1">
        {model.outgoingLinks.map((link) => (
          <li
            key={link.relation.id}
            className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-[12.5px] bg-muted/20"
          >
            <Link
              to="/page/$id"
              params={{ id: link.target.id }}
              className="min-w-0 flex-1 truncate hover:underline"
            >
              {link.target.title}
            </Link>
            <button
              onClick={async () => await provider.deleteRelation(link.relation.id)}
              className="rounded-sm border hairline bg-background px-1.5 py-0.5 text-[11px] text-faint hover:bg-muted hover:text-foreground transition-colors"
            >
              Remove
            </button>
          </li>
        ))}
        {!model.outgoingLinks.length && (
          <li className="rounded-sm border border-dashed hairline px-2 py-3 text-[12.5px] text-faint text-center">
            No outgoing relation records yet.
          </li>
        )}
      </ul>

      <div className="mt-4">
        <h4 className="text-[11px] font-semibold uppercase tracking-wider text-faint">
          Add relation
        </h4>
        <div className="mt-2 flex flex-wrap gap-1">
          {eligibleTargets.map((target) => (
            <button
              key={target.id}
              onClick={async () =>
                await provider.createRelation({
                  sourceId: model.item.id,
                  targetId: target.id,
                  relationType: `${model.item.type}_to_${target.type}`,
                  label: "Related",
                })
              }
              className="rounded-sm border hairline bg-background px-2 py-1 text-[11.5px] hover:bg-muted transition-colors"
            >
              {target.title}
            </button>
          ))}
          {!eligibleTargets.length && (
            <span className="text-[12px] text-faint italic">No available pages to link.</span>
          )}
        </div>
      </div>
    </section>
  );
}

function FilesTab({ model }: { model: PageWorkspaceModel }) {
  return (
    <section>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-faint">
        Linked files
      </h3>
      <ul className="mt-2 space-y-1">
        {model.attachedFiles.map((file) => (
          <li key={file.id} className="rounded-sm border hairline px-2 py-2 text-[12.5px]">
            <div>{file.name}</div>
            <div className="text-[11px] text-faint">{file.kind}</div>
          </li>
        ))}
        {!model.attachedFiles.length && (
          <li className="rounded-sm border border-dashed hairline px-2 py-3 text-[12.5px] text-faint text-center">
            No files are attached.
          </li>
        )}
      </ul>
    </section>
  );
}

function GraphTab({ model }: { model: PageWorkspaceModel }) {
  const count = model.backlinks.length + model.outgoingLinks.length + model.childPages.length;
  return (
    <section>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-faint">
        Local graph foundation
      </h3>
      <p className="mt-2 text-[12.5px] text-soft">
        This panel is relation-based only. It currently sees {count} connected page records. Full
        automatic local graph generation is not implemented yet.
      </p>
    </section>
  );
}

function HistoryTab() {
  return (
    <section>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-faint">History</h3>
      <p className="mt-2 rounded-sm border hairline bg-background/70 px-2 py-2 text-[12.5px] text-faint">
        Version history, snapshots, and restore comparison are planned after the vault storage layer
        is stronger.
      </p>
    </section>
  );
}
