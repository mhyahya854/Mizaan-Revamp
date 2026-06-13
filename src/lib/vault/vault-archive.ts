import type {
  MizaanBlock,
  MizaanItem,
  MizaanRelation,
  PropertyValue,
  VaultProviderInfo,
  VaultSnapshot,
} from "./types";

export const MIZAAN_ARCHIVE_APP_NAME = "Mizaan";
export const MIZAAN_ARCHIVE_VERSION = 1;
export const MIZAAN_ARCHIVE_SCHEMA_VERSION = 1;

export type RestoreMode = "merge" | "replace";

export interface VaultArchiveProviderSummary {
  id: string;
  name: string;
  mode: VaultProviderInfo["mode"] | string;
  storageLabel: string;
}

export interface VaultArchiveSourceSummary {
  kind: "browser-localStorage-prototype";
  warning: string;
}

export interface VaultArchive {
  archiveVersion: number;
  appName: string;
  createdAt: string;
  provider: VaultArchiveProviderSummary;
  source: VaultArchiveSourceSummary;
  schemaVersion: number;
  itemCount: number;
  blockCount: number;
  relationCount: number;
  items: MizaanItem[];
  blocks: MizaanBlock[];
  relations: MizaanRelation[];
  trash: {
    archivedItemIds: string[];
    deletedItemIds: string[];
  };
  templates: {
    templateItemIds: string[];
    customTemplateCount: number;
  };
  settings: Record<string, PropertyValue>;
  metadata: Record<string, PropertyValue>;
  checksums: {
    items: string;
    blocks: string;
    relations: string;
  };
  warnings: string[];
  unsupportedFutureFields?: Record<string, PropertyValue>;
}

export interface ArchiveValidationError {
  code: string;
  message: string;
  path?: string;
}

export interface ArchiveValidationResult {
  valid: boolean;
  archive?: VaultArchive;
  errors: ArchiveValidationError[];
  warnings: string[];
}

export interface ArchiveVersionValidationOptions {
  allowUnsupportedNewerArchive?: boolean;
}

export interface CreateVaultArchiveOptions {
  createdAt?: string;
  metadata?: Record<string, PropertyValue>;
  settings?: Record<string, PropertyValue>;
  unsupportedFutureFields?: Record<string, PropertyValue>;
}

export interface NormalizeArchiveItemsResult {
  valid: boolean;
  items: MizaanItem[];
  errors: ArchiveValidationError[];
}

export interface RestorePlanOptions extends ArchiveVersionValidationOptions {
  mode?: RestoreMode;
  confirmedReplace?: boolean;
}

export interface RestorePlanSummary {
  itemCreates: number;
  itemUpdates: number;
  itemUnchanged: number;
  itemRemovals: number;
  blockCreates: number;
  blockReplacements: number;
  blockUnchanged: number;
  blockRemovals: number;
  relationCreates: number;
  relationUpdates: number;
  relationUnchanged: number;
  relationRemovals: number;
}

export interface VaultRestorePlan {
  mode: RestoreMode;
  requiresConfirmation: boolean;
  confirmedReplace: boolean;
  archive: VaultArchive;
  summary: RestorePlanSummary;
  createItemIds: string[];
  updateItemIds: string[];
  unchangedItemIds: string[];
  removeItemIds: string[];
  createBlockIds: string[];
  updateBlockIds: string[];
  unchangedBlockIds: string[];
  removeBlockIds: string[];
  createRelationIds: string[];
  updateRelationIds: string[];
  unchangedRelationIds: string[];
  removeRelationIds: string[];
  warnings: string[];
}

export interface RestorePlanResult {
  valid: boolean;
  plan?: VaultRestorePlan;
  errors: ArchiveValidationError[];
  warnings: string[];
}

export interface RestoreResult {
  ok: boolean;
  snapshot?: VaultSnapshot;
  plan?: VaultRestorePlan;
  errors: ArchiveValidationError[];
  warnings: string[];
}

export function createVaultArchive(
  snapshot: Pick<VaultSnapshot, "items" | "blocks" | "relations" | "providerInfo">,
  options: CreateVaultArchiveOptions = {},
): VaultArchive {
  const items = cloneJson(snapshot.items);
  const blocks = cloneJson(snapshot.blocks);
  const relations = cloneJson(snapshot.relations);
  const archivedItemIds = items.filter((item) => item.archivedAt).map((item) => item.id);
  const deletedItemIds = items.filter((item) => item.deletedAt).map((item) => item.id);
  const templateItemIds = items
    .filter((item) => item.category === "templates" || item.type === "template")
    .map((item) => item.id);

  return {
    archiveVersion: MIZAAN_ARCHIVE_VERSION,
    appName: MIZAAN_ARCHIVE_APP_NAME,
    createdAt: options.createdAt ?? new Date().toISOString(),
    provider: {
      id: snapshot.providerInfo.id,
      name: snapshot.providerInfo.name,
      mode: snapshot.providerInfo.mode,
      storageLabel: snapshot.providerInfo.storageLabel,
    },
    source: {
      kind: "browser-localStorage-prototype",
      warning:
        "This archive is a browser/localStorage prototype archive, not a native filesystem backup.",
    },
    schemaVersion: MIZAAN_ARCHIVE_SCHEMA_VERSION,
    itemCount: items.length,
    blockCount: blocks.length,
    relationCount: relations.length,
    items,
    blocks,
    relations,
    trash: {
      archivedItemIds,
      deletedItemIds,
    },
    templates: {
      templateItemIds,
      customTemplateCount: templateItemIds.length,
    },
    settings: cloneJson(options.settings ?? {}),
    metadata: cloneJson(options.metadata ?? {}),
    checksums: {
      items: stableChecksum(items),
      blocks: stableChecksum(blocks),
      relations: stableChecksum(relations),
    },
    warnings: [
      "Browser localStorage is not lifetime storage.",
      "This archive is not a native filesystem backup, SQLite backup, encrypted backup, or portable vault folder.",
      "Restore should be previewed before applying.",
    ],
    unsupportedFutureFields: options.unsupportedFutureFields
      ? cloneJson(options.unsupportedFutureFields)
      : undefined,
  };
}

export function parseVaultArchiveJson(
  json: string,
  options: ArchiveVersionValidationOptions = {},
): ArchiveValidationResult {
  try {
    return validateVaultArchive(JSON.parse(json), options);
  } catch {
    return invalidResult("invalid-json", "Archive JSON could not be parsed.");
  }
}

export function validateVaultArchive(
  value: unknown,
  options: ArchiveVersionValidationOptions = {},
): ArchiveValidationResult {
  const errors: ArchiveValidationError[] = [];
  const warnings: string[] = [];

  if (!isRecord(value)) {
    return invalidResult("corrupt-archive", "Archive must be a JSON object.");
  }

  if (value.appName !== MIZAAN_ARCHIVE_APP_NAME) {
    errors.push({
      code: "wrong-app",
      message: "Archive appName is not Mizaan.",
      path: "appName",
    });
  }

  const version = validateArchiveVersion(value, options);
  errors.push(...version.errors);

  if (!Array.isArray(value.items)) {
    errors.push({
      code: "missing-items",
      message: "Archive must contain an items array.",
      path: "items",
    });
  }

  if (value.blocks !== undefined && !Array.isArray(value.blocks)) {
    errors.push({
      code: "invalid-blocks",
      message: "Archive blocks must be an array when present.",
      path: "blocks",
    });
  }

  if (value.relations !== undefined && !Array.isArray(value.relations)) {
    errors.push({
      code: "invalid-relations",
      message: "Archive relations must be an array when present.",
      path: "relations",
    });
  }

  const normalized = normalizeArchiveItems(Array.isArray(value.items) ? value.items : []);
  errors.push(...normalized.errors);

  if (normalized.items.length === 0 && Array.isArray(value.items)) {
    warnings.push("Archive contains an empty item set.");
  }

  const itemIds = new Set(normalized.items.map((item) => item.id));
  const blockValidation = validateArchiveBlocks(
    Array.isArray(value.blocks) ? value.blocks : [],
    itemIds,
  );
  const relationValidation = validateArchiveRelations(
    Array.isArray(value.relations) ? value.relations : [],
    itemIds,
  );
  errors.push(...blockValidation.errors, ...relationValidation.errors);

  const archive: VaultArchive | undefined =
    errors.length === 0
      ? {
          archiveVersion: Number(value.archiveVersion),
          appName: String(value.appName),
          createdAt: normalizeString(value.createdAt) || new Date(0).toISOString(),
          provider: normalizeProvider(value.provider),
          source: normalizeSource(value.source),
          schemaVersion: normalizePositiveNumber(
            value.schemaVersion,
            MIZAAN_ARCHIVE_SCHEMA_VERSION,
          ),
          itemCount: normalizePositiveNumber(value.itemCount, normalized.items.length),
          blockCount: normalizePositiveNumber(
            value.blockCount,
            Array.isArray(value.blocks) ? value.blocks.length : 0,
          ),
          relationCount: normalizePositiveNumber(
            value.relationCount,
            Array.isArray(value.relations) ? value.relations.length : 0,
          ),
          items: normalized.items,
          blocks: normalizeArchiveBlocks(Array.isArray(value.blocks) ? value.blocks : []),
          relations: normalizeArchiveRelations(
            Array.isArray(value.relations) ? value.relations : [],
          ),
          trash: normalizeTrash(value.trash, normalized.items),
          templates: normalizeTemplates(value.templates, normalized.items),
          settings: normalizeRecord(value.settings),
          metadata: normalizeRecord(value.metadata),
          checksums: normalizeChecksums(value.checksums),
          warnings: normalizeStringArray(value.warnings),
          unsupportedFutureFields: isRecord(value.unsupportedFutureFields)
            ? normalizeRecord(value.unsupportedFutureFields)
            : undefined,
        }
      : undefined;

  return {
    valid: errors.length === 0,
    archive,
    errors,
    warnings,
  };
}

function validateArchiveBlocks(
  value: unknown[],
  itemIds: Set<string>,
): { errors: ArchiveValidationError[] } {
  const errors: ArchiveValidationError[] = [];
  const ids = new Set<string>();

  value.forEach((candidate, index) => {
    if (!isRecord(candidate)) {
      errors.push({
        code: "corrupt-block",
        message: "Archive block must be an object.",
        path: `blocks.${index}`,
      });
      return;
    }

    const id = normalizeString(candidate.id);
    const itemId = normalizeString(candidate.itemId);

    if (!isValidArchiveId(id)) {
      errors.push({
        code: "invalid-block-id",
        message: "Archive block id must be a non-empty stable id without whitespace.",
        path: `blocks.${index}.id`,
      });
    } else if (ids.has(id)) {
      errors.push({
        code: "duplicate-block-id",
        message: `Archive contains duplicate block id ${id}.`,
        path: `blocks.${index}.id`,
      });
    } else {
      ids.add(id);
    }

    if (!itemIds.has(itemId)) {
      errors.push({
        code: "orphan-block",
        message: `Archive block ${id || index} references missing item ${itemId || "(empty)"}.`,
        path: `blocks.${index}.itemId`,
      });
    }
  });

  return { errors };
}

function validateArchiveRelations(
  value: unknown[],
  itemIds: Set<string>,
): { errors: ArchiveValidationError[] } {
  const errors: ArchiveValidationError[] = [];
  const ids = new Set<string>();

  value.forEach((candidate, index) => {
    if (!isRecord(candidate)) {
      errors.push({
        code: "corrupt-relation",
        message: "Archive relation must be an object.",
        path: `relations.${index}`,
      });
      return;
    }

    const id = normalizeString(candidate.id);
    const sourceId = normalizeString(candidate.sourceId);
    const targetId = normalizeString(candidate.targetId);

    if (!isValidArchiveId(id)) {
      errors.push({
        code: "invalid-relation-id",
        message: "Archive relation id must be a non-empty stable id without whitespace.",
        path: `relations.${index}.id`,
      });
    } else if (ids.has(id)) {
      errors.push({
        code: "duplicate-relation-id",
        message: `Archive contains duplicate relation id ${id}.`,
        path: `relations.${index}.id`,
      });
    } else {
      ids.add(id);
    }

    if (!sourceId) {
      errors.push({
        code: "invalid-relation-source",
        message: "Archive relation sourceId must be non-empty.",
        path: `relations.${index}.sourceId`,
      });
    } else if (!itemIds.has(sourceId)) {
      errors.push({
        code: "orphan-relation",
        message: `Archive relation ${id || index} references missing source item ${sourceId}.`,
        path: `relations.${index}.sourceId`,
      });
    }

    if (!targetId) {
      errors.push({
        code: "invalid-relation-target",
        message: "Archive relation targetId must be non-empty.",
        path: `relations.${index}.targetId`,
      });
    } else if (!itemIds.has(targetId)) {
      errors.push({
        code: "orphan-relation",
        message: `Archive relation ${id || index} references missing target item ${targetId}.`,
        path: `relations.${index}.targetId`,
      });
    }
  });

  return { errors };
}

export function validateArchiveVersion(
  value: unknown,
  options: ArchiveVersionValidationOptions = {},
): ArchiveValidationResult {
  if (!isRecord(value)) {
    return invalidResult("corrupt-archive", "Archive must be a JSON object.");
  }

  const rawVersion = value.archiveVersion;
  const version = typeof rawVersion === "number" ? rawVersion : Number(rawVersion);
  if (!Number.isFinite(version) || version < 1) {
    return invalidResult(
      "invalid-archive-version",
      "Archive version must be a positive number.",
      "archiveVersion",
    );
  }

  if (version > MIZAAN_ARCHIVE_VERSION && !options.allowUnsupportedNewerArchive) {
    return invalidResult(
      "unsupported-archive-version",
      "Archive version is newer than this browser prototype supports.",
      "archiveVersion",
    );
  }

  return {
    valid: true,
    archive: undefined,
    errors: [],
    warnings:
      version > MIZAAN_ARCHIVE_VERSION ? ["Unsupported newer archive version allowed."] : [],
  };
}

export function rejectCorruptArchive(value: unknown): ArchiveValidationResult {
  return validateVaultArchive(value);
}

export function rejectWrongAppArchive(value: unknown): ArchiveValidationResult {
  return validateVaultArchive(value);
}

export function rejectUnsupportedNewerArchive(
  value: unknown,
  options: ArchiveVersionValidationOptions = {},
): ArchiveValidationResult {
  return validateArchiveVersion(value, options);
}

export function normalizeArchiveItems(value: unknown[]): NormalizeArchiveItemsResult {
  const errors: ArchiveValidationError[] = [];
  const ids = new Set<string>();
  const items: MizaanItem[] = [];

  value.forEach((candidate, index) => {
    if (!isRecord(candidate)) {
      errors.push({
        code: "corrupt-item",
        message: "Archive item must be an object.",
        path: `items.${index}`,
      });
      return;
    }

    const id = normalizeString(candidate.id);
    if (!isValidArchiveId(id)) {
      errors.push({
        code: "invalid-item-id",
        message: "Archive item id must be a non-empty stable id without whitespace.",
        path: `items.${index}.id`,
      });
      return;
    }

    if (ids.has(id)) {
      errors.push({
        code: "duplicate-item-id",
        message: `Archive contains duplicate item id ${id}.`,
        path: `items.${index}.id`,
      });
      return;
    }

    ids.add(id);
    items.push({
      id,
      type: normalizeString(candidate.type) as MizaanItem["type"],
      category: normalizeString(candidate.category) as MizaanItem["category"],
      title: normalizeString(candidate.title) || "Untitled",
      icon: normalizeOptionalString(candidate.icon),
      cover: normalizeOptionalString(candidate.cover),
      summary: normalizeString(candidate.summary),
      status: normalizeOptionalString(candidate.status),
      tags: normalizeStringArray(candidate.tags),
      createdAt: normalizeString(candidate.createdAt),
      updatedAt: normalizeString(candidate.updatedAt),
      archivedAt: normalizeOptionalString(candidate.archivedAt),
      deletedAt: normalizeOptionalString(candidate.deletedAt),
      parentId: normalizeOptionalString(candidate.parentId),
      properties: normalizeRecord(candidate.properties),
      attachedFiles: normalizeAttachedFiles(candidate.attachedFiles),
      metadata: normalizeRecord(candidate.metadata),
    });
  });

  return {
    valid: errors.length === 0,
    items,
    errors,
  };
}

export function preserveUnknownSafeFields(
  source: Record<string, unknown>,
  knownFields: string[],
): Record<string, PropertyValue> {
  const known = new Set(knownFields);
  return Object.fromEntries(
    Object.entries(source)
      .filter(([key, value]) => !known.has(key) && toPropertyValue(value) !== undefined)
      .map(([key, value]) => [key, toPropertyValue(value) as PropertyValue]),
  );
}

export function getArchiveItemCounts(
  archive: Pick<VaultArchive, "items" | "blocks" | "relations">,
) {
  return {
    items: archive.items.length,
    blocks: archive.blocks.length,
    relations: archive.relations.length,
    archived: archive.items.filter((item) => item.archivedAt).length,
    deleted: archive.items.filter((item) => item.deletedAt).length,
  };
}

export function summarizeVaultArchive(archive: VaultArchive): string {
  const counts = getArchiveItemCounts(archive);
  return `${counts.items} items, ${counts.blocks} blocks, ${counts.relations} relations, ${counts.archived} archived, ${counts.deleted} deleted`;
}

export function previewVaultRestore(
  current: VaultSnapshot,
  archiveValue: unknown,
  options: RestorePlanOptions = {},
): RestorePlanResult {
  return createRestorePlan(current, archiveValue, options);
}

export function createRestorePlan(
  current: VaultSnapshot,
  archiveValue: unknown,
  options: RestorePlanOptions = {},
): RestorePlanResult {
  const validation = validateVaultArchive(archiveValue, options);
  if (!validation.valid || !validation.archive) {
    return {
      valid: false,
      errors: validation.errors,
      warnings: validation.warnings,
    };
  }

  const archive = validation.archive;
  const mode = options.mode ?? "merge";
  const requiresConfirmation = mode === "replace";
  const summary = createPlanSummary(current, archive, mode);
  const warnings = [...validation.warnings];
  if (archive.items.length === 0) warnings.push("Archive contains an empty item set.");
  if (mode === "replace")
    warnings.push("Replace restore removes current records absent from archive.");

  const plan: VaultRestorePlan = {
    mode,
    requiresConfirmation,
    confirmedReplace: options.confirmedReplace === true,
    archive,
    summary,
    createItemIds: diffIds(current.items, archive.items).created,
    updateItemIds: diffIds(current.items, archive.items).updated,
    unchangedItemIds: diffIds(current.items, archive.items).unchanged,
    removeItemIds: mode === "replace" ? diffIds(current.items, archive.items).removed : [],
    createBlockIds: diffIds(current.blocks, archive.blocks).created,
    updateBlockIds: diffIds(current.blocks, archive.blocks).updated,
    unchangedBlockIds: diffIds(current.blocks, archive.blocks).unchanged,
    removeBlockIds: mode === "replace" ? diffIds(current.blocks, archive.blocks).removed : [],
    createRelationIds: diffIds(current.relations, archive.relations).created,
    updateRelationIds: diffIds(current.relations, archive.relations).updated,
    unchangedRelationIds: diffIds(current.relations, archive.relations).unchanged,
    removeRelationIds:
      mode === "replace" ? diffIds(current.relations, archive.relations).removed : [],
    warnings,
  };

  return {
    valid: true,
    plan,
    errors: [],
    warnings,
  };
}

export function applyRestorePlan(current: VaultSnapshot, plan: VaultRestorePlan): VaultSnapshot {
  const archive = plan.archive;
  const items = mergeRecords(current.items, archive.items, plan.mode);
  const blocks = mergeRecords(current.blocks, archive.blocks, plan.mode);
  const relations = mergeRecords(current.relations, archive.relations, plan.mode);

  return snapshotFromData(current, items, blocks, relations);
}

export function restoreVaultArchive(
  current: VaultSnapshot,
  archiveValue: unknown,
  options: RestorePlanOptions = {},
): RestoreResult {
  const plan = createRestorePlan(current, archiveValue, options);
  if (!plan.valid || !plan.plan) {
    return {
      ok: false,
      errors: plan.errors,
      warnings: plan.warnings,
    };
  }

  if (plan.plan.mode === "replace" && !plan.plan.confirmedReplace) {
    return {
      ok: false,
      plan: plan.plan,
      errors: [
        {
          code: "replace-not-confirmed",
          message: "Replace restore requires explicit confirmation.",
        },
      ],
      warnings: plan.warnings,
    };
  }

  return {
    ok: true,
    snapshot: applyRestorePlan(current, plan.plan),
    plan: plan.plan,
    errors: [],
    warnings: plan.warnings,
  };
}

export function mergeVaultArchive(
  current: VaultSnapshot,
  archiveValue: unknown,
  options: Omit<RestorePlanOptions, "mode"> = {},
): RestoreResult {
  return restoreVaultArchive(current, archiveValue, { ...options, mode: "merge" });
}

export function replaceVaultArchive(
  current: VaultSnapshot,
  archiveValue: unknown,
  options: Omit<RestorePlanOptions, "mode"> = {},
): RestoreResult {
  return restoreVaultArchive(current, archiveValue, { ...options, mode: "replace" });
}

function createPlanSummary(
  current: VaultSnapshot,
  archive: VaultArchive,
  mode: RestoreMode,
): RestorePlanSummary {
  const itemDiff = diffIds(current.items, archive.items);
  const blockDiff = diffIds(current.blocks, archive.blocks);
  const relationDiff = diffIds(current.relations, archive.relations);

  return {
    itemCreates: itemDiff.created.length,
    itemUpdates: itemDiff.updated.length,
    itemUnchanged: itemDiff.unchanged.length,
    itemRemovals: mode === "replace" ? itemDiff.removed.length : 0,
    blockCreates: blockDiff.created.length,
    blockReplacements:
      blockDiff.updated.length + (mode === "replace" ? blockDiff.created.length : 0),
    blockUnchanged: blockDiff.unchanged.length,
    blockRemovals: mode === "replace" ? blockDiff.removed.length : 0,
    relationCreates: relationDiff.created.length,
    relationUpdates: relationDiff.updated.length,
    relationUnchanged: relationDiff.unchanged.length,
    relationRemovals: mode === "replace" ? relationDiff.removed.length : 0,
  };
}

function diffIds<T extends { id: string }>(current: T[], incoming: T[]) {
  const currentById = new Map(current.map((entry) => [entry.id, entry]));
  const incomingById = new Map(incoming.map((entry) => [entry.id, entry]));
  const created: string[] = [];
  const updated: string[] = [];
  const unchanged: string[] = [];
  const removed: string[] = [];

  for (const entry of incoming) {
    const existing = currentById.get(entry.id);
    if (!existing) {
      created.push(entry.id);
      continue;
    }

    if (stableStringify(existing) === stableStringify(entry)) {
      unchanged.push(entry.id);
    } else {
      updated.push(entry.id);
    }
  }

  for (const entry of current) {
    if (!incomingById.has(entry.id)) removed.push(entry.id);
  }

  return { created, updated, unchanged, removed };
}

function mergeRecords<T extends { id: string }>(
  current: T[],
  incoming: T[],
  mode: RestoreMode,
): T[] {
  if (mode === "replace") return cloneJson(incoming);

  const incomingById = new Map(incoming.map((entry) => [entry.id, entry]));
  const merged = current.map((entry) => cloneJson(incomingById.get(entry.id) ?? entry));
  const currentIds = new Set(current.map((entry) => entry.id));
  for (const entry of incoming) {
    if (!currentIds.has(entry.id)) merged.push(cloneJson(entry));
  }
  return merged;
}

function snapshotFromData(
  current: VaultSnapshot,
  items: MizaanItem[],
  blocks: MizaanBlock[],
  relations: MizaanRelation[],
): VaultSnapshot {
  return {
    items,
    blocks,
    relations,
    providerInfo: current.providerInfo,
    health: {
      ...current.health,
      itemCount: items.length,
      blockCount: blocks.length,
      relationCount: relations.length,
      archivedCount: items.filter((item) => item.archivedAt).length,
      deletedCount: items.filter((item) => item.deletedAt).length,
    },
  };
}

function normalizeArchiveBlocks(value: unknown[]): MizaanBlock[] {
  return value.filter(isRecord).map((candidate): MizaanBlock => {
    return {
      id: normalizeString(candidate.id),
      itemId: normalizeString(candidate.itemId),
      type: normalizeString(candidate.type) as MizaanBlock["type"],
      content: normalizeString(candidate.content),
      order: normalizePositiveNumber(candidate.order, 0),
      checked: typeof candidate.checked === "boolean" ? candidate.checked : undefined,
      createdAt: normalizeString(candidate.createdAt),
      updatedAt: normalizeString(candidate.updatedAt),
    };
  });
}

function normalizeArchiveRelations(value: unknown[]): MizaanRelation[] {
  return value.filter(isRecord).map((candidate): MizaanRelation => {
    return {
      id: normalizeString(candidate.id),
      sourceId: normalizeString(candidate.sourceId),
      targetId: normalizeString(candidate.targetId),
      relationType: normalizeString(candidate.relationType) || "related",
      label: normalizeString(candidate.label) || "Related",
      createdAt: normalizeString(candidate.createdAt),
      metadata: normalizeRecord(candidate.metadata),
    };
  });
}

function normalizeProvider(value: unknown): VaultArchiveProviderSummary {
  const provider = isRecord(value) ? value : {};
  return {
    id: normalizeString(provider.id) || "unknown",
    name: normalizeString(provider.name) || "Unknown provider",
    mode: normalizeString(provider.mode) || "prototype-local",
    storageLabel: normalizeString(provider.storageLabel) || "Unknown storage",
  };
}

function normalizeSource(value: unknown): VaultArchiveSourceSummary {
  const source = isRecord(value) ? value : {};
  return {
    kind: "browser-localStorage-prototype",
    warning:
      normalizeString(source.warning) ||
      "This archive is a browser/localStorage prototype archive, not a native filesystem backup.",
  };
}

function normalizeTrash(value: unknown, items: MizaanItem[]) {
  if (isRecord(value)) {
    return {
      archivedItemIds: normalizeStringArray(value.archivedItemIds),
      deletedItemIds: normalizeStringArray(value.deletedItemIds),
    };
  }

  return {
    archivedItemIds: items.filter((item) => item.archivedAt).map((item) => item.id),
    deletedItemIds: items.filter((item) => item.deletedAt).map((item) => item.id),
  };
}

function normalizeTemplates(value: unknown, items: MizaanItem[]) {
  if (isRecord(value)) {
    const templateItemIds = normalizeStringArray(value.templateItemIds);
    return {
      templateItemIds,
      customTemplateCount: normalizePositiveNumber(
        value.customTemplateCount,
        templateItemIds.length,
      ),
    };
  }

  const templateItemIds = items
    .filter((item) => item.category === "templates" || item.type === "template")
    .map((item) => item.id);
  return {
    templateItemIds,
    customTemplateCount: templateItemIds.length,
  };
}

function normalizeChecksums(value: unknown) {
  const checksums = isRecord(value) ? value : {};
  return {
    items: normalizeString(checksums.items),
    blocks: normalizeString(checksums.blocks),
    relations: normalizeString(checksums.relations),
  };
}

function normalizeAttachedFiles(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.filter(isRecord).map((file) => ({
    id: normalizeString(file.id),
    name: normalizeString(file.name),
    kind: normalizeString(file.kind),
    sizeLabel: normalizeOptionalString(file.sizeLabel),
    localPath: normalizeOptionalString(file.localPath),
    missing: typeof file.missing === "boolean" ? file.missing : undefined,
  }));
}

function normalizeRecord(value: unknown): Record<string, PropertyValue> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([key, entry]) => [key, toPropertyValue(entry)] as const)
      .filter((entry): entry is readonly [string, PropertyValue] => entry[1] !== undefined),
  );
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return Array.from(
    new Set(value.map((entry) => normalizeString(entry)).filter((entry) => entry.length > 0)),
  );
}

function normalizeString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeOptionalString(value: unknown): string | undefined {
  const normalized = normalizeString(value);
  return normalized || undefined;
}

function normalizePositiveNumber(value: unknown, fallback: number): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) && numberValue >= 0 ? numberValue : fallback;
}

function isValidArchiveId(value: string): boolean {
  return /^[A-Za-z0-9._:-]+$/.test(value);
}

function stableChecksum(value: unknown): string {
  return String(stableStringify(value).length);
}

function stableStringify(value: unknown): string {
  return JSON.stringify(sortJson(value));
}

function sortJson(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sortJson);
  if (!isRecord(value)) return value;
  return Object.fromEntries(
    Object.entries(value)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, entry]) => [key, sortJson(entry)]),
  );
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function toPropertyValue(value: unknown): PropertyValue | undefined {
  if (value === null) return null;
  if (["string", "number", "boolean"].includes(typeof value)) return value as PropertyValue;
  if (Array.isArray(value)) {
    const array = value
      .map((entry) => toPropertyValue(entry))
      .filter((entry): entry is PropertyValue => entry !== undefined);
    return array as PropertyValue;
  }
  if (isRecord(value)) {
    return normalizeRecord(value) as PropertyValue;
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidResult(code: string, message: string, path?: string): ArchiveValidationResult {
  return {
    valid: false,
    errors: [{ code, message, path }],
    warnings: [],
  };
}
