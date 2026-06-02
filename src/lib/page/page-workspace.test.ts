import { describe, expect, it } from "vitest";

import {
  buildPageWorkspaceModel,
  createChildPage,
  createPageFromTemplate,
  getImplementedSlashCommands,
} from "./page-workspace";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import { buildSidebarPageTree, buildSidebarTrees } from "../../components/layout/AppSidebar";

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
  it("normalizes an item with safe defaults for optional fields", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "Plain page", category: "notes", type: "note" });

    const model = buildPageWorkspaceModel(provider, item.id);

    expect(model.state).toBe("ready");
    expect(model.item.icon).toBe("N");
    expect(model.blocks).toEqual([]);
    expect(model.properties.blocksCount).toBe(0);
  });

  it("builds Home / Space / Parent / Child breadcrumbs", () => {
    const provider = createProvider();
    const parent = provider.createItem({ title: "Parent", category: "notes", type: "note" });
    const child = provider.createItem({
      title: "Child",
      category: "notes",
      type: "note",
      parentId: parent.id,
    });

    const model = buildPageWorkspaceModel(provider, child.id);

    expect(model.breadcrumbs.map((crumb) => crumb.label)).toEqual([
      "Home",
      "Notes",
      "Parent",
      "Child",
    ]);
  });

  it("creates a child page as a real provider item", () => {
    const provider = createProvider();
    const parent = provider.createItem({ title: "Parent", category: "projects", type: "project" });

    const child = createChildPage(provider, parent.id, "Subpage");

    expect(child.parentId).toBe(parent.id);
    expect(provider.getItem(child.id)?.title).toBe("Subpage");
    expect(buildPageWorkspaceModel(provider, parent.id).childPages[0]?.id).toBe(child.id);
  });

  it("detects outgoing relation context and incoming backlinks", () => {
    const provider = createProvider();
    const source = provider.createItem({ title: "Source", category: "notes", type: "note" });
    const target = provider.createItem({
      title: "Target",
      category: "documents",
      type: "document",
    });
    provider.createRelation({
      sourceId: source.id,
      targetId: target.id,
      relationType: "note_to_document",
      label: "Evidence",
    });

    expect(buildPageWorkspaceModel(provider, source.id).outgoingLinks[0]?.target.title).toBe(
      "Target",
    );
    expect(buildPageWorkspaceModel(provider, target.id).backlinks[0]?.source.title).toBe("Source");
  });

  it("creates template-backed pages with starter blocks", () => {
    const provider = createProvider();

    const page = createPageFromTemplate(provider, "lecture-note");

    expect(page.title).toContain("Lecture Notes");
    expect(provider.getBlocks(page.id).length).toBeGreaterThan(2);
  });

  it("creates blank, simple table, and database templates as real provider pages", () => {
    const provider = createProvider();

    const blank = createPageFromTemplate(provider, "blank-page");
    const tablePage = createPageFromTemplate(provider, "simple-table-page");
    const database = createPageFromTemplate(provider, "basic-database");

    expect(blank.metadata.templateId).toBe("blank-page");
    expect(provider.getBlocks(tablePage.id).some((block) => block.type === "table")).toBe(true);
    expect(database.category).toBe("databases");
    expect(database.type).toBe("database");
    expect(database.metadata.database).toBeDefined();
  });

  it("creates people and interaction templates with normalized metadata defaults", () => {
    const provider = createProvider();

    const person = createPageFromTemplate(provider, "person-profile");
    const relationship = createPageFromTemplate(provider, "relationship-notes");
    const followUp = createPageFromTemplate(provider, "follow-up-note");
    const interaction = createPageFromTemplate(provider, "interaction-log");

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

  it("handles archived and deleted page state safely", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "Removed", category: "notes", type: "note" });
    provider.archiveItem(item.id);

    expect(buildPageWorkspaceModel(provider, item.id).item.archivedAt).toBeDefined();
    expect(buildPageWorkspaceModel(provider, "missing-id").state).toBe("missing");
  });

  it("does not expose unsupported slash commands as active actions", () => {
    const commandIds = getImplementedSlashCommands().map((command) => command.id);

    expect(commandIds).toContain("paragraph");
    expect(commandIds).toContain("todo");
    expect(commandIds).toContain("table");
    expect(commandIds).not.toContain("image");
    expect(commandIds).not.toContain("relation");
  });
});

describe("sidebar actions and pinning logic", () => {
  it("pins a page and updates metadata, surviving write/read cycle", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "Page to pin", category: "notes", type: "note" });

    // Pin
    const pinnedAt = new Date().toISOString();
    provider.updateItem(item.id, {
      metadata: {
        ...item.metadata,
        sidebarPinned: true,
        sidebarPinnedAt: pinnedAt,
      },
    });

    const updated = provider.getItem(item.id);
    expect(updated?.metadata.sidebarPinned).toBe(true);
    expect(updated?.metadata.sidebarPinnedAt).toBe(pinnedAt);

    // Unpin
    provider.updateItem(item.id, {
      metadata: {
        ...item.metadata,
        sidebarPinned: false,
        sidebarPinnedAt: null,
      },
    });

    const unpinned = provider.getItem(item.id);
    expect(unpinned?.metadata.sidebarPinned).toBe(false);
    expect(unpinned?.metadata.sidebarPinnedAt).toBeNull();
  });

  it("sorts pinned pages above unpinned pages in the sidebar page tree", () => {
    const provider = createProvider();
    const item1 = provider.createItem({ title: "Item 1", category: "notes", type: "note" });
    const item2 = provider.createItem({ title: "Item 2", category: "notes", type: "note" });
    const item3 = provider.createItem({ title: "Item 3", category: "notes", type: "note" });

    // Pin Item 2
    provider.updateItem(item2.id, {
      metadata: {
        sidebarPinned: true,
        sidebarPinnedAt: "2026-05-29T10:00:00.000Z",
      },
    });

    // Pin Item 3 but with a newer timestamp
    provider.updateItem(item3.id, {
      metadata: {
        sidebarPinned: true,
        sidebarPinnedAt: "2026-05-29T11:00:00.000Z",
      },
    });

    const snapshot = provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);

    // Item 3 should be first (pinned, newer), Item 2 second (pinned, older), Item 1 third (unpinned)
    const order = tree.map((node) => node.id);
    expect(order.indexOf(item3.id)).toBeLessThan(order.indexOf(item2.id));
    expect(order.indexOf(item2.id)).toBeLessThan(order.indexOf(item1.id));
  });

  it("handles missing sidebarPinnedAt safely by falling back to updatedAt", () => {
    const provider = createProvider();
    const item1 = provider.createItem({ title: "Item 1", category: "notes", type: "note" });
    const item2 = provider.createItem({ title: "Item 2", category: "notes", type: "note" });

    // Both pinned, but no sidebarPinnedAt
    provider.updateItem(item1.id, {
      metadata: { sidebarPinned: true },
    });
    provider.updateItem(item2.id, {
      metadata: { sidebarPinned: true },
    });

    // Should not crash and should sort using updatedAt
    const snapshot = provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);
    expect(tree.length).toBeGreaterThanOrEqual(2);
  });

  it("supports duplicating pages and updating titles (rename)", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "Original Page", category: "notes", type: "note" });
    provider.createBlock(item.id, { type: "paragraph", content: "Original content" });

    // Rename
    provider.updateItem(item.id, { title: "Renamed Page" });
    expect(provider.getItem(item.id)?.title).toBe("Renamed Page");

    // Duplicate logic
    const original = provider.getItem(item.id)!;
    const duplicated = provider.createItem({
      title: `${original.title} (Copy)`,
      category: original.category,
      type: original.type,
      icon: original.icon,
      metadata: { ...original.metadata, sidebarPinned: false, sidebarPinnedAt: null },
    });
    const blocks = provider.getBlocks(original.id);
    provider.replaceBlocks(
      duplicated.id,
      blocks.map((b) => ({ type: b.type, content: b.content, order: b.order })),
    );

    expect(duplicated.title).toBe("Renamed Page (Copy)");
    expect(provider.getBlocks(duplicated.id)[0]?.content).toBe("Original content");
  });

  it("supports trashing pages safely", () => {
    const provider = createProvider();
    const item = provider.createItem({ title: "To trash", category: "notes", type: "note" });

    provider.trashItem(item.id);
    const updated = provider.getItem(item.id);
    expect(updated?.deletedAt).toBeDefined();

    const snapshot = provider.getSnapshot();
    const tree = buildSidebarPageTree(snapshot.items);
    // Trashed item should not appear in sidebar
    expect(tree.some((node) => node.id === item.id)).toBe(false);
  });
});

describe("unified sidebar pages and spaces model", () => {
  it("normalizes spaces as promoted page items and normal pages as non-promoted", () => {
    const provider = createProvider();
    const space = provider.createItem({
      title: "Notes Space",
      category: "notes",
      type: "note",
      metadata: { promotedAsSpace: true, itemRole: "space" },
    });
    const page = provider.createItem({
      title: "Normal Page",
      category: "notes",
      type: "note",
    });

    const spaceItem = provider.getItem(space.id)!;
    const pageItem = provider.getItem(page.id)!;

    expect(spaceItem.metadata.promotedAsSpace).toBe(true);
    expect(spaceItem.metadata.itemRole).toBe("space");
    expect(pageItem.metadata.promotedAsSpace).toBeUndefined();
    expect(pageItem.metadata.itemRole).toBeUndefined();
  });

  it("creates promoted space-page from a space template", () => {
    const provider = createProvider();
    const page = createPageFromTemplate(provider, "notes-space");

    expect(page.title).toBe("Notes");
    expect(page.metadata.promotedAsSpace).toBe(true);
    expect(page.metadata.itemRole).toBe("space");
  });

  it("categorizes pinned items into pinnedTree and unpinned items into pagesTree", () => {
    const provider = createProvider();
    const space1 = provider.createItem({
      title: "Pinned Space",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, promotedAsSpace: true, itemRole: "space" },
    });
    const page1 = provider.createItem({
      title: "Unpinned Page",
      category: "notes",
      type: "note",
    });

    const snapshot = provider.getSnapshot();
    const { pinnedTree, pagesTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree.some((node) => node.id === space1.id)).toBe(true);
    expect(pinnedTree.some((node) => node.id === page1.id)).toBe(false);

    expect(pagesTree.some((node) => node.id === space1.id)).toBe(false);
    expect(pagesTree.some((node) => node.id === page1.id)).toBe(true);
  });

  it("excludes pinned items from root pagesTree to avoid duplication", () => {
    const provider = createProvider();
    const item = provider.createItem({
      title: "Pinned Page",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true },
    });

    const snapshot = provider.getSnapshot();
    const { pinnedTree, pagesTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree.some((node) => node.id === item.id)).toBe(true);
    expect(pagesTree.some((node) => node.id === item.id)).toBe(false);
  });

  it("sorts pinned items correctly by sidebarOrder first, then timestamp", () => {
    const provider = createProvider();
    const item1 = provider.createItem({
      title: "Item 1",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, sidebarOrder: 2 },
    });
    const item2 = provider.createItem({
      title: "Item 2",
      category: "notes",
      type: "note",
      metadata: { sidebarPinned: true, sidebarOrder: 1 },
    });

    const snapshot = provider.getSnapshot();
    const { pinnedTree } = buildSidebarTrees(snapshot.items);

    expect(pinnedTree[0].id).toBe(item2.id);
    expect(pinnedTree[1].id).toBe(item1.id);
  });
});
