import { describe, expect, it } from "vitest";

import { createVaultArchive } from "./vault-archive";
import {
  createBrowserArchiveText,
  evaluateArchiveManagerState,
  futureImportExportFeatures,
} from "./import-export-manager";
import type { MizaanItem, VaultSnapshot } from "./types";

function makeItem(id: string, overrides: Partial<MizaanItem> = {}): MizaanItem {
  const base: MizaanItem = {
    id,
    type: "note",
    title: `Item ${id}`,
    category: "notes",
    tags: [],
    icon: "FileText",
    createdAt: "2026-06-04T00:00:00.000Z",
    updatedAt: "2026-06-04T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
  };

  return {
    ...base,
    ...overrides,
    tags: overrides.tags ?? base.tags,
    properties: overrides.properties ?? base.properties,
    attachedFiles: overrides.attachedFiles ?? base.attachedFiles,
    metadata: overrides.metadata ?? base.metadata,
  };
}

function makeSnapshot(items: MizaanItem[] = []): VaultSnapshot {
  return {
    providerInfo: {
      id: "browser-local-storage",
      name: "Browser localStorage",
      mode: "prototype-local",
      storageLabel: "Browser localStorage",
      warning: "Browser prototype provider",
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
    health: {
      providerId: "browser-local-storage",
      checkedAt: "2026-06-04T00:00:00.000Z",
      itemCount: items.length,
      blockCount: 0,
      relationCount: 0,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      warnings: [],
    },
    items,
    blocks: [],
    relations: [],
  };
}

describe("import/export manager helpers", () => {
  it("creates browser archive text and validates a good archive", () => {
    const current = makeSnapshot([makeItem("current")]);
    const archiveText = createBrowserArchiveText(makeSnapshot([makeItem("incoming")]), {
      createdAt: "2026-06-04T01:00:00.000Z",
    });

    const state = evaluateArchiveManagerState(current, archiveText, {
      validateNow: true,
    });

    expect(JSON.parse(archiveText)).toMatchObject({
      appName: "Mizaan",
      archiveVersion: 1,
    });
    expect(state.validation?.valid).toBe(true);
    expect(state.canValidate).toBe(true);
    expect(state.canPreview).toBe(true);
    expect(state.archiveSummary).toContain("1 item");
    expect(state.statusMessage).toContain("Archive is valid");
  });

  it("rejects bad JSON and wrong app archives", () => {
    const badJsonState = evaluateArchiveManagerState(makeSnapshot(), "{", {
      validateNow: true,
    });
    const wrongAppState = evaluateArchiveManagerState(
      makeSnapshot(),
      JSON.stringify({ ...createVaultArchive(makeSnapshot()), appName: "OtherApp" }),
      { validateNow: true },
    );

    expect(badJsonState.validation?.valid).toBe(false);
    expect(badJsonState.statusMessage).toContain("Invalid archive JSON");
    expect(wrongAppState.validation?.valid).toBe(false);
    expect(wrongAppState.statusMessage).toContain("wrong app");
  });

  it("rejects unsupported newer archives", () => {
    const archive = createVaultArchive(makeSnapshot([makeItem("future")]));
    const state = evaluateArchiveManagerState(
      makeSnapshot(),
      JSON.stringify({ ...archive, archiveVersion: archive.archiveVersion + 1 }),
      { validateNow: true },
    );

    expect(state.validation?.valid).toBe(false);
    expect(state.statusMessage).toContain("newer archive version");
  });

  it("previews restore plans without mutating current state", () => {
    const current = makeSnapshot([makeItem("current")]);
    const before = JSON.stringify(current);
    const archiveText = createBrowserArchiveText(makeSnapshot([makeItem("incoming")]));

    const state = evaluateArchiveManagerState(current, archiveText, {
      mode: "merge",
      validateNow: true,
      previewNow: true,
    });

    expect(JSON.stringify(current)).toBe(before);
    expect(state.preview?.valid).toBe(true);
    expect(state.preview?.plan?.summary.itemCreates).toBe(1);
    expect(state.canApplyMerge).toBe(true);
    expect(state.canApplyReplace).toBe(false);
    expect(state.applyDisabledReason).toContain("merge");
  });

  it("requires explicit replace confirmation before guarded replace", () => {
    const archiveText = createBrowserArchiveText(makeSnapshot([makeItem("incoming")]));

    const blocked = evaluateArchiveManagerState(makeSnapshot([makeItem("current")]), archiveText, {
      mode: "replace",
      validateNow: true,
      previewNow: true,
    });
    const confirmed = evaluateArchiveManagerState(
      makeSnapshot([makeItem("current")]),
      archiveText,
      {
        mode: "replace",
        validateNow: true,
        previewNow: true,
        replaceConfirmation: "REPLACE",
      },
    );

    expect(blocked.canApplyReplace).toBe(false);
    expect(blocked.replaceConfirmationRequired).toBe(true);
    expect(blocked.applyDisabledReason).toContain("Type REPLACE");
    expect(confirmed.canApplyReplace).toBe(true);
  });

  it("keeps future native import and export features explicitly future-only", () => {
    expect(futureImportExportFeatures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "native-file-import", status: "future-only" }),
        expect.objectContaining({ id: "sqlite-backup", status: "future-only" }),
        expect.objectContaining({ id: "encrypted-backup", status: "future-only" }),
      ]),
    );
  });
});
