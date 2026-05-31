import type {
  BlockType,
  CreateBlockInput,
  CreateItemInput,
  CreateRelationInput,
  ListItemsFilter,
  ListRelationsFilter,
  ItemCategory,
  ItemType,
  MizaanBlock,
  MizaanItem,
  MizaanRelation,
  UpdateBlockInput,
  UpdateItemInput,
  VaultHealth,
  VaultProvider,
  VaultProviderInfo,
  VaultSnapshot,
} from "./types";

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

interface ProviderState {
  version: 1;
  items: MizaanItem[];
  blocks: MizaanBlock[];
  relations: MizaanRelation[];
}

interface ProviderOptions {
  storage?: StorageLike;
  storageKey?: string;
  now?: () => string;
  idFactory?: (prefix: string) => string;
  seedOnEmpty?: boolean;
}

const DEFAULT_STORAGE_KEY = "mizaan.prototype.vault.v1";

const CATEGORY_ICON: Record<string, string> = {
  notes: "N",
  documents: "D",
  projects: "P",
  people: "U",
  finance: "$",
  calendar: "C",
  trackers: "T",
  databases: "#",
  templates: "*",
};

export function createMemoryStorage(initial: Record<string, string> = {}): StorageLike {
  const values = new Map(Object.entries(initial));

  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => {
      values.set(key, value);
    },
    removeItem: (key) => {
      values.delete(key);
    },
  };
}

function getDefaultStorage(): StorageLike {
  if (typeof window !== "undefined" && window.localStorage) {
    return window.localStorage;
  }

  return createMemoryStorage();
}

function defaultIdFactory(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function emptyState(): ProviderState {
  return {
    version: 1,
    items: [],
    blocks: [],
    relations: [],
  };
}

function normalizeBlockType(type: BlockType) {
  return type;
}

function createSeedState(now: string): ProviderState {
  const seed = emptyState();

  const makeItem = (input: Omit<MizaanItem, "createdAt" | "updatedAt">) => {
    seed.items.push({ ...input, createdAt: now, updatedAt: now });
  };
  const makeBlock = (input: Omit<MizaanBlock, "createdAt" | "updatedAt">) => {
    seed.blocks.push({ ...input, createdAt: now, updatedAt: now });
  };

  // Seed the 7 promoted space pages
  makeItem({
    id: "space-notes",
    type: "note",
    category: "notes",
    title: "Notes",
    icon: "N",
    summary: "Quick captures, meeting notes, lecture notes, journals, and long-form pages.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "notes-space",
      sidebarPinned: true,
      sidebarOrder: 1,
    },
  });

  makeItem({
    id: "space-documents",
    type: "document",
    category: "documents",
    title: "Documents",
    icon: "D",
    summary: "Document records for files worth keeping.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "documents-space",
      sidebarPinned: true,
      sidebarOrder: 2,
    },
  });

  makeItem({
    id: "space-projects",
    type: "project",
    category: "projects",
    title: "Projects",
    icon: "P",
    summary: "Long-running threads of work.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "projects-space",
      sidebarPinned: true,
      sidebarOrder: 3,
    },
  });

  makeItem({
    id: "space-people",
    type: "person",
    category: "people",
    title: "People",
    icon: "U",
    summary: "Personal profiles and relationship context.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "people-space",
      sidebarPinned: true,
      sidebarOrder: 4,
    },
  });

  makeItem({
    id: "space-finance",
    type: "finance",
    category: "finance",
    title: "Finance",
    icon: "$",
    summary: "Local finance records and planning.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "finance-space",
      sidebarPinned: true,
      sidebarOrder: 5,
    },
  });

  makeItem({
    id: "space-trackers",
    type: "tracker",
    category: "trackers",
    title: "Trackers",
    icon: "T",
    summary: "Habit and progress tracker pages.",
    status: "Active",
    tags: [],
    properties: { status: "Active" },
    attachedFiles: [],
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "trackers-space",
      sidebarPinned: true,
      sidebarOrder: 7,
    },
  });

  // Seed normal items parented to their spaces
  makeItem({
    id: "note-getting-started",
    type: "note",
    category: "notes",
    title: "Getting Started",
    icon: "N",
    summary: "Welcome to your Mizaan workspace.",
    status: "Active",
    tags: ["welcome"],
    parentId: "space-notes",
    properties: { section: "Private" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "note-principles",
    type: "note",
    category: "notes",
    title: "Mizaan design principles",
    icon: "N",
    summary: "The page is the unit.",
    status: "Active",
    tags: ["mizaan", "principles"],
    parentId: "note-getting-started",
    properties: { section: "Getting Started" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "project-mizaan",
    type: "project",
    category: "projects",
    title: "Mizaan Revamp",
    icon: "P",
    summary: "Local-first workspace implementation.",
    status: "In progress",
    tags: ["app"],
    parentId: "space-projects",
    properties: { progress: 42, owner: "Me" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "doc-architecture",
    type: "document",
    category: "documents",
    title: "Architecture Notes",
    icon: "D",
    summary: "Document record for vault architecture.",
    status: "Needs file",
    tags: ["architecture"],
    parentId: "space-documents",
    properties: { kind: "Record", fileState: "No file attached" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "person-owner",
    type: "person",
    category: "people",
    title: "Personal Profile",
    icon: "U",
    summary: "Local personal context page.",
    status: "Active",
    tags: ["profile"],
    parentId: "space-people",
    properties: { role: "Owner" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "finance-record",
    type: "finance",
    category: "finance",
    title: "Monthly Budget Review",
    icon: "$",
    summary: "Prototype finance record.",
    status: "Draft",
    tags: ["budget"],
    parentId: "space-finance",
    properties: { month: "May 2026" },
    attachedFiles: [],
    metadata: {},
  });
  makeItem({
    id: "calendar-review",
    type: "calendar",
    category: "calendar",
    title: "Mizaan Review",
    icon: "C",
    summary: "Prototype calendar item.",
    status: "Scheduled",
    tags: ["review"],
    properties: {
      date: "2026-05-29",
      startDate: "2026-05-29",
      endDate: "2026-05-29",
      startTime: "",
      endTime: "",
      allDay: true,
    },
    attachedFiles: [],
    metadata: {
      calendarEvent: true,
      calendarCoreModule: true,
      schemaVersion: 1,
    },
  });
  makeItem({
    id: "tracker-study",
    type: "tracker",
    category: "trackers",
    title: "Study Tracker",
    icon: "T",
    summary: "Prototype tracker page.",
    status: "Active",
    tags: ["study"],
    parentId: "space-trackers",
    properties: { streak: 0 },
    attachedFiles: [],
    metadata: {},
  });

  [
    ["seed-b1", "note-principles", "heading1", "Mizaan design principles", 0],
    ["seed-b2", "note-principles", "paragraph", "The page is the real workspace object.", 1],
    ["seed-b3", "note-principles", "heading2", "Local first", 2],
    [
      "seed-b4",
      "note-principles",
      "paragraph",
      "No forced cloud, login, or backend is required for the prototype.",
      3,
    ],
    ["seed-b5", "note-principles", "todo", "Keep provider boundaries honest", 4],
  ].forEach(([id, itemId, type, content, order]) => {
    makeBlock({
      id: String(id),
      itemId: String(itemId),
      type: normalizeBlockType(type as BlockType),
      content: String(content),
      order: Number(order),
      checked: type === "todo" ? false : undefined,
    });
  });

  seed.relations.push(
    {
      id: "rel-note-project",
      sourceId: "note-principles",
      targetId: "project-mizaan",
      relationType: "note_to_project",
      label: "Supports",
      createdAt: now,
      metadata: {},
    },
    {
      id: "rel-project-doc",
      sourceId: "project-mizaan",
      targetId: "doc-architecture",
      relationType: "project_to_document",
      label: "Reference",
      createdAt: now,
      metadata: {},
    },
  );

  return seed;
}

export class LocalStorageVaultProvider implements VaultProvider {
  private readonly storage: StorageLike;
  private readonly storageKey: string;
  private readonly now: () => string;
  private readonly idFactory: (prefix: string) => string;
  private readonly seedOnEmpty: boolean;
  private readonly listeners = new Set<() => void>();

  constructor(options: ProviderOptions = {}) {
    this.storage = options.storage ?? getDefaultStorage();
    this.storageKey = options.storageKey ?? DEFAULT_STORAGE_KEY;
    this.now = options.now ?? (() => new Date().toISOString());
    this.idFactory = options.idFactory ?? defaultIdFactory;
    this.seedOnEmpty = options.seedOnEmpty ?? true;
  }

  getProviderInfo(): VaultProviderInfo {
    return {
      id: "local-storage",
      name: "LocalStorageVaultProvider",
      mode: "prototype-local",
      storageLabel: "Browser localStorage prototype",
      warning:
        "Prototype browser storage is active. Real portable folder, SQLite, Tauri, and lock-file support are not ready.",
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
    };
  }

  getHealth(): VaultHealth {
    const state = this.readState();
    return {
      providerId: this.getProviderInfo().id,
      itemCount: state.items.length,
      blockCount: state.blocks.length,
      relationCount: state.relations.length,
      archivedCount: state.items.filter((item) => item.archivedAt).length,
      deletedCount: state.items.filter((item) => item.deletedAt).length,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: this.now(),
      warnings: [
        "This is a prototype localStorage vault, not a portable folder vault.",
        "SQLite, Tauri filesystem, markdown mirrors, and lock files are not active.",
      ],
    };
  }

  getSnapshot(): VaultSnapshot {
    const state = this.readState();
    return {
      items: [...state.items],
      blocks: [...state.blocks],
      relations: [...state.relations],
      providerInfo: this.getProviderInfo(),
      health: this.getHealth(),
    };
  }

  listItems(filter: ListItemsFilter = {}): MizaanItem[] {
    return this.readState()
      .items.filter((item) => {
        if (filter.category && item.category !== filter.category) return false;
        if (!filter.includeArchived && item.archivedAt) return false;
        if (!filter.includeDeleted && item.deletedAt) return false;
        if (filter.parentId !== undefined && item.parentId !== filter.parentId) return false;
        return true;
      })
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  getItem(id: string) {
    return this.readState().items.find((item) => item.id === id);
  }

  createItem(input: CreateItemInput): MizaanItem {
    const state = this.readState();
    const timestamp = this.now();
    const item: MizaanItem = {
      id: this.idFactory("item"),
      type: input.type,
      category: input.category,
      title: input.title,
      icon: input.icon ?? CATEGORY_ICON[input.category],
      cover: input.cover,
      summary: input.summary ?? "",
      status: input.status,
      tags: input.tags ?? [],
      parentId: input.parentId,
      properties: input.properties ?? {},
      attachedFiles: input.attachedFiles ?? [],
      metadata: input.metadata ?? {},
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    state.items.push(item);
    this.writeState(state);
    return item;
  }

  updateItem(id: string, input: UpdateItemInput) {
    const state = this.readState();
    const index = state.items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;

    const current = state.items[index];
    const next: MizaanItem = {
      ...current,
      ...input,
      properties: input.properties
        ? { ...current.properties, ...input.properties }
        : current.properties,
      metadata: input.metadata ? { ...current.metadata, ...input.metadata } : current.metadata,
      attachedFiles: input.attachedFiles ?? current.attachedFiles,
      tags: input.tags ?? current.tags,
      updatedAt: this.now(),
    };

    state.items[index] = next;
    this.writeState(state);
    return next;
  }

  archiveItem(id: string) {
    return this.updateItem(id, { archivedAt: this.now(), deletedAt: undefined });
  }

  trashItem(id: string) {
    return this.updateItem(id, { deletedAt: this.now() });
  }

  restoreItem(id: string) {
    return this.updateItem(id, { archivedAt: undefined, deletedAt: undefined });
  }

  getBlocks(itemId: string): MizaanBlock[] {
    return this.readState()
      .blocks.filter((block) => block.itemId === itemId)
      .sort((a, b) => a.order - b.order);
  }

  createBlock(itemId: string, input: CreateBlockInput): MizaanBlock {
    const state = this.readState();
    const timestamp = this.now();
    const nextOrder =
      input.order ??
      state.blocks
        .filter((block) => block.itemId === itemId)
        .reduce((max, block) => Math.max(max, block.order), -1) + 1;
    const block: MizaanBlock = {
      id: this.idFactory("block"),
      itemId,
      type: input.type,
      content: input.content,
      order: nextOrder,
      checked: input.checked,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    state.blocks.push(block);
    this.touchItemInState(state, itemId);
    this.writeState(state);
    return block;
  }

  updateBlock(blockId: string, input: UpdateBlockInput) {
    const state = this.readState();
    const index = state.blocks.findIndex((block) => block.id === blockId);
    if (index === -1) return undefined;

    const current = state.blocks[index];
    const block: MizaanBlock = {
      ...current,
      ...input,
      updatedAt: this.now(),
    };

    state.blocks[index] = block;
    this.touchItemInState(state, block.itemId);
    this.writeState(state);
    return block;
  }

  replaceBlocks(itemId: string, blocks: CreateBlockInput[]): MizaanBlock[] {
    const state = this.readState();
    const timestamp = this.now();
    state.blocks = state.blocks.filter((block) => block.itemId !== itemId);
    const nextBlocks = blocks.map((block, index): MizaanBlock => {
      return {
        id: this.idFactory("block"),
        itemId,
        type: block.type,
        content: block.content,
        order: block.order ?? index,
        checked: block.checked,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
    });

    state.blocks.push(...nextBlocks);
    this.touchItemInState(state, itemId);
    this.writeState(state);
    return nextBlocks;
  }

  listRelations(filter: ListRelationsFilter = {}): MizaanRelation[] {
    return this.readState().relations.filter((relation) => {
      if (filter.sourceId && relation.sourceId !== filter.sourceId) return false;
      if (filter.targetId && relation.targetId !== filter.targetId) return false;
      return true;
    });
  }

  createRelation(input: CreateRelationInput): MizaanRelation {
    const state = this.readState();
    const relation: MizaanRelation = {
      id: this.idFactory("relation"),
      sourceId: input.sourceId,
      targetId: input.targetId,
      relationType: input.relationType,
      label: input.label ?? "Related",
      createdAt: this.now(),
      metadata: input.metadata ?? {},
    };

    state.relations.push(relation);
    this.touchItemInState(state, input.sourceId);
    this.writeState(state);
    return relation;
  }

  deleteRelation(id: string) {
    const state = this.readState();
    const relation = state.relations.find((entry) => entry.id === id);
    state.relations = state.relations.filter((entry) => entry.id !== id);
    if (relation) this.touchItemInState(state, relation.sourceId);
    this.writeState(state);
  }

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private readState(): ProviderState {
    const raw = this.storage.getItem(this.storageKey);
    let state: ProviderState;
    let didChange = false;

    if (!raw) {
      state = this.seedOnEmpty ? createSeedState(this.now()) : emptyState();
      didChange = true;
    } else {
      try {
        const parsed = JSON.parse(raw) as ProviderState;
        state = {
          version: 1,
          items: Array.isArray(parsed.items) ? parsed.items : [],
          blocks: Array.isArray(parsed.blocks) ? parsed.blocks : [],
          relations: Array.isArray(parsed.relations) ? parsed.relations : [],
        };
      } catch {
        state = emptyState();
        didChange = true;
      }
    }

    if (!this.seedOnEmpty) {
      if (didChange) {
        this.storage.setItem(this.storageKey, JSON.stringify(state));
      }
      return state;
    }

    const timestamp = this.now();
    const spaces = [
      {
        id: "space-notes",
        category: "notes",
        title: "Notes",
        icon: "N",
        order: 1,
        templateId: "notes-space",
        type: "note",
      },
      {
        id: "space-documents",
        category: "documents",
        title: "Documents",
        icon: "D",
        order: 2,
        templateId: "documents-space",
        type: "document",
      },
      {
        id: "space-projects",
        category: "projects",
        title: "Projects",
        icon: "P",
        order: 3,
        templateId: "projects-space",
        type: "project",
      },
      {
        id: "space-people",
        category: "people",
        title: "People",
        icon: "U",
        order: 4,
        templateId: "people-space",
        type: "person",
      },
      {
        id: "space-finance",
        category: "finance",
        title: "Finance",
        icon: "$",
        order: 5,
        templateId: "finance-space",
        type: "finance",
      },
      {
        id: "space-trackers",
        category: "trackers",
        title: "Trackers",
        icon: "T",
        order: 6,
        templateId: "trackers-space",
        type: "tracker",
      },
    ];

    const legacyCalendarSpace = state.items.find(
      (item) => item.id === "space-calendar" && item.metadata?.promotedAsSpace === true,
    );
    if (legacyCalendarSpace) {
      legacyCalendarSpace.metadata = {
        ...legacyCalendarSpace.metadata,
        promotedAsSpace: false,
        itemRole: "deprecated-calendar-space",
        sidebarPinned: false,
        deprecatedCoreModuleSpace: true,
      };
      legacyCalendarSpace.deletedAt ??= timestamp;
      legacyCalendarSpace.updatedAt = timestamp;
      didChange = true;
    }

    for (const space of spaces) {
      const exists = state.items.some((item) => item.id === space.id);
      if (!exists) {
        state.items.push({
          id: space.id,
          type: space.type as ItemType,
          category: space.category as ItemCategory,
          title: space.title,
          icon: space.icon,
          summary: `Seeded ${space.title} Space`,
          status: "Active",
          tags: [],
          properties: { status: "Active" },
          attachedFiles: [],
          metadata: {
            promotedAsSpace: true,
            itemRole: "space",
            spaceTemplateId: space.templateId,
            sidebarPinned: true,
            sidebarOrder: space.order,
          },
          createdAt: timestamp,
          updatedAt: timestamp,
        });
        didChange = true;
      }
    }

    // Map unparented items (excluding space-pages themselves) to their space pages
    for (const item of state.items) {
      if (
        item.category === "calendar" ||
        item.id.startsWith("space-") ||
        (item.metadata && item.metadata.promotedAsSpace)
      ) {
        continue;
      }
      if (!item.parentId) {
        const targetSpace = spaces.find((s) => s.category === item.category);
        if (targetSpace) {
          item.parentId = targetSpace.id;
          didChange = true;
        }
      }
    }

    if (didChange) {
      this.storage.setItem(this.storageKey, JSON.stringify(state));
    }

    return state;
  }

  private writeState(state: ProviderState) {
    this.storage.setItem(this.storageKey, JSON.stringify(state));
    this.listeners.forEach((listener) => listener());
  }

  private touchItemInState(state: ProviderState, itemId: string) {
    const item = state.items.find((entry) => entry.id === itemId);
    if (item) item.updatedAt = this.now();
  }
}

let singleton: LocalStorageVaultProvider | undefined;

export function getVaultProvider() {
  singleton ??= new LocalStorageVaultProvider();
  return singleton;
}
