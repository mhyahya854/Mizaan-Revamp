export type ItemCategory =
  | "notes"
  | "documents"
  | "projects"
  | "tasks"
  | "people"
  | "finance"
  | "calendar"
  | "trackers"
  | "goals"
  | "databases"
  | "templates";

export type ItemType =
  | "note"
  | "document"
  | "project"
  | "task"
  | "person"
  | "interaction"
  | "finance"
  | "calendar"
  | "tracker"
  | "goal"
  | "database"
  | "database-row"
  | "template";

export type BlockType =
  | "paragraph"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bullet"
  | "numbered"
  | "todo"
  | "quote"
  | "callout"
  | "divider"
  | "code"
  | "table";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type PropertyValue = JsonValue;

export interface AttachedFile {
  id: string;
  name: string;
  kind: string;
  sizeLabel?: string;
  localPath?: string;
  missing?: boolean;
}

export interface MizaanItem {
  id: string;
  type: ItemType;
  category: ItemCategory;
  title: string;
  icon?: string;
  cover?: string;
  summary?: string;
  status?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  deletedAt?: string;
  parentId?: string;
  properties: Record<string, PropertyValue>;
  attachedFiles: AttachedFile[];
  metadata: Record<string, PropertyValue>;
}

export interface MizaanBlock {
  id: string;
  itemId: string;
  type: BlockType;
  content: string;
  order: number;
  checked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MizaanRelation {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: string;
  label: string;
  createdAt: string;
  metadata: Record<string, PropertyValue>;
}

export interface VaultProviderCapabilities {
  itemCrud: boolean;
  blockCrud: boolean;
  relations: boolean;
  localStoragePrototype: boolean;
  portableFolder: boolean;
  sqlite: boolean;
  tauriFilesystem: boolean;
  markdownMirrors: boolean;
}

export interface VaultProviderInfo {
  id: string;
  name: string;
  mode: "demo" | "prototype-local" | "portable-folder" | "sqlite";
  storageLabel: string;
  warning: string;
  capabilities: VaultProviderCapabilities;
}

export interface VaultHealth {
  providerId: string;
  itemCount: number;
  blockCount: number;
  relationCount: number;
  archivedCount: number;
  deletedCount: number;
  portableVaultReady: false;
  sqliteReady: false;
  tauriReady: false;
  checkedAt: string;
  warnings: string[];
}

export interface VaultSnapshot {
  items: MizaanItem[];
  blocks: MizaanBlock[];
  relations: MizaanRelation[];
  providerInfo: VaultProviderInfo;
  health: VaultHealth;
}

export interface RestoreSnapshotDataInput {
  mode: "merge" | "replace";
  confirmedReplace?: boolean;
  items: MizaanItem[];
  blocks: MizaanBlock[];
  relations: MizaanRelation[];
}

export interface ListItemsFilter {
  category?: ItemCategory;
  includeArchived?: boolean;
  includeDeleted?: boolean;
  parentId?: string;
}

export interface CreateItemInput {
  title: string;
  category: ItemCategory;
  type: ItemType;
  icon?: string;
  cover?: string;
  summary?: string;
  status?: string;
  tags?: string[];
  parentId?: string;
  properties?: Record<string, PropertyValue>;
  attachedFiles?: AttachedFile[];
  metadata?: Record<string, PropertyValue>;
}

export interface UpdateItemInput {
  title?: string;
  icon?: string;
  cover?: string;
  summary?: string;
  status?: string;
  tags?: string[];
  parentId?: string;
  archivedAt?: string;
  deletedAt?: string;
  properties?: Record<string, PropertyValue>;
  attachedFiles?: AttachedFile[];
  metadata?: Record<string, PropertyValue>;
}

export interface CreateBlockInput {
  type: BlockType;
  content: string;
  order?: number;
  checked?: boolean;
}

export interface UpdateBlockInput {
  type?: BlockType;
  content?: string;
  order?: number;
  checked?: boolean;
}

export interface CreateRelationInput {
  sourceId: string;
  targetId: string;
  relationType: string;
  label?: string;
  metadata?: Record<string, PropertyValue>;
}

export interface ListRelationsFilter {
  sourceId?: string;
  targetId?: string;
}

export interface VaultProvider {
  getProviderInfo(): VaultProviderInfo;
  getHealth(): VaultHealth;
  getSnapshot(): VaultSnapshot;
  listItems(filter?: ListItemsFilter): MizaanItem[];
  getItem(id: string): MizaanItem | undefined;
  createItem(input: CreateItemInput): MizaanItem;
  updateItem(id: string, input: UpdateItemInput): MizaanItem | undefined;
  archiveItem(id: string): MizaanItem | undefined;
  trashItem(id: string): MizaanItem | undefined;
  restoreItem(id: string): MizaanItem | undefined;
  getBlocks(itemId: string): MizaanBlock[];
  createBlock(itemId: string, input: CreateBlockInput): MizaanBlock;
  updateBlock(blockId: string, input: UpdateBlockInput): MizaanBlock | undefined;
  replaceBlocks(itemId: string, blocks: CreateBlockInput[]): MizaanBlock[];
  listRelations(filter?: ListRelationsFilter): MizaanRelation[];
  createRelation(input: CreateRelationInput): MizaanRelation;
  deleteRelation(id: string): void;
  restoreSnapshotData(input: RestoreSnapshotDataInput): VaultSnapshot;
  subscribe(listener: () => void): () => void;
}
