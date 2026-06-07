import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Search, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { createPageFromTemplate, getImplementedTemplates } from "@/lib/page/page-workspace";
import {
  isInteractionRecordItem,
  normalizeInteractionMetadataForItem,
} from "@/lib/people/interaction-record";
import {
  createPersonRecordInput,
  getPersonDisplayFields,
  getPersonPrivacySummary,
  isPersonRecordItem,
  normalizePersonMetadataForItem,
} from "@/lib/people/person-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/people")({
  head: () => ({ meta: [{ title: "People - Mizaan" }] }),
  component: PeoplePage,
});

const PEOPLE_TEMPLATE_IDS = [
  "person-profile",
  "relationship-notes",
  "contact-context",
  "follow-up-note",
  "interaction-log",
];

function PeoplePage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const peopleSpace = snapshot.items.find(
    (item) =>
      item.category === "people" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const interactionRecords = useMemo(
    () =>
      snapshot.items.filter(
        (item) => isInteractionRecordItem(item) && !item.archivedAt && !item.deletedAt,
      ),
    [snapshot.items],
  );
  const personRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isPersonRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchablePersonText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );
  const templates = getImplementedTemplates().filter((template) =>
    PEOPLE_TEMPLATE_IDS.includes(template.id),
  );
  const followUpCount = personRecords.filter((item) => {
    const metadata = normalizePersonMetadataForItem(item);
    return Boolean(metadata.nextFollowUpDate) || metadata.followUpStatus !== "none";
  }).length;
  const privateFlagCount = personRecords.filter((item) => {
    const metadata = normalizePersonMetadataForItem(item);
    return metadata.private || metadata.sensitive;
  }).length;

  async function createPerson() {
    const item = await provider.createItem(
      createPersonRecordInput({
        parentId: peopleSpace?.id,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: "Relationship context" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "Private and sensitive flags are metadata only. App lock, encryption, imports, and sync are future phases.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  async function createFromTemplate(templateId: string) {
    const item = createPageFromTemplate(provider, templateId, {
      parentId: templateId === "interaction-log" ? undefined : peopleSpace?.id,
    });
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Local people records</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">People</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            People are provider-backed local person records in the browser/localStorage prototype.
            This is relationship context, not Google Contacts, cloud CRM, team CRM, contact import,
            sync, app lock, or encrypted private storage.
          </p>
        </div>
        <button
          onClick={createPerson}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New person
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <StatCard label="People" value={String(personRecords.length)} detail="real records" />
        <StatCard
          label="Interactions"
          value={String(interactionRecords.length)}
          detail="real local items"
        />
        <StatCard label="Follow-ups" value={String(followUpCount)} detail="metadata fields" />
        <StatCard label="Private flags" value={String(privateFlagCount)} detail="metadata only" />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <Users className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current people truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Records persist through `VaultProvider` item metadata. Counts come only from local
              provider items. Private/sensitive flags do not encrypt, lock, hide from search, or
              hide from graph in this phase.
            </p>
          </div>
        </div>
      </section>

      {templates.length > 0 && (
        <section className="mt-5">
          <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">
            People templates
          </h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
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
            placeholder="Search people, relationship, organization, follow-up"
            className="w-72 bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="-mb-[9px] rounded-sm border-b-2 border-foreground px-2 py-1 pb-[9px] text-foreground">
          Person records
        </span>
        <span className="text-faint">{personRecords.length} local records</span>
      </div>

      {personRecords.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {personRecords.map((item) => (
            <PersonCard
              key={item.id}
              item={item}
              interactionCount={countPersonInteractions(item.id, interactionRecords)}
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No person records yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a provider-backed person record now. Import/sync, Google Contacts, email/message
            capture, encrypted private contacts, reminders, relationship analytics, and mobile
            capture are intentionally not shown as working controls in this phase.
          </p>
          <button
            onClick={createPerson}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New person
          </button>
        </div>
      )}
    </div>
  );
}

function PersonCard({ item, interactionCount }: { item: MizaanItem; interactionCount: number }) {
  const metadata = normalizePersonMetadataForItem(item);
  const display = getPersonDisplayFields(metadata);
  const privacy = getPersonPrivacySummary(metadata);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "U"}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="block truncate text-[15px] font-medium hover:underline"
          >
            {display.displayName}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-soft">
            {metadata.context || metadata.notes || item.summary || "Provider-backed person record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.relationshipTypeLabel}</Badge>
        <Badge>{display.relationshipStatusLabel}</Badge>
        <Badge>{display.preferredContactMethodLabel}</Badge>
        {display.nextFollowUpDate && <Badge>Follow up {display.nextFollowUpDate}</Badge>}
        {metadata.private && <Badge>Private metadata</Badge>}
        {metadata.sensitive && <Badge>Sensitive metadata</Badge>}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Known from" value={display.whereKnownFrom || "Not set"} />
        <Meta label="Organization" value={display.organization || "Not set"} />
        <Meta label="Role" value={display.roleTitle || "Not set"} />
        <Meta label="Interactions" value={String(interactionCount)} />
        <Meta
          label="Links"
          value={`P${display.projectCount} / T${display.taskCount} / D${display.documentCount}`}
        />
        <Meta
          label="Privacy"
          value={privacy.private || privacy.sensitive ? "Flagged only" : "Not flagged"}
        />
      </dl>

      <div className="mt-3 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        Privacy flags are metadata only. This record is still visible to the current search and
        graph foundations unless a later privacy/app-lock phase implements real hiding.
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

function countPersonInteractions(personId: string, interactions: MizaanItem[]) {
  return interactions.filter((interaction) => {
    const metadata = normalizeInteractionMetadataForItem(interaction);
    return metadata.personId === personId || interaction.parentId === personId;
  }).length;
}

function searchablePersonText(item: MizaanItem) {
  const metadata = normalizePersonMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.displayName,
    metadata.legalName,
    metadata.preferredName,
    metadata.aliases.join(" "),
    metadata.relationshipType,
    metadata.relationshipStatus,
    metadata.whereKnownFrom,
    metadata.organization,
    metadata.roleTitle,
    metadata.locationNote,
    metadata.primaryEmail,
    metadata.primaryPhone,
    metadata.preferredContactMethod,
    metadata.nextFollowUpDate,
    metadata.followUpStatus,
    metadata.notes,
    metadata.context,
    metadata.boundaries,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


