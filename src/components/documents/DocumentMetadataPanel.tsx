import { AlertTriangle } from "lucide-react";

import {
  DOCUMENT_KIND_VALUES,
  DOCUMENT_STATUS_VALUES,
  getDocumentDisplayFields,
  getDocumentKindLabel,
  getDocumentStateSummary,
  getDocumentStatusLabel,
  isDocumentImportAvailable,
  isDocumentPreviewAvailable,
  normalizeDocumentMetadataForItem,
  updateDocumentMetadata,
  type DocumentKind,
  type DocumentStatus,
} from "@/lib/documents/document-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function DocumentMetadataPanel({
  item,
  provider,
}: {
  item: MizaanItem;
  provider: VaultProvider;
}) {
  const metadata = normalizeDocumentMetadataForItem(item);
  const display = getDocumentDisplayFields(metadata);
  const summary = getDocumentStateSummary(metadata);

  async function persist(patch: Record<string, unknown>) {
    const next = updateDocumentMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.documentTitle || "Untitled document",
      status: getDocumentStatusLabel(next.documentStatus),
      tags: next.tags,
      properties: {
        status: getDocumentStatusLabel(next.documentStatus),
        documentKind: getDocumentKindLabel(next.documentKind),
        fileState: display.storageLabel,
        fileName: next.fileName,
        fileExtension: next.fileExtension,
        fileType: next.fileType,
      },
      metadata: next,
    });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          D
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Document metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Metadata-only record. Real file import, preview, OCR, and vault file storage are future
            native phases.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Document title"
          value={metadata.documentTitle}
          onChange={(value) => persist({ documentTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Kind"
            value={metadata.documentKind}
            options={DOCUMENT_KIND_VALUES.map((value) => ({
              value,
              label: getDocumentKindLabel(value),
            }))}
            onChange={(value) => persist({ documentKind: value as DocumentKind })}
          />
          <SelectField
            label="Status"
            value={metadata.documentStatus}
            options={DOCUMENT_STATUS_VALUES.map((value) => ({
              value,
              label: getDocumentStatusLabel(value),
            }))}
            onChange={(value) => persist({ documentStatus: value as DocumentStatus })}
          />
        </div>
        <TextField
          label="Source"
          value={metadata.documentSource}
          onChange={(value) => persist({ documentSource: value })}
          placeholder="Where this record came from"
        />
        <TextField
          label="Document date"
          value={metadata.documentDate}
          onChange={(value) => persist({ documentDate: value })}
          type="date"
        />
        <TextField
          label="File name metadata"
          value={metadata.fileName}
          onChange={(value) => persist({ fileName: value })}
          placeholder="example.pdf"
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="File type"
            value={metadata.fileType}
            onChange={(value) => persist({ fileType: value })}
            placeholder="application/pdf"
          />
          <TextField
            label="Extension"
            value={metadata.fileExtension}
            onChange={(value) => persist({ fileExtension: value })}
            placeholder="pdf"
          />
        </div>
        <label className="block">
          <span className="text-[11px] font-medium uppercase tracking-wider text-faint">Notes</span>
          <textarea
            value={metadata.notes}
            onChange={(event) => persist({ notes: event.target.value })}
            placeholder="Description or filing notes"
            className="mt-1 min-h-[76px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
          />
        </label>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow
          label="Import"
          value={summary.importLabel}
          active={isDocumentImportAvailable(metadata)}
        />
        <StateRow
          label="Preview"
          value={summary.previewLabel}
          active={isDocumentPreviewAvailable(metadata)}
        />
        <StateRow label="Storage" value={summary.storageLabel} active={false} />
        <StateRow
          label="Relations"
          value={`${display.relationCount} normalized IDs`}
          active={false}
        />
      </div>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/35 px-2 py-2 text-[11.5px] leading-relaxed text-soft">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>{summary.unsupportedReason}</span>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function StateRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1">
      <span className="text-faint">{label}</span>
      <span className={active ? "font-medium text-foreground" : "font-medium text-soft"}>
        {value}
      </span>
    </div>
  );
}


