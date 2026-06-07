import { describe, expect, it } from "vitest";

import { buildSearchResults } from "../search/search-index";
import { createPageFromTemplate } from "../page/page-workspace";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import type { MizaanItem, VaultSnapshot } from "../vault/types";
import {
  createDefaultDocumentMetadata,
  createDocumentRecordInput,
  getDocumentDisplayFields,
  getDocumentKindLabel,
  getDocumentStateSummary,
  getDocumentStatusLabel,
  getDocumentStorageLabel,
  getDocumentUnsupportedReason,
  isDocumentImportAvailable,
  isDocumentMetadataOnly,
  isDocumentPreviewAvailable,
  normalizeDocumentImportState,
  normalizeDocumentKind,
  normalizeDocumentMetadata,
  normalizeDocumentPreviewState,
  normalizeDocumentRelationIds,
  normalizeDocumentStatus,
  normalizeDocumentStorageState,
  updateDocumentMetadata,
} from "./document-record";

describe("document metadata helpers", () => {
  it(``, async () => {
    const metadata = createDefaultDocumentMetadata();

    expect(metadata).toMatchObject({
      documentTitle: "Untitled document",
      documentKind: "general",
      documentStatus: "metadata-only",
      importState: "record-only",
      previewState: "unavailable",
      storageState: "browser-record",
      category: "documents",
      notes: "",
    });
    expect(metadata.tags).toEqual([]);
    expect(metadata.linkedPageIds).toEqual([]);
    expect(metadata.linkedProjectIds).toEqual([]);
    expect(metadata.linkedPersonIds).toEqual([]);
    expect(metadata.linkedFinanceIds).toEqual([]);
    expect(metadata.fileName).toBe("");
  });

  it(``, async () => {
    const metadata = normalizeDocumentMetadata({ documentTitle: "  Passport copy  " });

    expect(metadata.documentTitle).toBe("Passport copy");
    expect(metadata.documentKind).toBe("general");
    expect(metadata.documentStatus).toBe("metadata-only");
    expect(metadata.fileName).toBe("");
    expect(metadata.fileSize).toBe("");
    expect(metadata.storageState).toBe("browser-record");
  });

  it(``, async () => {
    expect(normalizeDocumentKind("spreadsheet")).toBe("unknown");
    expect(normalizeDocumentStatus("done")).toBe("metadata-only");
    expect(normalizeDocumentImportState("imported")).toBe("record-only");
    expect(normalizeDocumentPreviewState("rendered")).toBe("unavailable");
    expect(normalizeDocumentStorageState("vault")).toBe("browser-record");
  });

  it(``, async () => {
    const metadata = normalizeDocumentMetadata({
      documentTitle: "  Invoice 42  ",
      documentSource: "  Vendor email  ",
      fileName: "  invoice-42.pdf  ",
      fileExtension: "  .PDF  ",
      notes: "  Reconcile before filing.  ",
      retainedCustomField: "keep me",
    });

    expect(metadata.documentTitle).toBe("Invoice 42");
    expect(metadata.documentSource).toBe("Vendor email");
    expect(metadata.fileName).toBe("invoice-42.pdf");
    expect(metadata.fileExtension).toBe("pdf");
    expect(metadata.notes).toBe("Reconcile before filing.");
    expect(metadata.retainedCustomField).toBe("keep me");
  });

  it(``, async () => {
    const current = normalizeDocumentMetadata({
      documentTitle: "Old",
      documentKind: "pdf",
      retainedCustomField: "keep",
    });

    const next = updateDocumentMetadata(current, {
      documentKind: "receipt",
      fileName: " receipt.png ",
    });

    expect(next.documentTitle).toBe("Old");
    expect(next.documentKind).toBe("receipt");
    expect(next.fileName).toBe("receipt.png");
    expect(next.retainedCustomField).toBe("keep");
  });

  it(``, async () => {
    expect(
      normalizeDocumentRelationIds([" page-1 ", "page-1", "", "bad id", "project-1", null]),
    ).toEqual(["page-1", "project-1"]);

    const metadata = normalizeDocumentMetadata({
      linkedPageIds: ["page-1", "page-1", "bad id"],
      linkedProjectIds: ["project-1", undefined, "project-1"],
      linkedPersonIds: ["person-1"],
      linkedFinanceIds: ["finance-1", " finance-2 "],
    });

    expect(metadata.linkedPageIds).toEqual(["page-1"]);
    expect(metadata.linkedProjectIds).toEqual(["project-1"]);
    expect(metadata.linkedPersonIds).toEqual(["person-1"]);
    expect(metadata.linkedFinanceIds).toEqual(["finance-1", "finance-2"]);
  });

  it(``, async () => {
    const metadata = createDefaultDocumentMetadata();

    expect(isDocumentMetadataOnly(metadata)).toBe(true);
    expect(isDocumentImportAvailable(metadata)).toBe(false);
    expect(isDocumentPreviewAvailable(metadata)).toBe(false);
    expect(getDocumentUnsupportedReason(metadata)).toContain("File import is planned");
    expect(getDocumentStateSummary(metadata)).toMatchObject({
      importLabel: "Record only",
      previewLabel: "Unavailable",
      storageLabel: "Browser record",
      metadataOnly: true,
    });
  });

  it(``, async () => {
    const input = createDocumentRecordInput({
      title: "Receipt May 2026",
      kind: "receipt",
      source: "Bank email",
      tags: ["receipt", "tax"],
    });

    expect(input).toMatchObject({
      title: "Receipt May 2026",
      category: "documents",
      type: "document",
      icon: "D",
      status: "Metadata-only",
      tags: ["document", "receipt", "tax"],
    });
    expect(input.metadata).toMatchObject({
      documentTitle: "Receipt May 2026",
      documentKind: "receipt",
      documentStatus: "metadata-only",
      documentSource: "Bank email",
      importState: "record-only",
      previewState: "unavailable",
      storageState: "browser-record",
    });
  });

  it(``, async () => {
    const metadata = normalizeDocumentMetadata({
      documentKind: "identity",
      documentStatus: "needs-review",
      storageState: "future-vault-file",
    });

    expect(getDocumentKindLabel(metadata.documentKind)).toBe("Identity");
    expect(getDocumentStatusLabel(metadata.documentStatus)).toBe("Needs review");
    expect(getDocumentStorageLabel(metadata.storageState)).toBe("Future vault file");
    expect(getDocumentDisplayFields(metadata).kindLabel).toBe("Identity");
  });

  it(``, async () => {
    const documentItem: MizaanItem = {
      id: "doc-1",
      type: "document",
      category: "documents",
      title: "Document shell",
      icon: "D",
      summary: "Metadata-only document record.",
      status: "Metadata-only",
      tags: ["document"],
      createdAt: "2026-06-01T00:00:00.000Z",
      updatedAt: "2026-06-01T00:00:00.000Z",
      properties: {},
      attachedFiles: [],
      metadata: normalizeDocumentMetadata({
        documentTitle: "Insurance Policy",
        fileName: "policy-2026.pdf",
        notes: "Renewal proof",
      }),
    };
    const snapshot: VaultSnapshot = {
      items: [documentItem],
      blocks: [],
      relations: [],
      providerInfo: {
        id: "test",
        name: "TestProvider",
        mode: "prototype-local",
        storageLabel: "test",
        warning: "test",
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
        providerId: "test",
        itemCount: 1,
        blockCount: 0,
        relationCount: 0,
        archivedCount: 0,
        deletedCount: 0,
        portableVaultReady: false,
        sqliteReady: false,
        tauriReady: false,
        checkedAt: "2026-06-01T00:00:00.000Z",
        warnings: [],
      },
    };

    const results = buildSearchResults(snapshot, { query: "policy-2026" });

    expect(results).toHaveLength(1);
    expect(results[0].matchedFields).toContain("property");
  });

  it(``, async () => {
    const provider = new LocalStorageVaultProvider({
      storage: createMemoryStorage(),
      now: () => "2026-06-01T00:00:00.000Z",
      seedOnEmpty: false,
    });

    const invoice = await createPageFromTemplate(provider, "invoice-document-record");

    expect(invoice.category).toBe("documents");
    expect(invoice.type).toBe("document");
    expect(invoice.status).toBe("Metadata-only");
    expect(invoice.metadata.documentKind).toBe("invoice");
    expect(invoice.metadata.importState).toBe("record-only");
    expect(invoice.metadata.previewState).toBe("unavailable");
    expect(invoice.metadata.storageState).toBe("browser-record");
    expect((await provider.getBlocks(invoice.id)).some((block) => block.type === "callout")).toBe(true);
  });
});


