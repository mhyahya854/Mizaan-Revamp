export interface NativeVaultMetadata {
  app: "Mizaan";
  kind: "mizaan-vault";
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
}

export interface NativeVaultOpenResult {
  path: string;
  metadataPath: string;
  created: boolean;
  metadata: NativeVaultMetadata;
  warnings: string[];
}

export type NativeVaultInvoke = <T>(command: string, args?: Record<string, unknown>) => Promise<T>;

export interface NativeVaultClient {
  createVault(path: string): Promise<NativeVaultOpenResult>;
  openVault(path: string): Promise<NativeVaultOpenResult>;
}

async function defaultInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const { invoke } = await import("@tauri-apps/api/core");
  return invoke<T>(command, args);
}

function normalizeVaultPath(path: string) {
  const normalized = path.trim();
  if (!normalized) {
    throw new Error("Vault path is required.");
  }
  return normalized;
}

export function createNativeVaultClient(
  invoke: NativeVaultInvoke = defaultInvoke,
): NativeVaultClient {
  return {
    async createVault(path: string) {
      return invoke<NativeVaultOpenResult>("mizaan_create_vault", {
        path: normalizeVaultPath(path),
      });
    },
    async openVault(path: string) {
      return invoke<NativeVaultOpenResult>("mizaan_open_vault", {
        path: normalizeVaultPath(path),
      });
    },
  };
}

export const nativeVaultClient = createNativeVaultClient();
