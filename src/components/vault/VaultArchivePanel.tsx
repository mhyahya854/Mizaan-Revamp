import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  FileDown,
  FileUp,
  RotateCcw,
  ShieldAlert,
} from "lucide-react";

import {
  createVaultArchive,
  getArchiveItemCounts,
  mergeVaultArchive,
  parseVaultArchiveJson,
  previewVaultRestore,
  replaceVaultArchive,
  summarizeVaultArchive,
  type ArchiveValidationError,
  type ArchiveValidationResult,
  type RestoreMode,
  type RestorePlanResult,
  type VaultArchive,
} from "@/lib/vault/vault-archive";
import type { VaultProvider, VaultSnapshot } from "@/lib/vault/types";
import { cn } from "@/lib/utils";

interface VaultArchivePanelProps {
  provider: VaultProvider;
  snapshot: VaultSnapshot;
  surface: "settings" | "vault" | "import-export" | "repair";
}

export function VaultArchivePanel({ provider, snapshot, surface }: VaultArchivePanelProps) {
  const [archiveText, setArchiveText] = useState("");
  const [validation, setValidation] = useState<ArchiveValidationResult | undefined>();
  const [validatedArchive, setValidatedArchive] = useState<VaultArchive | undefined>();
  const [preview, setPreview] = useState<RestorePlanResult | undefined>();
  const [mode, setMode] = useState<RestoreMode>("merge");
  const [replaceConfirmation, setReplaceConfirmation] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const currentCounts = useMemo(
    () => ({
      items: snapshot.items.length,
      blocks: snapshot.blocks.length,
      relations: snapshot.relations.length,
      archived: snapshot.items.filter((item) => item.archivedAt).length,
      deleted: snapshot.items.filter((item) => item.deletedAt).length,
    }),
    [snapshot.blocks.length, snapshot.items, snapshot.relations.length],
  );

  function resetResults() {
    setValidation(undefined);
    setValidatedArchive(undefined);
    setPreview(undefined);
    setStatusMessage("");
  }

  function handleExportArchive() {
    const archive = createVaultArchive(snapshot, {
      metadata: {
        createdFrom: surface,
        prototypeOnly: true,
      },
    });
    const text = JSON.stringify(archive, null, 2);
    setArchiveText(text);
    setValidation(validateText(text));
    setValidatedArchive(archive);
    setPreview(undefined);
    setStatusMessage("Archive created from current browser prototype data.");

    if (typeof document !== "undefined") {
      const blob = new Blob([text], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mizaan-browser-prototype-archive-${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.json`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  }

  async function handleArchiveFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const text = await file.text();
    setArchiveText(text);
    resetResults();
    setStatusMessage(
      `Loaded archive text from ${file.name}. Validate it before previewing restore.`,
    );
    event.currentTarget.value = "";
  }

  function validateText(text = archiveText) {
    return parseVaultArchiveJson(text);
  }

  function handleValidateArchive() {
    const result = validateText();
    setValidation(result);
    setValidatedArchive(result.archive);
    setPreview(undefined);
    setStatusMessage(
      result.valid
        ? "Archive validated. Restore preview can be created."
        : "Archive validation failed.",
    );
  }

  function handlePreviewRestore() {
    const result = validateText();
    setValidation(result);
    setValidatedArchive(result.archive);

    if (!result.valid || !result.archive) {
      setPreview(undefined);
      setStatusMessage("Restore preview blocked because archive validation failed.");
      return;
    }

    const nextPreview = previewVaultRestore(snapshot, result.archive, { mode });
    setPreview(nextPreview);
    setStatusMessage(
      nextPreview.valid
        ? `${mode === "merge" ? "Merge" : "Replace"} restore preview is ready. No data has been changed.`
        : "Restore preview failed.",
    );
  }

  function handleApplyRestore() {
    const archive = validatedArchive ?? validateText().archive;
    if (!archive) {
      handleValidateArchive();
      setStatusMessage("Restore blocked because no valid archive is loaded.");
      return;
    }

    const result =
      mode === "merge"
        ? mergeVaultArchive(snapshot, archive)
        : replaceVaultArchive(snapshot, archive, {
            confirmedReplace: replaceConfirmation.trim() === "REPLACE",
          });

    if (!result.ok || !result.snapshot) {
      setStatusMessage(result.errors.map((error) => readableError(error)).join(" "));
      setPreview(
        result.plan
          ? { valid: true, plan: result.plan, errors: [], warnings: result.warnings }
          : undefined,
      );
      return;
    }

    provider.restoreSnapshotData({
      mode,
      confirmedReplace: mode === "replace" ? true : undefined,
      items: result.snapshot.items,
      blocks: result.snapshot.blocks,
      relations: result.snapshot.relations,
    });
    setPreview(
      result.plan
        ? { valid: true, plan: result.plan, errors: [], warnings: result.warnings }
        : undefined,
    );
    setStatusMessage(
      mode === "merge"
        ? "Restore merge applied to the current browser prototype provider."
        : "Restore replace applied after explicit confirmation.",
    );
    setReplaceConfirmation("");
  }

  const archiveCounts = validatedArchive ? getArchiveItemCounts(validatedArchive) : undefined;

  return (
    <section className="rounded-md border hairline bg-surface p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="font-editorial text-[20px]">Browser Archive</h2>
          <p className="mt-1 max-w-2xl text-[12.5px] text-soft">
            This is a JSON archive for the current browser/localStorage prototype. It is not a
            native vault backup, SQLite backup, encrypted backup, portable folder, or app lock.
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportArchive}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-sm border hairline bg-background px-3 text-[12.5px] font-medium hover:bg-muted/50"
        >
          <FileDown className="h-4 w-4" />
          Export JSON
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <ArchiveMetric label="Current items" value={String(currentCounts.items)} />
        <ArchiveMetric label="Current blocks" value={String(currentCounts.blocks)} />
        <ArchiveMetric label="Current relations" value={String(currentCounts.relations)} />
      </div>

      <div className="mt-4 rounded-sm border hairline bg-background/60 p-3">
        <label className="flex cursor-pointer items-center gap-2 text-[12.5px] font-medium">
          <FileUp className="h-4 w-4" />
          Load archive file
          <input
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={handleArchiveFile}
          />
        </label>
        <textarea
          value={archiveText}
          onChange={(event) => {
            setArchiveText(event.target.value);
            resetResults();
          }}
          placeholder="Paste a Mizaan browser archive JSON here."
          className="mt-3 min-h-[132px] w-full resize-y rounded-sm border hairline bg-surface px-3 py-2 font-mono text-[12px] outline-none placeholder:text-faint"
        />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleValidateArchive}
          disabled={!archiveText.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-sm border hairline bg-background px-3 text-[12.5px] font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShieldAlert className="h-4 w-4" />
          Validate
        </button>
        <button
          type="button"
          onClick={handlePreviewRestore}
          disabled={!archiveText.trim()}
          className="inline-flex h-9 items-center gap-2 rounded-sm border hairline bg-background px-3 text-[12.5px] font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RotateCcw className="h-4 w-4" />
          Preview Restore
        </button>
        <div className="ml-0 flex rounded-sm border hairline bg-background p-0.5 md:ml-2">
          {(["merge", "replace"] as RestoreMode[]).map((nextMode) => (
            <button
              type="button"
              key={nextMode}
              onClick={() => {
                setMode(nextMode);
                setPreview(undefined);
              }}
              className={cn(
                "h-8 rounded-[3px] px-3 text-[12px] font-medium capitalize",
                mode === nextMode ? "bg-surface text-foreground shadow-sm" : "text-faint",
              )}
            >
              {nextMode}
            </button>
          ))}
        </div>
      </div>

      {mode === "replace" && (
        <div className="mt-3 rounded-sm border hairline bg-background/70 p-3">
          <div className="flex items-start gap-2 text-[12.5px] text-soft">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
            <span>
              Replace removes current browser records that are absent from the archive. Type
              <span className="mx-1 font-mono text-foreground">REPLACE</span>
              before applying.
            </span>
          </div>
          <input
            value={replaceConfirmation}
            onChange={(event) => setReplaceConfirmation(event.target.value)}
            placeholder="REPLACE"
            className="mt-3 h-9 w-full max-w-[220px] rounded-sm border hairline bg-surface px-2 text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
      )}

      <ArchiveResult validation={validation} archive={validatedArchive} counts={archiveCounts} />
      <RestorePreview preview={preview} />

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleApplyRestore}
          disabled={
            !preview?.valid ||
            !validatedArchive ||
            (mode === "replace" && replaceConfirmation.trim() !== "REPLACE")
          }
          className="inline-flex h-9 items-center gap-2 rounded-sm border hairline bg-foreground px-3 text-[12.5px] font-medium text-background disabled:cursor-not-allowed disabled:opacity-45"
        >
          <CheckCircle2 className="h-4 w-4" />
          Apply {mode === "merge" ? "Merge" : "Replace"}
        </button>
        {statusMessage && <span className="text-[12.5px] text-soft">{statusMessage}</span>}
      </div>
    </section>
  );
}

function ArchiveMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border hairline bg-background/60 px-3 py-2">
      <div className="text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-editorial text-[22px]">{value}</div>
    </div>
  );
}

function ArchiveResult({
  validation,
  archive,
  counts,
}: {
  validation?: ArchiveValidationResult;
  archive?: VaultArchive;
  counts?: ReturnType<typeof getArchiveItemCounts>;
}) {
  if (!validation) return null;

  return (
    <div className="mt-4 rounded-sm border hairline bg-background/60 p-3 text-[12.5px]">
      {validation.valid && archive && counts ? (
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-foreground">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Archive validated: {summarizeVaultArchive(archive)}.</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <ArchiveMetric label="Archive items" value={String(counts.items)} />
            <ArchiveMetric label="Archive blocks" value={String(counts.blocks)} />
            <ArchiveMetric label="Archive relations" value={String(counts.relations)} />
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-soft">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
            <span>Archive rejected. Current browser data was not changed.</span>
          </div>
          <ul className="space-y-1">
            {validation.errors.map((error) => (
              <li key={`${error.code}-${error.path ?? ""}`}>{readableError(error)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function RestorePreview({ preview }: { preview?: RestorePlanResult }) {
  if (!preview) return null;

  if (!preview.valid || !preview.plan) {
    return (
      <div className="mt-4 rounded-sm border hairline bg-background/60 p-3 text-[12.5px] text-soft">
        Restore preview failed. No data was changed.
      </div>
    );
  }

  const { summary } = preview.plan;
  return (
    <div className="mt-4 rounded-sm border hairline bg-background/60 p-3 text-[12.5px]">
      <div className="flex items-start gap-2 text-foreground">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
        <span>Restore preview ready. No data has been changed.</span>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <ArchiveMetric label="Create items" value={String(summary.itemCreates)} />
        <ArchiveMetric label="Update items" value={String(summary.itemUpdates)} />
        <ArchiveMetric label="Remove items" value={String(summary.itemRemovals)} />
        <ArchiveMetric label="Block changes" value={String(summary.blockReplacements)} />
      </div>
      {preview.plan.warnings.length > 0 && (
        <ul className="mt-3 space-y-1 text-soft">
          {preview.plan.warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function readableError(error: ArchiveValidationError) {
  const path = error.path ? ` (${error.path})` : "";
  return `${error.code}${path}: ${error.message}`;
}
