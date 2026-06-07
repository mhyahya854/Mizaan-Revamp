import { AlertTriangle, Plus } from "lucide-react";

import {
  FOLLOW_UP_STATUS_VALUES,
  PERSON_RELATIONSHIP_STATUS_VALUES,
  PERSON_RELATIONSHIP_TYPE_VALUES,
  PREFERRED_CONTACT_METHOD_VALUES,
  getFollowUpStatusLabel,
  getPersonDisplayFields,
  getPersonPrivacySummary,
  getPersonStateSummary,
  getPreferredContactMethodLabel,
  getRelationshipStatusLabel,
  getRelationshipTypeLabel,
  normalizePersonMetadataForItem,
  updatePersonMetadata,
  type FollowUpStatus,
  type PersonRelationshipStatus,
  type PersonRelationshipType,
  type PreferredContactMethod,
} from "@/lib/people/person-record";
import {
  INTERACTION_STATUS_VALUES,
  INTERACTION_TYPE_VALUES,
  createInteractionRecordInput,
  getInteractionDisplayFields,
  getInteractionStateSummary,
  getInteractionStatusLabel,
  getInteractionTypeLabel,
  isInteractionRecordItem,
  normalizeInteractionMetadataForItem,
  updateInteractionMetadata,
  type InteractionStatus,
  type InteractionType,
} from "@/lib/people/interaction-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function PeopleMetadataPanel({
  item,
  provider,
  items,
}: {
  item: MizaanItem;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const metadata = normalizePersonMetadataForItem(item);
  const display = getPersonDisplayFields(metadata);
  const summary = getPersonStateSummary(metadata);
  const privacy = getPersonPrivacySummary(metadata);
  const interactions = getLinkedInteractions(item.id, items);

  async function persist(patch: Record<string, unknown>) {
    const next = updatePersonMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.displayName || "Untitled person",
      status: getRelationshipStatusLabel(next.relationshipStatus),
      summary: next.context || next.notes || item.summary,
      properties: {
        relationshipType: getRelationshipTypeLabel(next.relationshipType),
        relationshipStatus: getRelationshipStatusLabel(next.relationshipStatus),
        whereKnownFrom: next.whereKnownFrom,
        organization: next.organization,
        roleTitle: next.roleTitle,
        nextFollowUpDate: next.nextFollowUpDate,
        private: next.private,
        sensitive: next.sensitive,
      },
      metadata: next,
    });
  }

  async function createLinkedInteraction() {
    const interaction = await provider.createItem(
      createInteractionRecordInput({
        title: "Interaction note",
        type: "note",
        status: "logged",
        personId: item.id,
      }),
    );
    await provider.replaceBlocks(interaction.id, [
      { type: "heading1", content: "Interaction summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a real local interaction record. Email, calendar reminders, imports, and automatic capture are not implemented.",
      },
    ]);
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          U
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Person metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed person record. Private and sensitive flags are metadata only.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Display name"
          value={metadata.displayName}
          onChange={(value) => persist({ displayName: value })}
        />
        <TextField
          label="Legal name"
          value={metadata.legalName}
          onChange={(value) => persist({ legalName: value })}
        />
        <TextField
          label="Preferred name"
          value={metadata.preferredName}
          onChange={(value) => persist({ preferredName: value })}
        />
        <TextField
          label="Aliases"
          value={metadata.aliases.join(", ")}
          onChange={(value) => persist({ aliases: splitCsv(value) })}
          placeholder="Comma-separated names"
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Relationship"
            value={metadata.relationshipType}
            options={PERSON_RELATIONSHIP_TYPE_VALUES.map((value) => ({
              value,
              label: getRelationshipTypeLabel(value),
            }))}
            onChange={(value) => persist({ relationshipType: value as PersonRelationshipType })}
          />
          <SelectField
            label="Status"
            value={metadata.relationshipStatus}
            options={PERSON_RELATIONSHIP_STATUS_VALUES.map((value) => ({
              value,
              label: getRelationshipStatusLabel(value),
            }))}
            onChange={(value) => persist({ relationshipStatus: value as PersonRelationshipStatus })}
          />
        </div>
        <TextField
          label="Where known from"
          value={metadata.whereKnownFrom}
          onChange={(value) => persist({ whereKnownFrom: value })}
          placeholder="School, work, family, community"
        />
        <TextField
          label="Organization"
          value={metadata.organization}
          onChange={(value) => persist({ organization: value })}
        />
        <TextField
          label="Role/title"
          value={metadata.roleTitle}
          onChange={(value) => persist({ roleTitle: value })}
        />
        <TextField
          label="Location note"
          value={metadata.locationNote}
          onChange={(value) => persist({ locationNote: value })}
        />
        <SelectField
          label="Preferred contact"
          value={metadata.preferredContactMethod}
          options={PREFERRED_CONTACT_METHOD_VALUES.map((value) => ({
            value,
            label: getPreferredContactMethodLabel(value),
          }))}
          onChange={(value) => persist({ preferredContactMethod: value as PreferredContactMethod })}
        />
        <TextField
          label="Email"
          value={metadata.primaryEmail}
          onChange={(value) => persist({ primaryEmail: value })}
        />
        <TextField
          label="Phone"
          value={metadata.primaryPhone}
          onChange={(value) => persist({ primaryPhone: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Last interaction"
            value={metadata.lastInteractionDate}
            onChange={(value) => persist({ lastInteractionDate: value })}
            type="date"
          />
          <TextField
            label="Next follow-up"
            value={metadata.nextFollowUpDate}
            onChange={(value) => persist({ nextFollowUpDate: value })}
            type="date"
          />
        </div>
        <SelectField
          label="Follow-up status"
          value={metadata.followUpStatus}
          options={FOLLOW_UP_STATUS_VALUES.map((value) => ({
            value,
            label: getFollowUpStatusLabel(value),
          }))}
          onChange={(value) => persist({ followUpStatus: value as FollowUpStatus })}
        />
        <TextField
          label="Birthday"
          value={metadata.birthday}
          onChange={(value) => persist({ birthday: value })}
          type="date"
        />
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
          placeholder="Relationship notes"
        />
        <TextareaField
          label="Context"
          value={metadata.context}
          onChange={(value) => persist({ context: value })}
          placeholder="Background/context"
        />
        <TextareaField
          label="Boundaries"
          value={metadata.boundaries}
          onChange={(value) => persist({ boundaries: value })}
          placeholder="Boundaries, preferences, or reminders"
        />
        <div className="grid gap-2">
          <CheckboxField
            label="Private metadata flag"
            checked={metadata.private}
            onChange={(value) => persist({ private: value })}
          />
          <CheckboxField
            label="Sensitive metadata flag"
            checked={metadata.sensitive}
            onChange={(value) => persist({ sensitive: value })}
          />
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Relationship" value={display.relationshipTypeLabel} />
        <StateRow label="Status" value={display.relationshipStatusLabel} />
        <StateRow label="Follow-up" value={summary.followUpStatusLabel} />
        <StateRow label="Projects" value={String(display.projectCount)} />
        <StateRow label="Tasks" value={String(display.taskCount)} />
        <StateRow label="Documents" value={String(display.documentCount)} />
        <StateRow label="Finance" value={String(display.financeCount)} />
        <StateRow label="Interactions" value={String(interactions.length)} />
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-faint">
            Interactions
          </h4>
          <button
            onClick={createLinkedInteraction}
            className="inline-flex items-center gap-1 rounded-sm border hairline bg-background px-2 py-1 text-[11.5px] hover:bg-muted"
          >
            <Plus className="h-3 w-3" />
            New interaction
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {interactions.map((interaction) => (
            <InteractionInlineEditor
              key={interaction.id}
              interaction={interaction}
              personId={item.id}
              provider={provider}
            />
          ))}
          {!interactions.length && (
            <div className="rounded-sm border border-dashed hairline px-2 py-3 text-center text-[12px] text-faint">
              No interaction records yet.
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/35 px-2 py-2 text-[11.5px] leading-relaxed text-soft">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>{privacy.message}</span>
      </div>
    </section>
  );
}

export function InteractionMetadataPanel({
  item,
  provider,
  items,
}: {
  item: MizaanItem;
  provider: VaultProvider;
  items: MizaanItem[];
}) {
  const metadata = normalizeInteractionMetadataForItem(item);
  const display = getInteractionDisplayFields(metadata);
  const summary = getInteractionStateSummary(metadata);
  const person = metadata.personId
    ? items.find((entry) => entry.id === metadata.personId)
    : undefined;

  async function persist(patch: Record<string, unknown>) {
    const next = updateInteractionMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.interactionTitle || "Untitled interaction",
      status: getInteractionStatusLabel(next.interactionStatus),
      parentId: next.personId || undefined,
      summary: next.summary || next.notes || item.summary,
      properties: {
        interactionType: getInteractionTypeLabel(next.interactionType),
        interactionStatus: getInteractionStatusLabel(next.interactionStatus),
        personId: next.personId,
        interactionDate: next.interactionDate,
        followUpNeeded: next.followUpNeeded,
        followUpDate: next.followUpDate,
        private: next.private,
        sensitive: next.sensitive,
      },
      metadata: next,
    });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <h3 className="text-[12.5px] font-semibold text-foreground">Interaction metadata</h3>
      <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
        Provider-backed interaction item linked to a person record when `personId` is set.
      </p>
      <div className="mt-3 space-y-2.5">
        <TextField
          label="Interaction title"
          value={metadata.interactionTitle}
          onChange={(value) => persist({ interactionTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Type"
            value={metadata.interactionType}
            options={INTERACTION_TYPE_VALUES.map((value) => ({
              value,
              label: getInteractionTypeLabel(value),
            }))}
            onChange={(value) => persist({ interactionType: value as InteractionType })}
          />
          <SelectField
            label="Status"
            value={metadata.interactionStatus}
            options={INTERACTION_STATUS_VALUES.map((value) => ({
              value,
              label: getInteractionStatusLabel(value),
            }))}
            onChange={(value) => persist({ interactionStatus: value as InteractionStatus })}
          />
        </div>
        <TextField
          label="Date"
          value={metadata.interactionDate}
          onChange={(value) => persist({ interactionDate: value })}
          type="date"
        />
        <TextareaField
          label="Summary"
          value={metadata.summary}
          onChange={(value) => persist({ summary: value })}
        />
        <CheckboxField
          label="Follow-up needed"
          checked={metadata.followUpNeeded}
          onChange={(value) => persist({ followUpNeeded: value })}
        />
        <TextField
          label="Follow-up date"
          value={metadata.followUpDate}
          onChange={(value) => persist({ followUpDate: value })}
          type="date"
        />
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
        />
      </div>
      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Person" value={person?.title ?? (display.personId || "Not linked")} />
        <StateRow label="Type" value={display.typeLabel} />
        <StateRow label="Status" value={display.statusLabel} />
        <StateRow label="Follow-up" value={summary.followUpNeeded ? "Needed" : "No"} />
        <StateRow label="Relations" value={String(summary.relationCount)} />
      </div>
      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/35 px-2 py-2 text-[11.5px] leading-relaxed text-soft">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          This logs metadata only. Email capture, calendar reminders, automatic meeting history,
          imports, encryption, and app lock are not implemented.
        </span>
      </div>
    </section>
  );
}

function InteractionInlineEditor({
  interaction,
  personId,
  provider,
}: {
  interaction: MizaanItem;
  personId: string;
  provider: VaultProvider;
}) {
  const metadata = normalizeInteractionMetadataForItem(interaction);
  const display = getInteractionDisplayFields(metadata);
  const summary = getInteractionStateSummary(metadata);

  async function persist(patch: Record<string, unknown>) {
    const next = updateInteractionMetadata(metadata, { personId, ...patch });
    await provider.updateItem(interaction.id, {
      title: next.interactionTitle || "Untitled interaction",
      status: getInteractionStatusLabel(next.interactionStatus),
      parentId: personId,
      summary: next.summary || next.notes || interaction.summary,
      properties: {
        interactionType: getInteractionTypeLabel(next.interactionType),
        interactionStatus: getInteractionStatusLabel(next.interactionStatus),
        personId,
        interactionDate: next.interactionDate,
        followUpNeeded: next.followUpNeeded,
        followUpDate: next.followUpDate,
        private: next.private,
        sensitive: next.sensitive,
      },
      metadata: next,
    });
  }

  return (
    <article className="rounded-sm border hairline bg-surface px-2 py-2">
      <TextField
        label="Interaction title"
        value={metadata.interactionTitle}
        onChange={(value) => persist({ interactionTitle: value })}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
        <SelectField
          label="Type"
          value={metadata.interactionType}
          options={INTERACTION_TYPE_VALUES.map((value) => ({
            value,
            label: getInteractionTypeLabel(value),
          }))}
          onChange={(value) => persist({ interactionType: value as InteractionType })}
        />
        <SelectField
          label="Status"
          value={metadata.interactionStatus}
          options={INTERACTION_STATUS_VALUES.map((value) => ({
            value,
            label: getInteractionStatusLabel(value),
          }))}
          onChange={(value) => persist({ interactionStatus: value as InteractionStatus })}
        />
        <TextField
          label="Date"
          value={metadata.interactionDate}
          onChange={(value) => persist({ interactionDate: value })}
          type="date"
        />
      </div>
      <TextareaField
        label="Summary"
        value={metadata.summary}
        onChange={(value) => persist({ summary: value })}
      />
      <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <CheckboxField
          label="Follow-up needed"
          checked={metadata.followUpNeeded}
          onChange={(value) => persist({ followUpNeeded: value })}
        />
        <TextField
          label="Follow-up date"
          value={metadata.followUpDate}
          onChange={(value) => persist({ followUpDate: value })}
          type="date"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-faint">
        <Badge>{display.typeLabel}</Badge>
        <Badge>{display.statusLabel}</Badge>
        {summary.followUpNeeded && <Badge>Follow-up</Badge>}
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

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 min-h-[62px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
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

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] text-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1">
      <span className="text-faint">{label}</span>
      <span className="truncate font-medium text-soft">{value}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full border hairline bg-background px-2 py-0.5">{children}</span>;
}

function getLinkedInteractions(personId: string, items: MizaanItem[]) {
  return items
    .filter((item) => isInteractionRecordItem(item) && !item.archivedAt && !item.deletedAt)
    .filter((interaction) => {
      const metadata = normalizeInteractionMetadataForItem(interaction);
      return metadata.personId === personId || interaction.parentId === personId;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}


