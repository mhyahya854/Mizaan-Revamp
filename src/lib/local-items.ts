import { getVaultProvider } from "./vault/local-storage-vault-provider";
import type {
  CreateItemInput,
  ItemCategory,
  MizaanBlock,
  MizaanItem,
  UpdateItemInput,
} from "./vault/types";

export function listLocalItems(category?: ItemCategory): MizaanItem[] {
  return getVaultProvider().listItems(category ? { category } : undefined);
}

export function getLocalItem(id: string): MizaanItem | undefined {
  return getVaultProvider().getItem(id);
}

export function createLocalItem(input: CreateItemInput): MizaanItem {
  return getVaultProvider().createItem(input);
}

export function updateLocalItem(id: string, input: UpdateItemInput): MizaanItem | undefined {
  return getVaultProvider().updateItem(id, input);
}

export function getLocalItemBlocks(itemId: string): MizaanBlock[] {
  return getVaultProvider().getBlocks(itemId);
}
