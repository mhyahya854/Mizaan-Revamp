import { describe, expect, it } from "vitest";

import { createNativeVaultClient, type NativeVaultOpenResult } from "./native-vault-client";

const result: NativeVaultOpenResult = {
  path: "E:\\Mizaan Vault",
  metadataPath: "E:\\Mizaan Vault\\mizaan.vault.json",
  created: true,
  metadata: {
    app: "Mizaan",
    kind: "mizaan-vault",
    schemaVersion: 1,
    createdAt: "fixture",
    updatedAt: "fixture",
  },
  warnings: [],
};

describe("native vault client", () => {
  it("maps create and open requests to the Tauri vault commands", async () => {
    const calls: Array<{ command: string; args?: Record<string, unknown> }> = [];
    const client = createNativeVaultClient(async (command, args) => {
      calls.push({ command, args });
      return result as never;
    });

    await expect(client.createVault("E:\\Mizaan Vault")).resolves.toEqual(result);
    await expect(client.openVault("E:\\Mizaan Vault")).resolves.toEqual(result);

    expect(calls).toEqual([
      { command: "mizaan_create_vault", args: { path: "E:\\Mizaan Vault" } },
      { command: "mizaan_open_vault", args: { path: "E:\\Mizaan Vault" } },
    ]);
  });

  it("rejects blank paths before invoking native commands", async () => {
    const calls: string[] = [];
    const client = createNativeVaultClient(async (command) => {
      calls.push(command);
      return result as never;
    });

    await expect(client.createVault("  ")).rejects.toThrow(/path is required/i);
    await expect(client.openVault("")).rejects.toThrow(/path is required/i);
    expect(calls).toEqual([]);
  });
});
