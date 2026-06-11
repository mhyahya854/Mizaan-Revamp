import { getVaultProvider } from "./vault/local-storage-vault-provider";
import type {
  CreateItemInput,
  ItemCategory,
  MizaanBlock,
  MizaanItem,
  UpdateItemInput,
} from "./vault/types";

export async function listLocalItems(category?: ItemCategory): Promise<MizaanItem[]> {
  return getVaultProvider().listItems(category ? { category } : undefined);
}

export async function getLocalItem(id: string): Promise<MizaanItem | undefined> {
  return getVaultProvider().getItem(id);
}

export async function createLocalItem(input: CreateItemInput): Promise<MizaanItem> {
  return getVaultProvider().createItem(input);
}

export async function updateLocalItem(
  id: string,
  input: UpdateItemInput,
): Promise<MizaanItem | undefined> {
  return getVaultProvider().updateItem(id, input);
}

export async function getLocalItemBlocks(itemId: string): Promise<MizaanBlock[]> {
  return getVaultProvider().getBlocks(itemId);
}
