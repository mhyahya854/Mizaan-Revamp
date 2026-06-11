import { describe, expect, it } from "vitest";

import {
  buildPageWorkspaceModel,
  createChildPage,
  createPageFromTemplate,
  getImplementedSlashCommands,
  getImplementedTemplates,
} from "./page-workspace";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import { buildSidebarPageTree, buildSidebarTrees } from "@/lib/sidebar/sidebar-tree";

function createProvider() {
  let sequence = 0;
  return new LocalStorageVaultProvider({
    storage: createMemoryStorage(),
    now: () => "2026-05-29T00:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
    seedOnEmpty: false,
  });
}

describe("page workspace model", () => {
  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Plain page",
      category: "notes",
      type: "note",
    });

    const model = buildPageWorkspaceModel(provider, item?.id, await provider.getSnapshot());

    expect(model.state).toBe("ready");
    expect(model.item.icon).toBe("N");
    expect(model.blocks).toEqual([]);
    expect(model.properties.blocksCount).toBe(0);
  });

  it(``, async () => {
    const provider = createProvider();
    const parent = await provider.createItem({ title: "Parent", category: "notes", type: "note" });
    const child = await provider.createItem({
      title: "Child",
      category: "notes",
      type: "note",
      parentId: parent.id,
    });

    const model = buildPageWorkspaceModel(provider, child.id, await provider.getSnapshot());

    expect(model.breadcrumbs.map((crumb) => crumb.label)).toEqual([
      "Home",
      "Notes",
      "Parent",
      "Child",
    ]);
  });

  it(``, async () => {
    const provider = createProvider();
    const parent = await provider.createItem({
      title: "Parent",
      category: "projects",
      type: "project",
    });

    const child = await createChildPage(provider, parent.id, "Subpage");

    expect(child.parentId).toBe(parent.id);
    expect((await provider.getItem(child.id))?.title).toBe("Subpage");
    expect(
      buildPageWorkspaceModel(provider, parent.id, await provider.getSnapshot()).childPages[0]?.id,
    ).toBe(child.id);
  });

  it(``, async () => {
    const provider = createProvider();
    const source = await provider.createItem({ title: "Source", category: "notes", type: "note" });
    const target = await provider.createItem({
      title: "Target",
      category: "documents",
      type: "document",
    });
    await provider.createRelation({
      sourceId: source.id,
      targetId: target.id,
      relationType: "note_to_document",
      label: "Evidence",
    });

    expect(
      buildPageWorkspaceModel(provider, source.id, await provider.getSnapshot()).outgoingLinks[0]
        ?.target.title,
    ).toBe("Target");
    expect(
      buildPageWorkspaceModel(provider, target.id, await provider.getSnapshot()).backlinks[0]
        ?.source.title,
    ).toBe("Source");
  });

  it("resolves wiki-link outgoing links and backlinks from page blocks", async () => {
    const provider = createProvider();
    const source = await provider.createItem({ title: "Source", category: "notes", type: "note" });
    const target = await provider.createItem({
      title: "Target Page",
      category: "notes",
      type: "note",
    });
    await provider.createBlock(source.id, {
      type: "paragraph",
      content: "Use [[Target Page]] and ignore [[Missing Page]].",
    });

    const snapshot = await provider.getSnapshot();
    const sourceModel = buildPageWorkspaceModel(provider, source.id, snapshot);
    const targetModel = buildPageWorkspaceModel(provider, target.id, snapshot);

    expect(sourceModel.wikiOutgoingLinks[0]?.target.title).toBe("Target Page");
    expect(targetModel.wikiBacklinks[0]?.source.title).toBe("Source");
    expect(sourceModel.properties.wikiOutgoingCount).toBe(1);
    expect(targetModel.properties.wikiBacklinksCount).toBe(1);
    expect(sourceModel.properties.outgoingCount).toBe(1);
    expect(targetModel.properties.backlinksCount).toBe(1);
  });

  it(``, async () => {
    const provider = createProvider();

    const page = await createPageFromTemplate(provider, "lecture-note");

    expect(page.title).toContain("Lecture Notes");
    expect((await provider.getBlocks(page.id)).length).toBeGreaterThan(2);
  });

  it(``, async () => {
    const provider = createProvider();

    const blank = await createPageFromTemplate(provider, "blank-page");
    const tablePage = await createPageFromTemplate(provider, "simple-table-page");
    const database = await createPageFromTemplate(provider, "basic-database");

    expect(blank.metadata.templateId).toBe("blank-page");
    expect((await provider.getBlocks(tablePage.id)).some((block) => block.type === "table")).toBe(
      true,
    );
    expect(database.category).toBe("databases");
    expect(database.type).toBe("database");
    expect(database.metadata.database).toBeDefined();
  });

  it(``, async () => {
    const provider = createProvider();

    const person = await createPageFromTemplate(provider, "person-profile");
    const relationship = await createPageFromTemplate(provider, "relationship-notes");
    const followUp = await createPageFromTemplate(provider, "follow-up-note");
    const interaction = await createPageFromTemplate(provider, "interaction-log");

    expect(person.category).toBe("people");
    expect(person.type).toBe("person");
    expect(person.metadata.displayName).toBe(person.title);
    expect(person.metadata.relationshipType).toBe("unknown");
    expect(relationship.metadata.context).toContain("relationship context");
    expect(followUp.metadata.relationshipStatus).toBe("follow-up");
    expect(followUp.metadata.followUpStatus).toBe("follow-up-needed");
    expect(interaction.category).toBe("people");
    expect(interaction.type).toBe("interaction");
    expect(interaction.metadata.interactionTitle).toBe(interaction.title);
    expect(interaction.metadata.interactionStatus).toBe("logged");
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({ title: "Removed", category: "notes", type: "note" });
    await provider.archiveItem(item?.id);

    expect(
      buildPageWorkspaceModel(provider, item?.id, await provider.getSnapshot()).item?.archivedAt,
    ).toBeDefined();
    expect(
      buildPageWorkspaceModel(provider, "missing-id", await provider.getSnapshot()).state,
    ).toBe("missing");
  });

  it(``, async () => {
    const commandIds = getImplementedSlashCommands().map((command) => command.id);

    expect(commandIds).toContain("paragraph");
    expect(commandIds).toContain("todo");
    expect(commandIds).toContain("table");
    expect(commandIds).not.toContain("image");
    expect(commandIds).not.toContain("relation");
  });
});

describe("sidebar actions and pinning logic", () => {
  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Page to pin",
      category: "notes",
      type: "note",
    });

    // Pin
    const pinnedAt = new Date().toISOString();
    await provider.updateItem(item?.id, {
      metadata: {
        ...item.metadata,
        sidebarPinned: true,
        sidebarPinnedAt: pinnedAt,
      },
    });

    const updated = await provider.getItem(item?.id);
    expect(updated?.metadata.sidebarPinned).toBe(true);
    expect(updated?.metadata.sidebarPinnedAt).toBe(pinnedAt);

    // Unpin
    await provider.updateItem(item?.id, {
      metadata: {
        ...item.metadata,
        sidebarPinned: false,
        sidebarPinnedAt: null,
      },
    });

    const unpinned = await provider.getItem(item?.id);
    expect(unpinned?.metadata.sidebarPinned).toBe(false);
    expect(unpinned?.metadata.sidebarPinnedAt).toBeNull();
  });

  it(``, async () => {
    const provider = createProvider();
    const item1 = await provider.createItem({ title: "Item 1", category: "notes", type: "note" });
    const item2 = await provider.createItem({ title: "Item 2", category: "notes", type: "note" });
    const item3 = await provider.createItem({ title: "Item 3", category: "notes", type: "note" });

    // Pin Item 2
    await provider.updateItem(item2.id, {
      metadata: {
        sidebarPinned: true,
        sidebarPinnedAt: "2026-05-29T10:00:00.000Z",
      },
    });

    // Pin Item 3 but with a newer timestamp
    await provider.updateItem(item3.id, {
      metadata: {
        sidebarPinned: true,
        sidebarPinnedAt: "2026-05-29T11:00:00.000Z",
      },
    });

    const snapshot = await provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);

    // Item 3 should be first (pinned, newer), Item 2 second (pinned, older), Item 1 third (unpinned)
    const order = tree.map((node) => node.id);
    expect(order.indexOf(item3.id)).toBeLessThan(order.indexOf(item2.id));
    expect(order.indexOf(item2.id)).toBeLessThan(order.indexOf(item1.id));
  });

  it(``, async () => {
    const provider = createProvider();
    const item1 = await provider.createItem({ title: "Item 1", category: "notes", type: "note" });
    const item2 = await provider.createItem({ title: "Item 2", category: "notes", type: "note" });

    // Both pinned, but no sidebarPinnedAt
    await provider.updateItem(item1.id, {
      metadata: { sidebarPinned: true },
    });
    await provider.updateItem(item2.id, {
      metadata: { sidebarPinned: true },
    });

    // Should not crash and should sort using updatedAt
    const snapshot = await provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);
    expect(tree.length).toBeGreaterThanOrEqual(2);
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Original Page",
      category: "notes",
      type: "note",
    });
    await provider.createBlock(item?.id, { type: "paragraph", content: "Original content" });

    // Rename
    await provider.updateItem(item?.id, { title: "Renamed Page" });
    expect((await provider.getItem(item?.id))?.title).toBe("Renamed Page");

    // Duplicate logic
    const original = await provider.getItem(item.id);
    if (!original) throw new Error("Expected original item to exist before duplication");

    const duplicated = await provider.createItem({
      title: `${original.title} (Copy)`,
      category: original.category,
      type: original.type,
      icon: original.icon,
      metadata: { ...original.metadata, sidebarPinned: false, sidebarPinnedAt: null },
    });
    const blocks = await provider.getBlocks(original.id);
    await provider.replaceBlocks(
      duplicated.id,
      blocks.map((b) => ({ type: b.type, content: b.content, order: b.order })),
    );

    expect(duplicated.title).toBe("Renamed Page (Copy)");
    expect((await provider.getBlocks(duplicated.id))[0]?.content).toBe("Original content");
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({ title: "To trash", category: "notes", type: "note" });

    await provider.trashItem(item?.id);
    const updated = await provider.getItem(item?.id);
    expect(updated?.deletedAt).toBeDefined();

    const snapshot = await provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);
    // Trashed item should not appear in sidebar
    expect(tree.some((node) => node.id === item?.id)).toBe(false);
  });
});

describe("unified sidebar pages and spaces model", () => {
  it(``, async () => {
    const provider = createProvider();
    const space = await provider.createItem({
      title: "Notes Space",
      category: "notes",
      type: "note",
      metadata: { promotedAsSpace: true, itemRole: "space" },
    });
    const page = await provider.createItem({
      title: "Normal Page",
      category: "notes",
      type: "note",
    });

    const spaceItem = await provider.getItem(space.id);
    const pageItem = await provider.getItem(page.id);
    if (!spaceItem) throw new Error("Expected space item to exist");
    if (!pageItem) throw new Error("Expected page item to exist");

    expect(spaceItem.metadata.promotedAsSpace).toBe(true);
    expect(spaceItem.metadata.itemRole).toBe("space");
    expect(pageItem.metadata.promotedAsSpace).toBeUndefined();
    expect(pageItem.metadata.itemRole).toBeUndefined();
  });

  it(``, async () => {
    const provider = createProvider();
    const page = await createPageFromTemplate(provider, "notes-space");

    expect(page.title).toBe("Notes");
    expect(page.metadata.promotedAsSpace).toBe(true);
    expect(page.metadata.itemRole).toBe("space");
  });

  it(``, async () => {
    const provider = createProvider();
    const page = await createPageFromTemplate(provider, "finance-record");

    expect(page.category).toBe("finance");
    expect(page.type).toBe("finance");
    expect(page.metadata.financeTitle).toBe("Finance Record - New Entry");
    expect(page.metadata.financeKind).toBe("transaction");
    expect(page.metadata.transactionType).toBe("expense");
    expect(page.metadata.financeStatus).toBe("draft");
    expect(page.metadata.bankSynced).toBe(false);
    expect(page.metadata.accountingGrade).toBe(false);
  });

  it(``, async () => {
    const provider = createProvider();
    const tracker = await createPageFromTemplate(provider, "tracker");
    const goal = await createPageFromTemplate(provider, "goal");
    const goalSpace = await createPageFromTemplate(provider, "goals-space");

    expect(tracker.category).toBe("trackers");
    expect(tracker.type).toBe("tracker");
    expect(tracker.metadata.trackerTitle).toBe(tracker.title);
    expect(tracker.metadata.fakeStreaks).toBe(false);
    expect(tracker.properties.streak).toBeUndefined();

    expect(goal.category).toBe("goals");
    expect(goal.type).toBe("goal");
    expect(goal.metadata.goalTitle).toBe(goal.title);
    expect(goal.metadata.fakeProgressHistory).toBe(false);

    expect(goalSpace.title).toBe("Goals");
    expect(goalSpace.category).toBe("goals");
    expect(goalSpace.metadata.promotedAsSpace).toBe(true);
    expect(goalSpace.metadata.itemRole).toBe("space");
  });

  it(``, async () => {
    const trackerTemplate = getImplementedTemplates().find((entry) => entry.id === "tracker");
    const goalTemplate = getImplementedTemplates().find((entry) => entry.id === "goal");

    expect(trackerTemplate?.properties.streak).toBeUndefined();
    expect(trackerTemplate?.metadata?.fakeStreaks).toBe(false);
    expect(goalTemplate?.metadata?.fakeProgressHistory).toBe(false);
    expect(goalTemplate?.summary).toContain("metadata");
  });

  it(``, async () => {
    const provider = createProvider();
    const space1 = await provider.createItem({
      title: "Pinned Space",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, promotedAsSpace: true, itemRole: "space" },
    });
    const page1 = await provider.createItem({
      title: "Unpinned Page",
      category: "notes",
      type: "note",
    });

    const snapshot = await provider.getSnapshot();
    const { pinnedTree, pagesTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree.some((node) => node.id === space1.id)).toBe(true);
    expect(pinnedTree.some((node) => node.id === page1.id)).toBe(false);

    expect(pagesTree.some((node) => node.id === space1.id)).toBe(false);
    expect(pagesTree.some((node) => node.id === page1.id)).toBe(true);
  });

  it(``, async () => {
    const provider = createProvider();
    const item = await provider.createItem({
      title: "Pinned Page",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true },
    });

    const snapshot = await provider.getSnapshot();
    const { pinnedTree, pagesTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree.some((node) => node.id === item?.id)).toBe(true);
    expect(pagesTree.some((node) => node.id === item?.id)).toBe(false);
  });

  it(``, async () => {
    const provider = createProvider();
    const item1 = await provider.createItem({
      title: "Item 1",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, sidebarOrder: 2 },
    });
    const item2 = await provider.createItem({
      title: "Item 2",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, sidebarOrder: 1 },
    });

    const snapshot = await provider.getSnapshot();
    const { pinnedTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree[0].id).toBe(item2.id);
    expect(pinnedTree[1].id).toBe(item1.id);
  });
});
