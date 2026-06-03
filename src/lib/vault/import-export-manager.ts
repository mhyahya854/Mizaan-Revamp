import {
  createVaultArchive,
  parseVaultArchiveJson,
  previewVaultRestore,
  summarizeVaultArchive,
  type ArchiveValidationResult,
  type RestoreMode,
  type RestorePlanResult,
} from "./vault-archive";
import type { CreateVaultArchiveOptions } from "./vault-archive";
import type { VaultSnapshot } from "./types";

export interface FutureImportExportFeature {
  id: string;
  label: string;
  status: "future-only";
  reason: string;
}

export interface ArchiveManagerState {
  hasInput: boolean;
  validation?: ArchiveValidationResult;
  preview?: RestorePlanResult;
  archiveSummary?: string;
  canValidate: boolean;
  canPreview: boolean;
  canApplyMerge: boolean;
  canApplyReplace: boolean;
  applyDisabledReason: string;
  statusMessage: string;
  replaceConfirmationRequired: boolean;
  futureFeatures: FutureImportExportFeature[];
}

export const futureImportExportFeatures: FutureImportExportFeature[] = [
  {
    id: "markdown-export",
    label: "Markdown export",
    status: "future-only",
    reason: "Requires native document/file strategy before it can be claimed.",
  },
  {
    id: "csv-export",
    label: "CSV export",
    status: "future-only",
    reason: "Requires module-specific export schemas and tests.",
  },
  {
    id: "pdf-export",
    label: "PDF export",
    status: "future-only",
    reason: "Requires a real rendering/export pipeline.",
  },
  {
    id: "native-file-import",
    label: "Native file import",
    status: "future-only",
    reason: "No native filesystem access is implemented in this browser prototype.",
  },
  {
    id: "folder-import",
    label: "Folder import",
    status: "future-only",
    reason: "Portable vault folders are future native work.",
  },
  {
    id: "native-backup",
    label: "Native backup",
    status: "future-only",
    reason: "Requires the future Windows/Tauri storage layer.",
  },
  {
    id: "sqlite-backup",
    label: "SQLite backup",
    status: "future-only",
    reason: "SQLite is not implemented yet.",
  },
  {
    id: "encrypted-backup",
    label: "Encrypted backup",
    status: "future-only",
    reason: "Encryption and app lock are future privacy work.",
  },
];

export function createBrowserArchiveText(
  snapshot: VaultSnapshot,
  options: CreateVaultArchiveOptions = {},
): string {
  return JSON.stringify(createVaultArchive(snapshot, options), null, 2);
}

export function evaluateArchiveManagerState(
  current: VaultSnapshot,
  archiveText: string,
  options: {
    mode?: RestoreMode;
    replaceConfirmation?: string;
    validateNow?: boolean;
    previewNow?: boolean;
  } = {},
): ArchiveManagerState {
  const normalizedText = archiveText.trim();
  const hasInput = normalizedText.length > 0;
  const mode = options.mode ?? "merge";
  const shouldValidate = hasInput && (options.validateNow === true || options.previewNow === true);
  const validation = shouldValidate ? parseVaultArchiveJson(normalizedText) : undefined;
  const archiveSummary =
    validation?.valid && validation.archive ? summarizeVaultArchive(validation.archive) : undefined;
  const preview =
    options.previewNow === true && validation?.valid && validation.archive
      ? previewVaultRestore(current, validation.archive, {
          mode,
          confirmedReplace: options.replaceConfirmation?.trim() === "REPLACE",
        })
      : undefined;
  const canPreview = validation?.valid === true && Boolean(validation.archive);
  const previewReady = preview?.valid === true && Boolean(preview.plan);
  const replaceConfirmationRequired = mode === "replace" && previewReady;
  const canApplyMerge = mode === "merge" && previewReady;
  const canApplyReplace =
    mode === "replace" && previewReady && options.replaceConfirmation?.trim() === "REPLACE";

  return {
    hasInput,
    validation,
    preview,
    archiveSummary,
    canValidate: hasInput,
    canPreview,
    canApplyMerge,
    canApplyReplace,
    applyDisabledReason: getApplyDisabledReason({
      hasInput,
      validation,
      preview,
      mode,
      canApplyMerge,
      canApplyReplace,
      replaceConfirmationRequired,
    }),
    statusMessage: getStatusMessage(hasInput, validation, preview, archiveSummary),
    replaceConfirmationRequired,
    futureFeatures: futureImportExportFeatures,
  };
}

export function getArchiveValidationStatus(validation?: ArchiveValidationResult): string {
  if (!validation) return "Archive has not been validated.";
  if (validation.valid) return "Archive is valid for this browser prototype.";
  return `Archive is blocked: ${formatValidationErrors(validation)}`;
}

function getStatusMessage(
  hasInput: boolean,
  validation?: ArchiveValidationResult,
  preview?: RestorePlanResult,
  archiveSummary?: string,
): string {
  if (!hasInput) return "Paste or export a browser archive before validation.";
  if (!validation) return "Archive text is ready to validate.";
  if (!validation.valid) return getArchiveValidationStatus(validation);
  if (preview?.valid) return "Restore preview is ready. Review changes before applying.";
  return `Archive is valid${archiveSummary ? `: ${archiveSummary}.` : "."}`;
}

function getApplyDisabledReason(input: {
  hasInput: boolean;
  validation?: ArchiveValidationResult;
  preview?: RestorePlanResult;
  mode: RestoreMode;
  canApplyMerge: boolean;
  canApplyReplace: boolean;
  replaceConfirmationRequired: boolean;
}): string {
  if (!input.hasInput) return "Paste or export a browser archive first.";
  if (input.validation?.valid === false) return "Fix archive validation errors before restore.";
  if (!input.preview?.valid) return "Preview restore before applying changes.";
  if (input.mode === "merge" && input.canApplyMerge) return "Safe merge can be applied.";
  if (input.mode === "replace" && input.canApplyReplace) return "Guarded replace can be applied.";
  if (input.replaceConfirmationRequired) return "Type REPLACE to enable guarded replace.";
  return "Restore is not ready to apply.";
}

function formatValidationErrors(validation: ArchiveValidationResult): string {
  return validation.errors
    .map((error) => formatValidationError(error.code, error.message))
    .join(" ");
}

function formatValidationError(code: string, message: string): string {
  if (code === "invalid-json") return `Invalid archive JSON: ${message}`;
  if (code === "wrong-app") return `Archive is from the wrong app: ${message}`;
  if (code === "unsupported-archive-version") {
    return `Archive uses a newer archive version than this browser prototype supports: ${message}`;
  }
  return message;
}
