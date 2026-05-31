import { createFileRoute, Link } from "@tanstack/react-router";
import { HardDrive, ShieldAlert } from "lucide-react";

import { useVaultSnapshot } from "@/lib/vault/use-vault";
import { cn } from "@/lib/utils";
import { useTheme, Theme } from "@/hooks/use-theme";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings - Mizaan" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const snapshot = useVaultSnapshot();
  const providerInfo = snapshot.providerInfo;
  const { theme, setTheme } = useTheme();

  const sections = [
    {
      title: "Workspace",
      items: [
        { label: "Workspace name", value: "Mizaan" },
        { label: "Storage boundary", value: providerInfo.storageLabel },
        { label: "Provider", value: providerInfo.name },
      ],
    },
    {
      title: "Appearance",
      items: [
        { label: "Theme", value: "Current CSS theme" },
        { label: "Density", value: "Cozy" },
        { label: "Editor font", value: "Newsreader / Inter" },
      ],
    },
    {
      title: "Data truth",
      items: [
        { label: "Items", value: String(snapshot.health.itemCount) },
        { label: "Blocks", value: String(snapshot.health.blockCount) },
        { label: "Relations", value: String(snapshot.health.relationCount) },
        { label: "Portable folder", value: "not implemented" },
        { label: "SQLite", value: "not implemented" },
        { label: "Tauri filesystem", value: "not implemented" },
      ],
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Local workspace</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Settings</h1>
      <p className="mt-1 text-[13.5px] text-soft">
        Current settings are read-only prototype facts. Editable app settings come after the
        provider boundary is stronger.
      </p>

      <Link
        to="/vault"
        className="mt-6 flex items-start gap-3 rounded-md border hairline bg-surface p-4 hover:bg-muted/30"
      >
        <div className="grid h-9 w-9 place-items-center rounded-sm border hairline bg-background">
          <HardDrive className="h-4 w-4 text-soft" />
        </div>
        <div className="min-w-0">
          <div className="text-[13.5px] font-medium">Open Vault status</div>
          <div className="mt-1 text-[12.5px] text-faint">{providerInfo.warning}</div>
        </div>
      </Link>

      <div className="mt-10 space-y-10">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-editorial text-[18px]">{section.title}</h2>
            <ul className="mt-3 divide-y hairline border-y hairline">
              {section.items.map((item) => (
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
        ))}

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
