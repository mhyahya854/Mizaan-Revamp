import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Database, FolderOpen, HardDrive, ShieldCheck } from "lucide-react";

import { VaultArchivePanel } from "@/components/vault/VaultArchivePanel";
import { useVaultLifecycleStatus, useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";

export const Route = createFileRoute("/vault")({
  head: () => ({ meta: [{ title: "Vault - Mizaan" }] }),
  component: VaultPage,
});

function VaultPage() {
  const { session, providerInfo, health, recentVaults } = useVaultLifecycleStatus();
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();

  return (
    <div className="mx-auto w-full max-w-[920px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Local storage boundary</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Vault</h1>
      <p className="mt-1 max-w-2xl text-[13.5px] text-soft">
        This screen shows the active prototype vault boundary. It does not claim portable folders,
        SQLite, Tauri filesystem access, markdown mirrors, or lock files are ready.
      </p>

      <section className="mt-8 rounded-md border hairline bg-surface p-4">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-sm border hairline bg-background">
            <HardDrive className="h-4 w-4 text-soft" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-editorial text-[22px]">{session.displayName}</h2>
            <p className="mt-1 text-[13px] text-soft">{providerInfo.warning}</p>
            <dl className="mt-4 grid gap-2 text-[12.5px] sm:grid-cols-2">
              <Info label="Mode" value={session.mode} />
              <Info label="Provider" value={providerInfo.name} />
              <Info label="Storage" value={providerInfo.storageLabel} />
              <Info label="Vault ID" value={session.vaultId} />
            </dl>
          </div>
        </div>
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <StatusCard icon={Database} label="Items" value={String(health.itemCount)} />
        <StatusCard icon={ShieldCheck} label="Blocks" value={String(health.blockCount)} />
        <StatusCard icon={FolderOpen} label="Relations" value={String(health.relationCount)} />
      </div>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Capability truth</h2>
        <div className="mt-3 grid gap-2 text-[12.5px] sm:grid-cols-2">
          <Capability label="Item CRUD" active={providerInfo.capabilities.itemCrud} />
          <Capability label="Block CRUD" active={providerInfo.capabilities.blockCrud} />
          <Capability label="Relations" active={providerInfo.capabilities.relations} />
          <Capability
            label="Browser localStorage prototype"
            active={providerInfo.capabilities.localStoragePrototype}
          />
          <Capability
            label="Portable folder vault"
            active={providerInfo.capabilities.portableFolder}
          />
          <Capability label="SQLite vault" active={providerInfo.capabilities.sqlite} />
          <Capability label="Tauri filesystem" active={providerInfo.capabilities.tauriFilesystem} />
          <Capability label="Markdown mirrors" active={providerInfo.capabilities.markdownMirrors} />
        </div>
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <h2 className="font-editorial text-[20px]">Health warnings</h2>
        <ul className="mt-3 space-y-2">
          {health.warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2 text-[12.5px] text-soft">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
              <span>{warning}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-5">
        <VaultArchivePanel provider={provider} snapshot={snapshot} surface="vault" />
      </div>

      <section className="mt-5 rounded-md border hairline bg-surface p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-editorial text-[20px]">Recent prototype vaults</h2>
          <Link to="/settings" className="text-[12px] text-faint hover:text-foreground">
            Settings
          </Link>
        </div>
        <ul className="mt-3 divide-y hairline border-y hairline text-[12.5px]">
          {recentVaults.map((entry) => (
            <li key={entry.vaultId} className="flex items-center justify-between gap-3 py-2">
              <span className="truncate">{entry.displayName}</span>
              <span className="shrink-0 text-faint">{entry.mode}</span>
            </li>
          ))}
          {!recentVaults.length && (
            <li className="py-3 text-faint">No recent vaults recorded yet.</li>
          )}
        </ul>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border hairline bg-background/60 px-2 py-1.5">
      <dt className="text-[11px] uppercase tracking-wider text-faint">{label}</dt>
      <dd className="mt-0.5 truncate text-foreground">{value}</dd>
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

function Capability({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-sm border hairline bg-background/60 px-2 py-1.5">
      <span>{label}</span>
      <span className={active ? "text-foreground" : "text-faint"}>
        {active ? "implemented" : "not implemented"}
      </span>
    </div>
  );
}
