import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

import { VaultArchivePanel } from "@/components/vault/VaultArchivePanel";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import { cn } from "@/lib/utils";
import { useTheme, Theme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings - Mizaan" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const snapshot = useVaultSnapshot();
  const provider = useVaultProvider();
  const providerInfo = snapshot.providerInfo;
  const { theme, setTheme } = useTheme();

  const systemStatus = [
    { label: "Workspace name", value: "Mizaan" },
    { label: "Storage boundary", value: providerInfo.storageLabel },
    { label: "Provider", value: providerInfo.name },
    { label: "Current mode", value: "Browser/local prototype" },
    { label: "Native storage", value: "Not implemented" },
    { label: "SQLite", value: "Not implemented" },
    { label: "Tauri", value: "Not implemented" },
    { label: "Encryption/app lock", value: "Not implemented" },
    { label: "Cloud/auth/sync", value: "Not implemented" },
  ];

  const appearance = [
    { label: "Theme", value: "Current CSS theme" },
    { label: "Density", value: "Cozy" },
    { label: "Editor font", value: "Newsreader / Inter" },
  ];

  const featureStatus = [
    { label: "Pages", status: true },
    { label: "Search", status: true },
    { label: "Databases", status: true },
    { label: "Templates", status: true },
    { label: "Documents", status: true },
    { label: "Graph", status: true },
    { label: "Projects/tasks", status: true },
    { label: "People", status: true },
    { label: "Finance", status: true },
    { label: "Trackers/goals", status: true },
    { label: "Calendar", status: true },
    { label: "Import/export", status: true },
    { label: "Repair", status: true },
    { label: "Native app", status: false },
    { label: "SQLite", status: false },
    { label: "Encryption/app lock", status: false },
  ];

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Local workspace</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Settings</h1>
      <p className="mt-1 text-[13.5px] text-soft">
        Current settings reflect the browser prototype facts.
      </p>

      <div className="mt-8 space-y-10">
        {/* System Status */}
        <section>
          <h2 className="font-editorial text-[18px]">System Status</h2>
          <ul className="mt-3 divide-y hairline border-y hairline">
            {systemStatus.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 py-3 text-[13.5px]"
              >
                <span className="text-soft">{item.label}</span>
                <span
                  className={cn(
                    "text-right",
                    item.value === "Not implemented" ? "text-faint" : "text-foreground font-medium",
                  )}
                >
                  {item.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Data Safety */}
        <section>
          <h2 className="font-editorial text-[18px]">Data Safety</h2>
          <div className="mt-3 rounded-md border hairline bg-surface p-4 text-[13px]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
              <div>
                <div className="font-medium text-foreground">Browser storage can be cleared</div>
                <div className="mt-1 text-soft leading-relaxed">
                  Because this is a prototype, your data is stored in the browser's localStorage. It
                  may be cleared by browser updates, cleaning tools, or low disk space. Please use
                  the Import/Export archive frequently to back up your workspace.
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/import-export"
                    className="rounded-sm border hairline bg-background px-3 py-1.5 font-medium hover:bg-muted"
                  >
                    Import / Export
                  </Link>
                  <Link
                    to="/vault"
                    className="rounded-sm border hairline bg-background px-3 py-1.5 font-medium hover:bg-muted"
                  >
                    Vault Status
                  </Link>
                  <Link
                    to="/repair"
                    className="rounded-sm border hairline bg-background px-3 py-1.5 font-medium hover:bg-muted"
                  >
                    Repair Tools
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section>
          <h2 className="font-editorial text-[18px]">Appearance</h2>
          <ul className="mt-3 divide-y hairline border-y hairline">
            {appearance.map((item) => (
              <li
                key={item.label}
                className="flex items-center justify-between gap-4 py-3 text-[13.5px]"
              >
                <span className="text-soft">{item.label}</span>
                {item.label === "Theme" ? (
                  <div className="flex items-center gap-0.5 rounded-md border hairline bg-background p-0.5">
                    {(["light", "dark", "night", "system"] as Theme[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={cn(
                          "rounded-sm px-2.5 py-1 text-[12px] font-medium capitalize transition-all cursor-pointer",
                          theme === t
                            ? "bg-surface text-foreground shadow-sm border border-border"
                            : "text-faint hover:text-foreground hover:bg-muted/50 border border-transparent",
                        )}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-right text-foreground">{item.value}</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Feature Status */}
        <section>
          <h2 className="font-editorial text-[18px]">Feature Status</h2>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featureStatus.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center justify-between rounded-md border hairline bg-surface px-4 py-3 text-[13px]"
              >
                <span className="text-foreground">{feature.label}</span>
                {feature.status ? (
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Ready
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-faint">
                    <XCircle className="h-3.5 w-3.5" /> Future
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        <VaultArchivePanel provider={provider} snapshot={snapshot} surface="settings" />

        <section>
          <h2 className="font-editorial text-[18px]">Unavailable until later phases</h2>
          <div className="mt-3 rounded-md border hairline bg-surface p-4 text-[13px]">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-faint" />
              <div>
                <div className="text-foreground">
                  No destructive local data action is exposed here.
                </div>
                <div className="mt-1 text-faint">
                  Backup, restore, app lock, encrypted backups, real folder selection, and permanent
                  delete controls are intentionally not presented as ready in this prototype.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
