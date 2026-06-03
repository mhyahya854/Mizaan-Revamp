import { createFileRoute } from "@tanstack/react-router";
import { Archive, CheckCircle2, FileJson, ShieldAlert } from "lucide-react";

import { VaultArchivePanel } from "@/components/vault/VaultArchivePanel";
import { futureImportExportFeatures } from "@/lib/vault/import-export-manager";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import { createVaultHealthSummary } from "@/lib/vault/vault-health";

export const Route = createFileRoute("/import-export")({
  head: () => ({ meta: [{ title: "Import / Export - Mizaan" }] }),
  component: ImportExportPage,
});

function ImportExportPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const health = createVaultHealthSummary(snapshot);
  const supported = [
    "Browser JSON archive export",
    "Paste or load archive JSON",
    "Archive validation",
    "Restore preview without mutation",
    "Safe merge",
    "Guarded replace with explicit confirmation",
  ];

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Browser archive manager</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Import / Export</h1>
      <p className="mt-1 max-w-2xl text-[13.5px] text-soft">
        This manager exposes the current browser JSON archive flow. It does not import native
        folders, documents, markdown, CSV, PDF, SQLite backups, encrypted backups, or portable vault
        folders.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <StatusCard icon={Archive} label="Archive version" value="1" />
        <StatusCard icon={FileJson} label="Current items" value={String(health.counts.items)} />
        <StatusCard icon={ShieldAlert} label="Health issues" value={String(health.issues.length)} />
      </div>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Currently Supported</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {supported.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 rounded-sm border hairline bg-background/60 px-3 py-2 text-[12.5px]"
            >
              <CheckCircle2 className="h-4 w-4 text-soft" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-5">
        <VaultArchivePanel provider={provider} snapshot={snapshot} surface="import-export" />
      </div>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Future Only</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {futureImportExportFeatures.map((feature) => (
            <div
              key={feature.id}
              className="rounded-sm border hairline bg-background/60 px-3 py-2 text-[12.5px]"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-medium">{feature.label}</span>
                <span className="shrink-0 text-[11px] uppercase tracking-wider text-faint">
                  future
                </span>
              </div>
              <p className="mt-1 text-faint">{feature.reason}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border hairline bg-surface p-4">
      <Icon className="h-4 w-4 text-faint" />
      <div className="mt-3 text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-editorial text-[28px]">{value}</div>
    </div>
  );
}
