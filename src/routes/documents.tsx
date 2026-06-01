import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FilePlus2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  createDocumentRecordInput,
  getDocumentDisplayFields,
  getDocumentStateSummary,
  isDocumentRecordItem,
  normalizeDocumentMetadataForItem,
} from "@/lib/documents/document-record";
import { createPageFromTemplate, getImplementedTemplates } from "@/lib/page/page-workspace";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/documents")({
  head: () => ({ meta: [{ title: "Documents - Mizaan" }] }),
  component: DocumentsPage,
});

const DOCUMENT_TEMPLATE_IDS = [
  "document-record",
  "receipt-document-record",
  "identity-document-record",
  "invoice-document-record",
  "contract-document-record",
  "reference-document-record",
];

function DocumentsPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const documentSpace = snapshot.items.find(
    (item) =>
      item.category === "documents" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const templates = getImplementedTemplates().filter((template) =>
    DOCUMENT_TEMPLATE_IDS.includes(template.id),
  );
  const documents = useMemo(
    () =>
      snapshot.items
        .filter((item) => isDocumentRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchableDocumentText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );

  function createRecord() {
    const item = provider.createItem({
      ...createDocumentRecordInput(),
      parentId: documentSpace?.id,
    });
    provider.replaceBlocks(item.id, [
      { type: "heading1", content: "Summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a metadata-only document record. Native file import, preview, OCR, and vault file storage are not implemented yet.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  function createFromTemplate(templateId: string) {
    const item = createPageFromTemplate(provider, templateId, {
      parentId: documentSpace?.id,
    });
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">Metadata-only records</p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Documents</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Create local document records you can organize now. Real file import, PDF/DOCX/image
            preview, OCR, thumbnails, and native vault file storage are future phases.
          </p>
        </div>
        <button
          onClick={createRecord}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New document record
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-[1fr_280px]">
        <div className="rounded-md border hairline bg-surface px-4 py-3">
          <h2 className="text-[12.5px] font-semibold text-foreground">Current document truth</h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
            Each record is a provider-backed Mizaan item stored in the browser/localStorage
            prototype. Metadata persists through the current provider. Attached file storage,
            previews, OCR, and extracted text are not implemented.
          </p>
        </div>
        <div className="rounded-md border hairline bg-surface px-4 py-3">
          <h2 className="text-[12.5px] font-semibold text-foreground">Records</h2>
          <p className="mt-1 text-[26px] font-semibold leading-none">{documents.length}</p>
          <p className="mt-1 text-[12px] text-faint">metadata-only document records</p>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Record templates
        </h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => createFromTemplate(template.id)}
              className="rounded-sm border hairline bg-surface px-3 py-2 text-left hover:bg-muted/40"
            >
              <span className="block text-[13px] text-foreground">{template.name}</span>
              <span className="block text-[11.5px] text-faint">{template.summary}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search titles, file names, source, notes"
            className="w-64 bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="rounded-sm border-b-2 border-foreground px-2 py-1 text-foreground -mb-[9px] pb-[9px]">
          Document records
        </span>
        <span className="text-faint">{documents.length} local records</span>
      </div>

      {documents.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {documents.map((item) => (
            <DocumentCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No document records yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a metadata-only document record now. Real file import will come later in the
            native/filesystem phase, so this route intentionally does not show fake import or
            preview buttons.
          </p>
          <button
            onClick={createRecord}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New document record
          </button>
        </div>
      )}
    </div>
  );
}

function DocumentCard({ item }: { item: MizaanItem }) {
  const metadata = normalizeDocumentMetadataForItem(item);
  const display = getDocumentDisplayFields(metadata);
  const summary = getDocumentStateSummary(metadata);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "D"}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="block truncate text-[15px] font-medium hover:underline"
          >
            {item.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-soft">
            {metadata.notes || item.summary || "Metadata-only document record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.kindLabel}</Badge>
        <Badge>{display.statusLabel}</Badge>
        <Badge>{summary.importLabel}</Badge>
        <Badge>{summary.previewLabel}</Badge>
        <Badge>{summary.storageLabel}</Badge>
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="File name" value={metadata.fileName || "No file name"} />
        <Meta label="File type" value={metadata.fileType || metadata.fileExtension || "Not set"} />
        <Meta label="Source" value={metadata.documentSource || "Not set"} />
        <Meta label="Date" value={metadata.documentDate || "Not set"} />
      </dl>

      <div className="mt-3 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        Import and preview are intentionally unavailable in the browser prototype.
      </div>
    </article>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border hairline bg-background px-2 py-0.5 text-faint">
      {children}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-faint">{label}</dt>
      <dd className="truncate text-soft">{value}</dd>
    </div>
  );
}

function searchableDocumentText(item: MizaanItem) {
  const metadata = normalizeDocumentMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.documentTitle,
    metadata.documentKind,
    metadata.documentStatus,
    metadata.documentSource,
    metadata.documentDate,
    metadata.fileName,
    metadata.fileType,
    metadata.fileExtension,
    metadata.tags.join(" "),
    metadata.notes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
