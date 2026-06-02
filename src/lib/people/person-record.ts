import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const PERSON_RELATIONSHIP_TYPE_VALUES = [
  "family",
  "friend",
  "classmate",
  "colleague",
  "mentor",
  "teacher",
  "doctor",
  "service",
  "client",
  "acquaintance",
  "community",
  "unknown",
] as const;

export type PersonRelationshipType = (typeof PERSON_RELATIONSHIP_TYPE_VALUES)[number];

export const PERSON_RELATIONSHIP_STATUS_VALUES = [
  "active",
  "close",
  "occasional",
  "dormant",
  "follow-up",
  "sensitive",
  "archived",
  "unknown",
] as const;

export type PersonRelationshipStatus = (typeof PERSON_RELATIONSHIP_STATUS_VALUES)[number];

export const PREFERRED_CONTACT_METHOD_VALUES = [
  "unknown",
  "in-person",
  "phone",
  "email",
  "message",
  "social",
  "other",
] as const;

export type PreferredContactMethod = (typeof PREFERRED_CONTACT_METHOD_VALUES)[number];

export const FOLLOW_UP_STATUS_VALUES = [
  "none",
  "follow-up-needed",
  "waiting",
  "scheduled",
  "done",
] as const;

export type FollowUpStatus = (typeof FOLLOW_UP_STATUS_VALUES)[number];

export interface PersonMetadata extends Record<string, PropertyValue> {
  displayName: string;
  legalName: string;
  preferredName: string;
  aliases: string[];
  relationshipType: PersonRelationshipType;
  relationshipStatus: PersonRelationshipStatus;
  whereKnownFrom: string;
  organization: string;
  roleTitle: string;
  locationNote: string;
  primaryEmail: string;
  primaryPhone: string;
  preferredContactMethod: PreferredContactMethod;
  lastInteractionDate: string;
  nextFollowUpDate: string;
  followUpStatus: FollowUpStatus;
  birthday: string;
  private: boolean;
  sensitive: boolean;
  category: "people";
  notes: string;
  context: string;
  boundaries: string;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedDocumentIds: string[];
  linkedFinanceIds: string[];
  linkedCalendarEventIds: string[];
  linkedGoalIds: string[];
  tags: string[];
}

export interface CreatePersonRecordOptions {
  displayName?: string;
  legalName?: string;
  preferredName?: string;
  aliases?: string[];
  relationshipType?: PersonRelationshipType | string;
  relationshipStatus?: PersonRelationshipStatus | string;
  status?: PersonRelationshipStatus | string;
  whereKnownFrom?: string;
  organization?: string;
  roleTitle?: string;
  locationNote?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  preferredContactMethod?: PreferredContactMethod | string;
  lastInteractionDate?: string;
  nextFollowUpDate?: string;
  followUpStatus?: FollowUpStatus | string;
  birthday?: string;
  private?: boolean;
  sensitive?: boolean;
  notes?: string;
  context?: string;
  boundaries?: string;
  tags?: string[];
  parentId?: string;
}

export interface PersonGraphTarget {
  targetId: string;
  sourceField:
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedDocumentIds"
    | "linkedFinanceIds"
    | "linkedCalendarEventIds"
    | "linkedGoalIds";
  edgeType:
    | "project-link"
    | "task-link"
    | "document-link"
    | "finance-link"
    | "calendar-link"
    | "goal-link";
  label: string;
}

const RELATIONSHIP_TYPE_LABELS: Record<PersonRelationshipType, string> = {
  family: "Family",
  friend: "Friend",
  classmate: "Classmate",
  colleague: "Colleague",
  mentor: "Mentor",
  teacher: "Teacher",
  doctor: "Doctor",
  service: "Service",
  client: "Client",
  acquaintance: "Acquaintance",
  community: "Community",
  unknown: "Unknown",
};

const RELATIONSHIP_STATUS_LABELS: Record<PersonRelationshipStatus, string> = {
  active: "Active",
  close: "Close",
  occasional: "Occasional",
  dormant: "Dormant",
  "follow-up": "Follow-up",
  sensitive: "Sensitive",
  archived: "Archived",
  unknown: "Unknown",
};

const CONTACT_METHOD_LABELS: Record<PreferredContactMethod, string> = {
  unknown: "Unknown",
  "in-person": "In person",
  phone: "Phone",
  email: "Email",
  message: "Message",
  social: "Social",
  other: "Other",
};

const FOLLOW_UP_STATUS_LABELS: Record<FollowUpStatus, string> = {
  none: "None",
  "follow-up-needed": "Follow-up needed",
  waiting: "Waiting",
  scheduled: "Scheduled",
  done: "Done",
};

const PERSON_GRAPH_FIELDS: Array<{
  field: PersonGraphTarget["sourceField"];
  edgeType: PersonGraphTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedFinanceIds", edgeType: "finance-link", label: "Linked finance" },
  {
    field: "linkedCalendarEventIds",
    edgeType: "calendar-link",
    label: "Linked calendar event",
  },
  { field: "linkedGoalIds", edgeType: "goal-link", label: "Linked goal" },
];

export function createDefaultPersonMetadata(input: Record<string, unknown> = {}): PersonMetadata {
  return normalizePersonMetadata({
    displayName: "Untitled person",
    legalName: "",
    preferredName: "",
    aliases: [],
    relationshipType: "unknown",
    relationshipStatus: "unknown",
    whereKnownFrom: "",
    organization: "",
    roleTitle: "",
    locationNote: "",
    primaryEmail: "",
    primaryPhone: "",
    preferredContactMethod: "unknown",
    lastInteractionDate: "",
    nextFollowUpDate: "",
    followUpStatus: "none",
    birthday: "",
    private: false,
    sensitive: false,
    category: "people",
    notes: "",
    context: "",
    boundaries: "",
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedDocumentIds: [],
    linkedFinanceIds: [],
    linkedCalendarEventIds: [],
    linkedGoalIds: [],
    tags: [],
    ...input,
  });
}

export function normalizePersonMetadata(input: unknown): PersonMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawDisplayName = normalizeString(source.displayName);

  return {
    ...normalized,
    displayName: rawDisplayName || "Untitled person",
    legalName: normalizeString(source.legalName),
    preferredName: normalizeString(source.preferredName),
    aliases: normalizeStringArray(source.aliases),
    relationshipType:
      source.relationshipType === undefined
        ? "unknown"
        : normalizeRelationshipType(source.relationshipType),
    relationshipStatus:
      source.relationshipStatus === undefined
        ? "unknown"
        : normalizeRelationshipStatus(source.relationshipStatus),
    whereKnownFrom: normalizeString(source.whereKnownFrom),
    organization: normalizeString(source.organization),
    roleTitle: normalizeString(source.roleTitle),
    locationNote: normalizeString(source.locationNote),
    primaryEmail: normalizeString(source.primaryEmail),
    primaryPhone: normalizeString(source.primaryPhone),
    preferredContactMethod:
      source.preferredContactMethod === undefined
        ? "unknown"
        : normalizePreferredContactMethod(source.preferredContactMethod),
    lastInteractionDate: normalizeDateString(source.lastInteractionDate),
    nextFollowUpDate: normalizeDateString(source.nextFollowUpDate),
    followUpStatus:
      source.followUpStatus === undefined ? "none" : normalizeFollowUpStatus(source.followUpStatus),
    birthday: normalizeDateString(source.birthday),
    private: normalizeBoolean(source.private),
    sensitive: normalizeBoolean(source.sensitive),
    category: "people",
    notes: normalizeString(source.notes),
    context: normalizeString(source.context),
    boundaries: normalizeString(source.boundaries),
    linkedProjectIds: normalizePersonRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizePersonRelationIds(source.linkedTaskIds),
    linkedDocumentIds: normalizePersonRelationIds(source.linkedDocumentIds),
    linkedFinanceIds: normalizePersonRelationIds(source.linkedFinanceIds),
    linkedCalendarEventIds: normalizePersonRelationIds(source.linkedCalendarEventIds),
    linkedGoalIds: normalizePersonRelationIds(source.linkedGoalIds),
    tags: normalizeStringArray(source.tags),
  };
}

export function updatePersonMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): PersonMetadata {
  const currentMetadata = normalizePersonMetadata(current);
  return normalizePersonMetadata({ ...currentMetadata, ...patch });
}

export function createPersonRecordInput(options: CreatePersonRecordOptions = {}): CreateItemInput {
  const displayName = normalizeString(options.displayName) || "Untitled person";
  const relationshipStatus = options.relationshipStatus ?? options.status ?? "unknown";
  const tags = uniqueStrings(["person", ...(options.tags ?? [])]);
  const metadata = createDefaultPersonMetadata({
    displayName,
    legalName: options.legalName ?? "",
    preferredName: options.preferredName ?? "",
    aliases: options.aliases ?? [],
    relationshipType: options.relationshipType ?? "unknown",
    relationshipStatus,
    whereKnownFrom: options.whereKnownFrom ?? "",
    organization: options.organization ?? "",
    roleTitle: options.roleTitle ?? "",
    locationNote: options.locationNote ?? "",
    primaryEmail: options.primaryEmail ?? "",
    primaryPhone: options.primaryPhone ?? "",
    preferredContactMethod: options.preferredContactMethod ?? "unknown",
    lastInteractionDate: options.lastInteractionDate ?? "",
    nextFollowUpDate: options.nextFollowUpDate ?? "",
    followUpStatus: options.followUpStatus ?? "none",
    birthday: options.birthday ?? "",
    private: options.private ?? false,
    sensitive: options.sensitive ?? false,
    notes: options.notes ?? "",
    context: options.context ?? "",
    boundaries: options.boundaries ?? "",
    tags,
  });

  return {
    title: metadata.displayName,
    category: "people",
    type: "person",
    icon: "U",
    summary: metadata.context || metadata.notes || "Local person record with CRM metadata.",
    status: getRelationshipStatusLabel(metadata.relationshipStatus),
    tags,
    parentId: options.parentId,
    properties: {
      relationshipType: getRelationshipTypeLabel(metadata.relationshipType),
      relationshipStatus: getRelationshipStatusLabel(metadata.relationshipStatus),
      whereKnownFrom: metadata.whereKnownFrom,
      organization: metadata.organization,
      roleTitle: metadata.roleTitle,
      nextFollowUpDate: metadata.nextFollowUpDate,
      private: metadata.private,
      sensitive: metadata.sensitive,
    },
    attachedFiles: [],
    metadata,
  };
}

export function isPersonRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "people" &&
    item.type === "person" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizePersonMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata">,
): PersonMetadata {
  return normalizePersonMetadata({
    displayName: item.title,
    relationshipStatus: item.status,
    tags: item.tags,
    ...item.metadata,
  });
}

export function normalizeRelationshipType(value: unknown): PersonRelationshipType {
  return normalizeEnum(value, PERSON_RELATIONSHIP_TYPE_VALUES, "unknown");
}

export function normalizeRelationshipStatus(value: unknown): PersonRelationshipStatus {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "follow up" || normalized === "followup") return "follow-up";
  return normalizeEnum(value, PERSON_RELATIONSHIP_STATUS_VALUES, "unknown");
}

export function normalizePreferredContactMethod(value: unknown): PreferredContactMethod {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "in person") return "in-person";
  return normalizeEnum(value, PREFERRED_CONTACT_METHOD_VALUES, "unknown");
}

export function normalizeFollowUpStatus(value: unknown): FollowUpStatus {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "follow up needed" || normalized === "followup-needed") {
    return "follow-up-needed";
  }
  return normalizeEnum(value, FOLLOW_UP_STATUS_VALUES, "none");
}

export function normalizePersonRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      const normalized = normalizeString(entry);
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getPersonDisplayFields(metadataInput: unknown) {
  const metadata = normalizePersonMetadata(metadataInput);
  return {
    displayName: metadata.displayName,
    legalName: metadata.legalName,
    preferredName: metadata.preferredName,
    aliases: metadata.aliases,
    relationshipTypeLabel: getRelationshipTypeLabel(metadata.relationshipType),
    relationshipStatusLabel: getRelationshipStatusLabel(metadata.relationshipStatus),
    preferredContactMethodLabel: getPreferredContactMethodLabel(metadata.preferredContactMethod),
    followUpStatusLabel: getFollowUpStatusLabel(metadata.followUpStatus),
    whereKnownFrom: metadata.whereKnownFrom,
    organization: metadata.organization,
    roleTitle: metadata.roleTitle,
    locationNote: metadata.locationNote,
    primaryEmail: metadata.primaryEmail,
    primaryPhone: metadata.primaryPhone,
    lastInteractionDate: metadata.lastInteractionDate,
    nextFollowUpDate: metadata.nextFollowUpDate,
    birthday: metadata.birthday,
    notes: metadata.notes,
    context: metadata.context,
    boundaries: metadata.boundaries,
    projectCount: metadata.linkedProjectIds.length,
    taskCount: metadata.linkedTaskIds.length,
    documentCount: metadata.linkedDocumentIds.length,
    financeCount: metadata.linkedFinanceIds.length,
    calendarEventCount: metadata.linkedCalendarEventIds.length,
    goalCount: metadata.linkedGoalIds.length,
    relationCount: getPersonGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getPersonStateSummary(metadataInput: unknown) {
  const metadata = normalizePersonMetadata(metadataInput);
  return {
    relationshipTypeLabel: getRelationshipTypeLabel(metadata.relationshipType),
    relationshipStatusLabel: getRelationshipStatusLabel(metadata.relationshipStatus),
    preferredContactMethodLabel: getPreferredContactMethodLabel(metadata.preferredContactMethod),
    followUpStatusLabel: getFollowUpStatusLabel(metadata.followUpStatus),
    nextFollowUpDate: metadata.nextFollowUpDate,
    relationCount: getPersonGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getPersonPrivacySummary(metadataInput: unknown) {
  const metadata = normalizePersonMetadata(metadataInput);
  return {
    private: metadata.private,
    sensitive: metadata.sensitive,
    metadataOnly: true,
    encrypted: false,
    hiddenFromSearch: false,
    hiddenFromGraph: false,
    message:
      "Private and sensitive flags are metadata only in this browser prototype; content is not encrypted, locked, hidden from search, or hidden from graph.",
  };
}

export function isPersonPrivate(metadataInput: unknown): boolean {
  return normalizePersonMetadata(metadataInput).private;
}

export function isPersonSensitive(metadataInput: unknown): boolean {
  return normalizePersonMetadata(metadataInput).sensitive;
}

export function getPersonGraphTargets(metadataInput: unknown): PersonGraphTarget[] {
  const metadata = normalizePersonMetadata(metadataInput);

  return PERSON_GRAPH_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({
      targetId,
      sourceField: field,
      edgeType,
      label,
    })),
  );
}

export function getPersonSearchMetadata(metadataInput: unknown) {
  const metadata = normalizePersonMetadata(metadataInput);
  return {
    names: uniqueStrings([
      metadata.displayName,
      metadata.legalName,
      metadata.preferredName,
      ...metadata.aliases,
    ]),
    relationship: [
      metadata.relationshipType,
      metadata.relationshipStatus,
      metadata.preferredContactMethod,
      metadata.followUpStatus,
    ].join(" "),
    context: [
      metadata.whereKnownFrom,
      metadata.organization,
      metadata.roleTitle,
      metadata.locationNote,
      metadata.primaryEmail,
      metadata.primaryPhone,
      metadata.nextFollowUpDate,
      metadata.tags.join(" "),
    ]
      .filter(Boolean)
      .join(" "),
    notes: [metadata.notes, metadata.context, metadata.boundaries].filter(Boolean).join(" "),
    privacy: `metadata-only private:${metadata.private} sensitive:${metadata.sensitive}`,
  };
}

export function getRelationshipTypeLabel(value: PersonRelationshipType): string {
  return RELATIONSHIP_TYPE_LABELS[value];
}

export function getRelationshipStatusLabel(value: PersonRelationshipStatus): string {
  return RELATIONSHIP_STATUS_LABELS[value];
}

export function getPreferredContactMethodLabel(value: PreferredContactMethod): string {
  return CONTACT_METHOD_LABELS[value];
}

export function getFollowUpStatusLabel(value: FollowUpStatus): string {
  return FOLLOW_UP_STATUS_LABELS[value];
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

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.map(normalizeString).filter(Boolean));
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
