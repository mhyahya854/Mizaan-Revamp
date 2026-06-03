import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Archive, CheckCircle2, Database, ShieldCheck, Wrench } from "lucide-react";

import { VaultArchivePanel } from "@/components/vault/VaultArchivePanel";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import { createVaultHealthSummary, getVaultHealthScore } from "@/lib/vault/vault-health";

export const Route = createFileRoute("/repair")({
  head: () => ({ meta: [{ title: "Repair / Recovery - Mizaan" }] }),
  component: RepairPage,
});

function RepairPage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const health = createVaultHealthSummary(snapshot);
  const score = getVaultHealthScore(health);
  const categories = Object.entries(health.counts.categories).filter(([, count]) => count > 0);

  return (
    <div className="mx-auto w-full max-w-[980px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Recovery and data health</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Repair / Recovery</h1>
      <p className="mt-1 max-w-2xl text-[13.5px] text-soft">
        This center reports browser prototype health and provides archive validation plus restore
        preview. It does not run automatic repair, migrations, rollback, native backup recovery, or
        encrypted recovery.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        <StatusCard icon={ShieldCheck} label="Health" value={score} />
        <StatusCard icon={Database} label="Items" value={String(health.counts.items)} />
        <StatusCard icon={Archive} label="Blocks" value={String(health.counts.blocks)} />
        <StatusCard icon={Wrench} label="Issues" value={String(health.issues.length)} />
      </div>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="font-editorial text-[20px]">Data Health Checks</h2>
            <p className="mt-1 text-[12.5px] text-soft">
              Provider {health.providerName} at {health.storageLabel}. Archive schema{" "}
              {health.archiveSupport.schemaVersion}, archive version{" "}
              {health.archiveSupport.archiveVersion}.
            </p>
          </div>
          <span className="rounded-sm border hairline bg-background px-2 py-1 text-[11px] uppercase tracking-wider text-faint">
            {health.archiveSupport.appName}
          </span>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <HealthRow label="Duplicate item IDs" value={health.duplicateItemIds.length} />
          <HealthRow label="Duplicate block IDs" value={health.duplicateBlockIds.length} />
          <HealthRow label="Duplicate relation IDs" value={health.duplicateRelationIds.length} />
          <HealthRow label="Orphan blocks" value={health.orphanBlockIds.length} />
          <HealthRow label="Orphan relations" value={health.orphanRelationIds.length} />
          <HealthRow label="Invalid metadata refs" value={health.invalidMetadataCount} />
        </div>
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Category Counts</h2>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 md:grid-cols-3">
          {categories.map(([category, count]) => (
            <div
              key={category}
              className="flex items-center justify-between gap-3 rounded-sm border hairline bg-background/60 px-3 py-2 text-[12.5px]"
            >
              <span className="capitalize">{category}</span>
              <span className="font-mono">{count}</span>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="rounded-sm border hairline bg-background/60 px-3 py-2 text-[12.5px] text-faint">
              No local vault items are stored yet.
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Issues and Suggestions</h2>
        {health.issues.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {health.issues.map((issue, index) => (
              <li
                key={`${issue.code}-${issue.recordId ?? index}`}
                className="flex items-start gap-2 text-[12.5px] text-soft"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
                <span>{issue.message}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-3 flex items-start gap-2 text-[12.5px] text-soft">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
            <span>
              No duplicate IDs, orphan records, or invalid metadata references were detected.
            </span>
          </div>
        )}

        <ul className="mt-4 space-y-2 text-[12.5px] text-soft">
          <li>Validate archive JSON before restore.</li>
          <li>Use merge for normal recovery. Replace remains guarded by explicit confirmation.</li>
          <li>
            Use native, SQLite, encrypted, and portable backup language only after those systems
            exist.
          </li>
        </ul>
      </section>

      <div className="mt-5">
        <VaultArchivePanel provider={provider} snapshot={snapshot} surface="repair" />
      </div>
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
      <div className="mt-1 truncate font-editorial text-[24px] capitalize">{value}</div>
    </div>
  );
}

function HealthRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border hairline bg-background/60 px-3 py-2 text-[12.5px]">
      <span>{label}</span>
      <span className={value > 0 ? "text-foreground" : "text-faint"}>{value}</span>
    </div>
  );
}
