import { describe, expect, it } from "vitest";

import {
  applyRestorePlan,
  createRestorePlan,
  createVaultArchive,
  getArchiveItemCounts,
  mergeVaultArchive,
  normalizeArchiveItems,
  parseVaultArchiveJson,
  preserveUnknownSafeFields,
  previewVaultRestore,
  rejectCorruptArchive,
  rejectUnsupportedNewerArchive,
  rejectWrongAppArchive,
  replaceVaultArchive,
  restoreVaultArchive,
  summarizeVaultArchive,
  validateArchiveVersion,
  validateVaultArchive,
} from "./vault-archive";
import { computeFinanceTotals, createDefaultFinanceMetadata } from "../finance/finance-record";
import { createDefaultPersonMetadata } from "../people/person-record";
import { createDefaultProjectMetadata } from "../projects/project-record";
import { createDefaultTaskMetadata } from "../tasks/task-record";
import { createDefaultDocumentMetadata } from "../documents/document-record";
import { createDefaultTrackerMetadata } from "../trackers/tracker-record";
import { createDefaultGoalMetadata } from "../goals/goal-record";
import { buildGlobalGraph } from "../graph/graph-model";
import { buildSearchResults } from "../search/search-index";
import { LocalStorageVaultProvider, createMemoryStorage } from "./local-storage-vault-provider";
import type {
  ItemCategory,
  ItemType,
  MizaanBlock,
  MizaanItem,
  MizaanRelation,
  VaultSnapshot,
} from "./types";

const now = "2026-06-03T04:30:00.000Z";

function item(
  id: string,
  input: Partial<MizaanItem> & { category?: ItemCategory; type?: ItemType } = {},
): MizaanItem {
  const category = input.category ?? "notes";
  return {
    id,
    type: input.type ?? "note",
    category,
    title: input.title ?? id,
    icon: input.icon ?? id.slice(0, 1).toUpperCase(),
    summary: input.summary ?? "",
    status: input.status ?? "Active",
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? "2026-06-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-03T00:00:00.000Z",
    archivedAt: input.archivedAt,
    deletedAt: input.deletedAt,
    parentId: input.parentId,
    properties: input.properties ?? {},
    attachedFiles: input.attachedFiles ?? [],
    metadata: input.metadata ?? {},
  };
}

function block(id: string, itemId: string, input: Partial<MizaanBlock> = {}): MizaanBlock {
  return {
    id,
    itemId,
    type: input.type ?? "paragraph",
    content: input.content ?? `Block ${id}`,
    order: input.order ?? 0,
    checked: input.checked,
    createdAt: input.createdAt ?? "2026-06-03T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-03T00:00:00.000Z",
  };
}

function relation(
  input: Partial<MizaanRelation> & Pick<MizaanRelation, "sourceId" | "targetId">,
): MizaanRelation {
  return {
    id: input.id ?? `${input.sourceId}-${input.targetId}`,
    sourceId: input.sourceId,
    targetId: input.targetId,
    relationType: input.relationType ?? "related",
    label: input.label ?? "Related",
    createdAt: input.createdAt ?? "2026-06-03T00:00:00.000Z",
    metadata: input.metadata ?? {},
  };
}

function snapshot(input: Partial<VaultSnapshot> = {}): VaultSnapshot {
  const items = input.items ?? [
    item("note-1", { title: "Note 1" }),
    item("doc-1", { category: "documents", type: "document", title: "Document 1" }),
  ];
  const blocks = input.blocks ?? [block("block-1", "note-1")];
  const relations = input.relations ?? [
    relation({ id: "rel-1", sourceId: "note-1", targetId: "doc-1" }),
  ];

  return {
    items,
    blocks,
    relations,
    providerInfo: input.providerInfo ?? {
      id: "local-storage",
      name: "LocalStorageVaultProvider",
      mode: "prototype-local",
      storageLabel: "Browser localStorage prototype",
      warning: "Prototype browser storage is active.",
      capabilities: {
        itemCrud: true,
        blockCrud: true,
        relations: true,
        localStoragePrototype: true,
        portableFolder: false,
        sqlite: false,
        tauriFilesystem: false,
        markdownMirrors: false,
      },
    },
    health: input.health ?? {
      providerId: "local-storage",
      itemCount: items.length,
      blockCount: blocks.length,
      relationCount: relations.length,
      archivedCount: items.filter((entry) => entry.archivedAt).length,
      deletedCount: items.filter((entry) => entry.deletedAt).length,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: now,
      warnings: ["Prototype browser storage only."],
    },
  };
}

function richSnapshot() {
  return snapshot({
    items: [
      item("project-1", {
        category: "projects",
        type: "project",
        title: "Archive Project",
        metadata: createDefaultProjectMetadata({
          projectTitle: "Archive Project",
          linkedTaskIds: ["task-1"],
          linkedDocumentIds: ["doc-1"],
          linkedPersonIds: ["person-1"],
          linkedFinanceIds: ["finance-1"],
          customProjectField: "kept",
        }),
      }),
      item("task-1", {
        category: "tasks",
        type: "task",
        title: "Archive Task",
        metadata: createDefaultTaskMetadata({
          taskTitle: "Archive Task",
          taskProjectId: "project-1",
          linkedDocumentIds: ["doc-1"],
          linkedPersonIds: ["person-1"],
          linkedFinanceIds: ["finance-1"],
        }),
      }),
      item("person-1", {
        category: "people",
        type: "person",
        title: "Archive Person",
        metadata: createDefaultPersonMetadata({
          displayName: "Archive Person",
          private: true,
          sensitive: true,
          linkedProjectIds: ["project-1"],
          linkedTaskIds: ["task-1"],
          linkedDocumentIds: ["doc-1"],
          linkedFinanceIds: ["finance-1"],
        }),
      }),
      item("doc-1", {
        category: "documents",
        type: "document",
        title: "Archive Document",
        metadata: createDefaultDocumentMetadata({
          documentTitle: "Archive Document",
          fileName: "archive.pdf",
          linkedProjectIds: ["project-1"],
          linkedPersonIds: ["person-1"],
          linkedFinanceIds: ["finance-1"],
          documentCustomField: "kept",
        }),
      }),
      item("finance-1", {
        category: "finance",
        type: "finance",
        title: "Archive Finance",
        metadata: createDefaultFinanceMetadata({
          financeTitle: "Archive Finance",
          financeKind: "transaction",
          transactionType: "expense",
          financeStatus: "pending",
          amount: 123.45,
          currency: "MYR",
          merchant: "Archive Merchant",
          private: true,
          sensitive: true,
          linkedDocumentIds: ["doc-1"],
          linkedProjectIds: ["project-1"],
          linkedTaskIds: ["task-1"],
          linkedPersonIds: ["person-1"],
          linkedCalendarEventIds: ["calendar-1"],
          financeCustomField: "kept",
        }),
      }),
      item("calendar-1", {
        category: "calendar",
        type: "calendar",
        title: "Archive Calendar",
        metadata: { calendarEvent: true },
      }),
      item("archived-1", {
        title: "Archived item",
        archivedAt: "2026-06-02T00:00:00.000Z",
      }),
      item("deleted-1", {
        title: "Deleted item",
        deletedAt: "2026-06-02T00:00:00.000Z",
      }),
    ],
    blocks: [block("block-project", "project-1"), block("block-finance", "finance-1")],
    relations: [
      relation({ id: "rel-project-doc", sourceId: "project-1", targetId: "doc-1" }),
      relation({ id: "rel-person-finance", sourceId: "person-1", targetId: "finance-1" }),
    ],
  });
}

describe("vault archive helpers", () => {
  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });

    expect(archive.items).toHaveLength(8);
    expect(archive.blocks).toHaveLength(2);
    expect(archive.relations).toHaveLength(2);
    expect(archive.itemCount).toBe(8);
    expect(archive.trash.archivedItemIds).toEqual(["archived-1"]);
    expect(archive.trash.deletedItemIds).toEqual(["deleted-1"]);
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });

    expect(archive.archiveVersion).toBe(1);
    expect(archive.appName).toBe("Mizaan");
    expect(archive.createdAt).toBe(now);
    expect(archive.schemaVersion).toBe(1);
    expect(archive.provider.id).toBe("local-storage");
    expect(archive.source.kind).toBe("browser-localStorage-prototype");
    expect(archive.warnings.join(" ")).toContain("not a native filesystem backup");
    expect(getArchiveItemCounts(archive)).toMatchObject({
      items: 8,
      blocks: 2,
      relations: 2,
      archived: 1,
      deleted: 1,
    });
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const validation = validateVaultArchive(archive);

    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
    expect(validation.archive?.items[0]?.id).toBe("project-1");
  });

  it(``, async () => {
    const validation = parseVaultArchiveJson("{bad json");

    expect(validation.valid).toBe(false);
    expect(validation.archive).toBeUndefined();
    expect(validation.errors.map((error) => error.code)).toContain("invalid-json");
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const validation = rejectWrongAppArchive({ ...archive, appName: "OtherApp" });

    expect(validation.valid).toBe(false);
    expect(validation.errors.map((error) => error.code)).toContain("wrong-app");
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const { items: _items, ...withoutItems } = archive;
    const validation = validateVaultArchive(withoutItems);

    expect(validation.valid).toBe(false);
    expect(validation.errors.map((error) => error.code)).toContain("missing-items");
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const futureArchive = { ...archive, archiveVersion: 999 };

    expect(validateArchiveVersion(futureArchive).valid).toBe(false);
    expect(rejectUnsupportedNewerArchive(futureArchive).errors[0]?.code).toBe(
      "unsupported-archive-version",
    );
    expect(
      validateArchiveVersion(futureArchive, { allowUnsupportedNewerArchive: true }).valid,
    ).toBe(true);
  });

  it(``, async () => {
    const current = richSnapshot();
    current.items[0].metadata.customUnknownField = "kept";
    const archive = createVaultArchive(current, {
      createdAt: now,
      metadata: { customArchiveField: "kept" },
      unsupportedFutureFields: { futureSafeField: "preserved" },
    });
    const parsed = parseVaultArchiveJson(JSON.stringify(archive));

    expect(parsed.valid).toBe(true);
    expect(parsed.archive?.metadata.customArchiveField).toBe("kept");
    expect(parsed.archive?.unsupportedFutureFields?.futureSafeField).toBe("preserved");
    expect(parsed.archive?.items[0]?.metadata.customUnknownField).toBe("kept");
    expect(preserveUnknownSafeFields({ known: "skip", custom: "keep" }, ["known"])).toEqual({
      custom: "keep",
    });
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const parsed = parseVaultArchiveJson(JSON.stringify(archive));
    const finance = parsed.archive?.items.find((entry) => entry.id === "finance-1");

    expect(finance?.metadata.financeTitle).toBe("Archive Finance");
    expect(finance?.metadata.amount).toBe(123.45);
    expect(finance?.metadata.currency).toBe("MYR");
    expect(finance?.metadata.private).toBe(true);
    expect(finance?.metadata.sensitive).toBe(true);
    expect(finance?.metadata.financeCustomField).toBe("kept");
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const person = restored.snapshot?.items.find((entry) => entry.id === "person-1");

    expect(restored.ok).toBe(true);
    expect(person?.metadata.displayName).toBe("Archive Person");
    expect(person?.metadata.private).toBe(true);
    expect(person?.metadata.sensitive).toBe(true);
    expect(person?.metadata.linkedFinanceIds).toEqual(["finance-1"]);
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const project = restored.snapshot?.items.find((entry) => entry.id === "project-1");
    const task = restored.snapshot?.items.find((entry) => entry.id === "task-1");

    expect(project?.metadata.projectTitle).toBe("Archive Project");
    expect(project?.metadata.linkedTaskIds).toEqual(["task-1"]);
    expect(task?.metadata.taskProjectId).toBe("project-1");
    expect(task?.metadata.linkedFinanceIds).toEqual(["finance-1"]);
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const document = restored.snapshot?.items.find((entry) => entry.id === "doc-1");

    expect(document?.metadata.documentTitle).toBe("Archive Document");
    expect(document?.metadata.fileName).toBe("archive.pdf");
    expect(document?.metadata.documentCustomField).toBe("kept");
    expect(document?.metadata.linkedProjectIds).toEqual(["project-1"]);
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const graph = buildGlobalGraph({
      items: restored.snapshot?.items ?? [],
      relations: restored.snapshot?.relations ?? [],
    });

    expect(graph.edges.some((edge) => edge.id === "project-1->doc-1:relation")).toBe(true);
    expect(graph.edges.some((edge) => edge.id === "finance-1->person-1:person-link")).toBe(true);
    expect(graph.summary.relationSourceCounts["finance-metadata"]).toBeGreaterThan(0);
  });

  it(``, async () => {
    const current = snapshot({
      items: [item("project-1", { title: "Old Project" }), item("stale-1")],
      blocks: [block("old-block", "project-1")],
      relations: [],
    });
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const preview = previewVaultRestore(current, archive, { mode: "replace" });

    expect(preview.valid).toBe(true);
    expect(preview.plan?.summary.itemCreates).toBe(7);
    expect(preview.plan?.summary.itemUpdates).toBe(1);
    expect(preview.plan?.summary.itemRemovals).toBe(1);
    expect(preview.plan?.summary.blockReplacements).toBe(2);
    expect(preview.plan?.requiresConfirmation).toBe(true);
  });

  it(``, async () => {
    const current = snapshot({ items: [item("project-1", { title: "Old Project" })] });
    const before = JSON.stringify(current);
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });

    previewVaultRestore(current, archive, { mode: "merge" });

    expect(JSON.stringify(current)).toBe(before);
    expect(current.items[0].title).toBe("Old Project");
  });

  it(``, async () => {
    const current = snapshot({
      items: [item("project-1", { title: "Old Project" })],
      blocks: [],
      relations: [],
    });
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const plan = createRestorePlan(current, archive, { mode: "merge" });
    const next = applyRestorePlan(current, plan.plan!);

    expect(plan.valid).toBe(true);
    expect(next.items).toHaveLength(8);
    expect(next.items.find((entry) => entry.id === "project-1")?.title).toBe("Archive Project");
    expect(next.items.some((entry) => entry.id === "stale-1")).toBe(false);
  });

  it(``, async () => {
    const current = snapshot({ items: [item("stale-1")], blocks: [], relations: [] });
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });

    const blocked = replaceVaultArchive(current, archive);
    const confirmed = replaceVaultArchive(current, archive, { confirmedReplace: true });

    expect(blocked.ok).toBe(false);
    expect(blocked.errors.map((error) => error.code)).toContain("replace-not-confirmed");
    expect(confirmed.ok).toBe(true);
    expect(confirmed.snapshot?.items.some((entry) => entry.id === "stale-1")).toBe(false);
  });

  it(``, async () => {
    const archive = createVaultArchive(snapshot({ items: [item("bad id with spaces")] }), {
      createdAt: now,
    });
    const validation = validateVaultArchive(archive);

    expect(validation.valid).toBe(false);
    expect(validation.errors.map((error) => error.code)).toContain("invalid-item-id");
    expect(normalizeArchiveItems(archive.items).valid).toBe(false);
  });

  it(``, async () => {
    const duplicate = item("dup-1");
    const archive = createVaultArchive(
      snapshot({ items: [duplicate, { ...duplicate, title: "Dup 2" }] }),
      {
        createdAt: now,
      },
    );
    const validation = validateVaultArchive(archive);

    expect(validation.valid).toBe(false);
    expect(validation.errors.map((error) => error.code)).toContain("duplicate-item-id");
  });

  it(``, async () => {
    const current = snapshot({ items: [item("keep-1")] });
    const before = JSON.stringify(current);
    const corrupt = rejectCorruptArchive({ appName: "Mizaan", archiveVersion: 1 });
    const result = restoreVaultArchive(
      current,
      { appName: "Mizaan", archiveVersion: 1 },
      { mode: "merge" },
    );

    expect(corrupt.valid).toBe(false);
    expect(result.ok).toBe(false);
    expect(JSON.stringify(current)).toBe(before);
    expect(current.items).toHaveLength(1);
  });

  it(``, async () => {
    const archive = createVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), {
      createdAt: now,
    });
    const preview = previewVaultRestore(snapshot({ items: [item("current-1")] }), archive, {
      mode: "merge",
    });

    expect(validateVaultArchive(archive).valid).toBe(true);
    expect(preview.plan?.summary.itemCreates).toBe(0);
    expect(preview.plan?.warnings.join(" ")).toContain("empty");
  });

  it(``, async () => {
    const original = richSnapshot();
    const archive = createVaultArchive(original, { createdAt: now });
    const parsed = parseVaultArchiveJson(JSON.stringify(archive));
    const restored = mergeVaultArchive(
      snapshot({ items: [], blocks: [], relations: [] }),
      parsed.archive!,
    );
    const exportedAgain = createVaultArchive(restored.snapshot!, { createdAt: now });

    expect(parsed.valid).toBe(true);
    expect(restored.ok).toBe(true);
    expect(getArchiveItemCounts(exportedAgain)).toEqual(getArchiveItemCounts(archive));
  });

  it(``, async () => {
    const storage = createMemoryStorage();
    const provider = new LocalStorageVaultProvider({
      storage,
      seedOnEmpty: false,
      now: () => now,
      idFactory: (prefix) => `${prefix}-1`,
    });
    const created = await provider.createItem({
      title: "Keep me",
      category: "notes",
      type: "note",
    });
    const current = await provider.getSnapshot();
    const before = storage.getItem("mizaan.prototype.vault.v1");
    const archive = createVaultArchive(snapshot({ items: [item("incoming-1")] }), {
      createdAt: now,
    });

    previewVaultRestore(current, archive, { mode: "merge" });

    expect((await provider.getItem(created.id))?.title).toBe("Keep me");
    expect(storage.getItem("mizaan.prototype.vault.v1")).toBe(before);
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const totals = computeFinanceTotals(restored.snapshot?.items ?? [], "2026-06-03");

    expect(totals.recordCount).toBe(1);
    expect(totals.transactionCount).toBe(1);
    expect(totals.expenseTotal).toBe(123.45);
    expect(totals.pendingCount).toBe(1);
  });

  it(``, async () => {
    const source = snapshot({
      items: [
        item("tracker-1", {
          category: "trackers",
          type: "tracker",
          title: "Read daily",
          metadata: createDefaultTrackerMetadata({
            trackerTitle: "Read daily",
            trackerType: "reading",
            trackerStatus: "active",
            frequency: "daily",
            targetValue: 30,
            currentValue: 12,
            unit: "minutes",
            linkedProjectIds: ["project-1"],
            checkIns: [
              {
                id: "check-1",
                date: "2026-06-03",
                value: 12,
                unit: "minutes",
                note: "Read one chapter",
                createdAt: "2026-06-03T05:00:00.000Z",
              },
            ],
          }),
        }),
        item("goal-1", {
          category: "goals",
          type: "goal",
          title: "Finish course",
          metadata: createDefaultGoalMetadata({
            goalTitle: "Finish course",
            goalStatus: "active",
            goalHorizon: "medium-term",
            priority: "high",
            linkedTrackerIds: ["tracker-1"],
            progressValue: 45,
            progressUnit: "%",
          }),
        }),
      ],
    });

    const archive = createVaultArchive(source, { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const tracker = restored.snapshot?.items.find((entry) => entry.id === "tracker-1");
    const goal = restored.snapshot?.items.find((entry) => entry.id === "goal-1");

    expect(tracker?.metadata).toMatchObject({
      trackerTitle: "Read daily",
      trackerType: "reading",
      trackerStatus: "active",
      fakeStreaks: false,
      checkIns: [
        expect.objectContaining({
          id: "check-1",
          value: 12,
          note: "Read one chapter",
        }),
      ],
    });
    expect(goal?.metadata).toMatchObject({
      goalTitle: "Finish course",
      goalStatus: "active",
      goalHorizon: "medium-term",
      linkedTrackerIds: ["tracker-1"],
      fakeProgressHistory: false,
    });
  });

  it(``, async () => {
    const archive = createVaultArchive(richSnapshot(), { createdAt: now });
    const restored = mergeVaultArchive(snapshot({ items: [], blocks: [], relations: [] }), archive);
    const search = buildSearchResults(restored.snapshot!, { query: "Archive Merchant" });
    const graph = buildGlobalGraph({
      items: restored.snapshot?.items ?? [],
      relations: restored.snapshot?.relations ?? [],
    });
    const summary = summarizeVaultArchive(archive);

    expect(search[0]?.item?.id).toBe("finance-1");
    expect(graph.edges.some((edge) => edge.sourceId === "finance-1")).toBe(true);
    expect(summary).toContain("8 items");
    expect(summary).toContain("2 relations");
  });
});
