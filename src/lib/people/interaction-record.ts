import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const INTERACTION_TYPE_VALUES = [
  "note",
  "meeting",
  "call",
  "message",
  "email",
  "class",
  "appointment",
  "event",
  "follow-up",
  "other",
] as const;

export type InteractionType = (typeof INTERACTION_TYPE_VALUES)[number];

export const INTERACTION_STATUS_VALUES = [
  "logged",
  "follow-up-needed",
  "closed",
  "archived",
] as const;

export type InteractionStatus = (typeof INTERACTION_STATUS_VALUES)[number];

export interface InteractionMetadata extends Record<string, PropertyValue> {
  interactionTitle: string;
  interactionType: InteractionType;
  interactionStatus: InteractionStatus;
  personId: string;
  interactionDate: string;
  summary: string;
  followUpNeeded: boolean;
  followUpDate: string;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedDocumentIds: string[];
  linkedCalendarEventIds: string[];
  notes: string;
  private: boolean;
  sensitive: boolean;
  category: "people";
}

export interface CreateInteractionRecordOptions {
  title?: string;
  type?: InteractionType | string;
  status?: InteractionStatus | string;
  personId?: string;
  interactionDate?: string;
  summary?: string;
  followUpNeeded?: boolean;
  followUpDate?: string;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedDocumentIds?: string[];
  linkedCalendarEventIds?: string[];
  notes?: string;
  private?: boolean;
  sensitive?: boolean;
  tags?: string[];
}

export interface InteractionGraphTarget {
  targetId: string;
  sourceField:
    | "personId"
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedDocumentIds"
    | "linkedCalendarEventIds";
  edgeType: "person-link" | "project-link" | "task-link" | "document-link" | "calendar-link";
  label: string;
}

const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  note: "Note",
  meeting: "Meeting",
  call: "Call",
  message: "Message",
  email: "Email",
  class: "Class",
  appointment: "Appointment",
  event: "Event",
  "follow-up": "Follow-up",
  other: "Other",
};

const INTERACTION_STATUS_LABELS: Record<InteractionStatus, string> = {
  logged: "Logged",
  "follow-up-needed": "Follow-up needed",
  closed: "Closed",
  archived: "Archived",
};

const INTERACTION_GRAPH_FIELDS: Array<{
  field: Exclude<InteractionGraphTarget["sourceField"], "personId">;
  edgeType: InteractionGraphTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  {
    field: "linkedCalendarEventIds",
    edgeType: "calendar-link",
    label: "Linked calendar event",
  },
];

export function createDefaultInteractionMetadata(
  input: Record<string, unknown> = {},
): InteractionMetadata {
  return normalizeInteractionMetadata({
    interactionTitle: "Untitled interaction",
    interactionType: "note",
    interactionStatus: "logged",
    personId: "",
    interactionDate: "",
    summary: "",
    followUpNeeded: false,
    followUpDate: "",
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedDocumentIds: [],
    linkedCalendarEventIds: [],
    notes: "",
    private: false,
    sensitive: false,
    category: "people",
    ...input,
  });
}

export function normalizeInteractionMetadata(input: unknown): InteractionMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawTitle = normalizeString(source.interactionTitle);

  return {
    ...normalized,
    interactionTitle: rawTitle || "Untitled interaction",
    interactionType:
      source.interactionType === undefined
        ? "note"
        : normalizeInteractionType(source.interactionType),
    interactionStatus:
      source.interactionStatus === undefined
        ? "logged"
        : normalizeInteractionStatus(source.interactionStatus),
    personId: normalizeInteractionPersonId(source.personId),
    interactionDate: normalizeDateString(source.interactionDate),
    summary: normalizeString(source.summary),
    followUpNeeded: normalizeBoolean(source.followUpNeeded),
    followUpDate: normalizeDateString(source.followUpDate),
    linkedProjectIds: normalizeInteractionRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizeInteractionRelationIds(source.linkedTaskIds),
    linkedDocumentIds: normalizeInteractionRelationIds(source.linkedDocumentIds),
    linkedCalendarEventIds: normalizeInteractionRelationIds(source.linkedCalendarEventIds),
    notes: normalizeString(source.notes),
    private: normalizeBoolean(source.private),
    sensitive: normalizeBoolean(source.sensitive),
    category: "people",
  };
}

export function updateInteractionMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): InteractionMetadata {
  const currentMetadata = normalizeInteractionMetadata(current);
  return normalizeInteractionMetadata({ ...currentMetadata, ...patch });
}

export function createInteractionRecordInput(
  options: CreateInteractionRecordOptions = {},
): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled interaction";
  const tags = uniqueStrings(["interaction", ...(options.tags ?? [])]);
  const metadata = createDefaultInteractionMetadata({
    interactionTitle: title,
    interactionType: options.type ?? "note",
    interactionStatus: options.status ?? "logged",
    personId: options.personId ?? "",
    interactionDate: options.interactionDate ?? "",
    summary: options.summary ?? "",
    followUpNeeded: options.followUpNeeded ?? false,
    followUpDate: options.followUpDate ?? "",
    linkedProjectIds: options.linkedProjectIds ?? [],
    linkedTaskIds: options.linkedTaskIds ?? [],
    linkedDocumentIds: options.linkedDocumentIds ?? [],
    linkedCalendarEventIds: options.linkedCalendarEventIds ?? [],
    notes: options.notes ?? "",
    private: options.private ?? false,
    sensitive: options.sensitive ?? false,
  });

  return {
    title,
    category: "people",
    type: "interaction",
    icon: "I",
    summary: metadata.summary || metadata.notes || "Local interaction record.",
    status: getInteractionStatusLabel(metadata.interactionStatus),
    tags,
    parentId: metadata.personId || undefined,
    properties: {
      interactionType: getInteractionTypeLabel(metadata.interactionType),
      interactionStatus: getInteractionStatusLabel(metadata.interactionStatus),
      personId: metadata.personId,
      interactionDate: metadata.interactionDate,
      followUpNeeded: metadata.followUpNeeded,
      followUpDate: metadata.followUpDate,
      private: metadata.private,
      sensitive: metadata.sensitive,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isInteractionRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "people" &&
    item.type === "interaction" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeInteractionMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "metadata" | "parentId">,
): InteractionMetadata {
  return normalizeInteractionMetadata({
    interactionTitle: item.title,
    interactionStatus: item.status,
    personId: item.parentId,
    ...item.metadata,
  });
}

export function normalizeInteractionType(value: unknown): InteractionType {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "follow up" || normalized === "followup") return "follow-up";
  return normalizeEnum(value, INTERACTION_TYPE_VALUES, "other");
}

export function normalizeInteractionStatus(value: unknown): InteractionStatus {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "follow up needed" || normalized === "followup-needed") {
    return "follow-up-needed";
  }
  return normalizeEnum(value, INTERACTION_STATUS_VALUES, "logged");
}

export function normalizeInteractionRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      const normalized = normalizeString(entry);
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getInteractionDisplayFields(metadataInput: unknown) {
  const metadata = normalizeInteractionMetadata(metadataInput);
  return {
    title: metadata.interactionTitle,
    typeLabel: getInteractionTypeLabel(metadata.interactionType),
    statusLabel: getInteractionStatusLabel(metadata.interactionStatus),
    personId: metadata.personId,
    interactionDate: metadata.interactionDate,
    summary: metadata.summary,
    followUpNeeded: metadata.followUpNeeded,
    followUpDate: metadata.followUpDate,
    notes: metadata.notes,
    projectCount: metadata.linkedProjectIds.length,
    taskCount: metadata.linkedTaskIds.length,
    documentCount: metadata.linkedDocumentIds.length,
    calendarEventCount: metadata.linkedCalendarEventIds.length,
    relationCount: getInteractionGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getInteractionStateSummary(metadataInput: unknown) {
  const metadata = normalizeInteractionMetadata(metadataInput);
  return {
    typeLabel: getInteractionTypeLabel(metadata.interactionType),
    statusLabel: getInteractionStatusLabel(metadata.interactionStatus),
    followUpNeeded: metadata.followUpNeeded || metadata.interactionStatus === "follow-up-needed",
    followUpDate: metadata.followUpDate,
    relationCount: getInteractionGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getInteractionGraphTargets(metadataInput: unknown): InteractionGraphTarget[] {
  const metadata = normalizeInteractionMetadata(metadataInput);
  const personTarget: InteractionGraphTarget[] = metadata.personId
    ? [
        {
          targetId: metadata.personId,
          sourceField: "personId",
          edgeType: "person-link",
          label: "Person",
        },
      ]
    : [];

  return [
    ...personTarget,
    ...INTERACTION_GRAPH_FIELDS.flatMap(({ field, edgeType, label }) =>
      metadata[field].map((targetId) => ({
        targetId,
        sourceField: field,
        edgeType,
        label,
      })),
    ),
  ];
}

export function getInteractionTypeLabel(value: InteractionType): string {
  return INTERACTION_TYPE_LABELS[value];
}

export function getInteractionStatusLabel(value: InteractionStatus): string {
  return INTERACTION_STATUS_LABELS[value];
}

function normalizeInteractionPersonId(value: unknown): string {
  const normalized = normalizeString(value);
  return isValidItemId(normalized) ? normalized : "";
}

function normalizeEnum<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  const normalized = normalizeString(value).toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function normalizeDateString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function normalizeBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}

function uniqueStrings(values: string[]): string[] {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function isValidItemId(value: string): boolean {
  return /^[A-Za-z0-9._:-]+$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toPropertyValue(value: unknown): PropertyValue | undefined {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    const arrayValue = value.flatMap((entry) => {
      const safeValue = toPropertyValue(entry);
      return safeValue === undefined ? [] : [safeValue];
    });
    return arrayValue;
  }
  if (isRecord(value)) {
    const result: Record<string, PropertyValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      const safeValue = toPropertyValue(entry);
      if (safeValue !== undefined) result[key] = safeValue;
    }
    return result;
  }
  return undefined;
}
