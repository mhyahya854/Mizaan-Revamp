import {
  MIZAAN_ARCHIVE_APP_NAME,
  MIZAAN_ARCHIVE_SCHEMA_VERSION,
  MIZAAN_ARCHIVE_VERSION,
} from "./vault-archive";
import type { ItemCategory, MizaanItem, PropertyValue, VaultSnapshot } from "./types";

const ITEM_CATEGORIES: ItemCategory[] = [
  "notes",
  "documents",
  "projects",
  "tasks",
  "people",
  "finance",
  "calendar",
  "trackers",
  "goals",
  "databases",
  "templates",
];

const SCALAR_REFERENCE_FIELDS = new Set([
  "parentId",
  "projectId",
  "taskProjectId",
  "personId",
  "goalId",
  "trackerId",
  "documentId",
  "financeId",
  "calendarEventId",
  "sourceId",
  "targetId",
]);

export type VaultHealthIssueSeverity = "info" | "warning" | "danger";

export interface VaultHealthIssue {
  code: string;
  severity: VaultHealthIssueSeverity;
  message: string;
  recordId?: string;
  path?: string;
}

export interface InvalidMetadataReference {
  itemId: string;
  field: string;
  targetId: string;
}

export interface VaultHealthSummary {
  checkedAt: string;
  providerId: string;
  providerName: string;
  storageLabel: string;
  archiveSupport: {
    appName: typeof MIZAAN_ARCHIVE_APP_NAME;
    archiveVersion: typeof MIZAAN_ARCHIVE_VERSION;
    schemaVersion: typeof MIZAAN_ARCHIVE_SCHEMA_VERSION;
    browserJsonExport: boolean;
    archiveValidation: boolean;
    restorePreview: boolean;
    safeMerge: boolean;
    guardedReplace: boolean;
    nativeBackup: boolean;
    sqliteBackup: boolean;
    encryptedBackup: boolean;
    portableVaultBackup: boolean;
  };
  counts: {
    items: number;
    blocks: number;
    relations: number;
    archived: number;
    deleted: number;
    active: number;
    categories: Record<ItemCategory, number>;
  };
  duplicateItemIds: string[];
  duplicateBlockIds: string[];
  duplicateRelationIds: string[];
  orphanBlockIds: string[];
  orphanRelationIds: string[];
  invalidMetadataReferences: InvalidMetadataReference[];
  invalidMetadataCount: number;
  emptyVault: boolean;
  issues: VaultHealthIssue[];
  warnings: string[];
  limitations: string[];
}

export function createVaultHealthSummary(
  snapshot: VaultSnapshot,
  options: { checkedAt?: string } = {},
): VaultHealthSummary {
  const checkedAt = options.checkedAt ?? new Date().toISOString();
  const itemIds = new Set(snapshot.items.map((item) => item.id));
  const duplicateItemIds = findDuplicateIds(snapshot.items);
  const duplicateBlockIds = findDuplicateIds(snapshot.blocks);
  const duplicateRelationIds = findDuplicateIds(snapshot.relations);
  const orphanBlockIds = uniqueSorted(
    snapshot.blocks.filter((block) => !itemIds.has(block.itemId)).map((block) => block.id),
  );
  const orphanRelationIds = uniqueSorted(
    snapshot.relations
      .filter((relation) => !itemIds.has(relation.sourceId) || !itemIds.has(relation.targetId))
      .map((relation) => relation.id),
  );
  const invalidMetadataReferences = findInvalidMetadataReferences(snapshot.items, itemIds);
  const emptyVault = snapshot.items.length === 0;
  const issues: VaultHealthIssue[] = [];

  if (emptyVault) {
    issues.push({
      code: "empty-vault",
      severity: "info",
      message: "No vault items are currently stored in the browser prototype.",
    });
  }

  issues.push(
    ...duplicateItemIds.map((id) => issue("duplicate-item-id", "danger", id)),
    ...duplicateBlockIds.map((id) => issue("duplicate-block-id", "danger", id)),
    ...duplicateRelationIds.map((id) => issue("duplicate-relation-id", "danger", id)),
    ...orphanBlockIds.map((id) => issue("orphan-block", "warning", id)),
    ...orphanRelationIds.map((id) => issue("orphan-relation", "warning", id)),
    ...invalidMetadataReferences.map((reference) => ({
      code: "invalid-metadata-reference",
      severity: "warning" as const,
      recordId: reference.itemId,
      path: `items.${reference.itemId}.metadata.${reference.field}`,
      message: `Metadata field ${reference.field} references missing item ${reference.targetId}.`,
    })),
  );

  return {
    checkedAt,
    providerId: snapshot.providerInfo.id,
    providerName: snapshot.providerInfo.name,
    storageLabel: snapshot.providerInfo.storageLabel,
    archiveSupport: {
      appName: MIZAAN_ARCHIVE_APP_NAME,
      archiveVersion: MIZAAN_ARCHIVE_VERSION,
      schemaVersion: MIZAAN_ARCHIVE_SCHEMA_VERSION,
      browserJsonExport: true,
      archiveValidation: true,
      restorePreview: true,
      safeMerge: true,
      guardedReplace: true,
      nativeBackup: false,
      sqliteBackup: false,
      encryptedBackup: false,
      portableVaultBackup: false,
    },
    counts: {
      items: snapshot.items.length,
      blocks: snapshot.blocks.length,
      relations: snapshot.relations.length,
      archived: snapshot.items.filter((item) => item.archivedAt).length,
      deleted: snapshot.items.filter((item) => item.deletedAt).length,
      active: snapshot.items.filter((item) => !item.archivedAt && !item.deletedAt).length,
      categories: countCategories(snapshot.items),
    },
    duplicateItemIds,
    duplicateBlockIds,
    duplicateRelationIds,
    orphanBlockIds,
    orphanRelationIds,
    invalidMetadataReferences,
    invalidMetadataCount: invalidMetadataReferences.length,
    emptyVault,
    issues,
    warnings: [
      ...snapshot.health.warnings,
      "Browser localStorage remains prototype storage, not lifetime native storage.",
    ],
    limitations: [
      "No native filesystem backup is implemented.",
      "No SQLite backup is implemented.",
      "No encrypted backup is implemented.",
      "No portable vault folder backup is implemented.",
    ],
  };
}

export function getVaultHealthScore(
  summary: VaultHealthSummary,
): "empty" | "healthy" | "attention" {
  if (summary.emptyVault) return "empty";
  return summary.issues.some((entry) => entry.severity !== "info") ? "attention" : "healthy";
}

function countCategories(items: MizaanItem[]): Record<ItemCategory, number> {
  const counts = Object.fromEntries(ITEM_CATEGORIES.map((category) => [category, 0])) as Record<
    ItemCategory,
    number
  >;

  for (const item of items) {
    counts[item.category] += 1;
  }

  return counts;
}

function findDuplicateIds(records: Array<{ id: string }>): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();

  for (const record of records) {
    if (seen.has(record.id)) {
      duplicates.add(record.id);
      continue;
    }
    seen.add(record.id);
  }

  return Array.from(duplicates).sort();
}

function findInvalidMetadataReferences(
  items: MizaanItem[],
  itemIds: Set<string>,
): InvalidMetadataReference[] {
  const references: InvalidMetadataReference[] = [];

  for (const item of items) {
    for (const [field, value] of Object.entries(item.metadata)) {
      for (const targetId of getReferenceIds(field, value)) {
        if (!itemIds.has(targetId)) {
          references.push({ itemId: item.id, field, targetId });
        }
      }
    }
  }

  return references.sort((left, right) =>
    [left.itemId, left.field, left.targetId]
      .join(":")
      .localeCompare([right.itemId, right.field, right.targetId].join(":")),
  );
}

function getReferenceIds(field: string, value: PropertyValue): string[] {
  if (Array.isArray(value) && field.endsWith("Ids")) {
    return value.filter((entry): entry is string => typeof entry === "string" && entry.length > 0);
  }

  if (typeof value !== "string" || value.length === 0) return [];
  if (SCALAR_REFERENCE_FIELDS.has(field)) return [value];
  if (field.startsWith("linked") && field.endsWith("Id")) return [value];
  return [];
}

function uniqueSorted(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function issue(
  code: string,
  severity: VaultHealthIssueSeverity,
  recordId: string,
): VaultHealthIssue {
  const label = code.replace(/-/g, " ");
  return {
    code,
    severity,
    recordId,
    message: `${label} detected for ${recordId}.`,
  };
}
