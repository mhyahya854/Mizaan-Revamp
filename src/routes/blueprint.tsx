import { createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  CircleDashed,
  Clock,
  MonitorCog,
} from "lucide-react";

import {
  getCategoryLabel,
  getFutureModules,
  getLiveModules,
  getModuleStatusCounts,
  getStatusLabel,
  isFutureOnlyStatus,
  productModules,
  type ProductModule,
  type ProductModuleCategory,
  type ProductModuleStatus,
} from "@/lib/blueprint/product-map";

export const Route = createFileRoute("/blueprint")({
  head: () => ({
    meta: [
      { title: "Product Map - Mizaan" },
      {
        name: "description",
        content: "Honest Mizaan product blueprint and module implementation status map.",
      },
    ],
  }),
  component: BlueprintPage,
});

function BlueprintPage() {
  const counts = getModuleStatusCounts();
  const liveModules = getLiveModules();
  const futureModules = getFutureModules();
  const categories: ProductModuleCategory[] = [
    "core",
    "workspace",
    "system",
    "future-system",
    "native",
    "mobile",
  ];

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 pb-24 pt-12 md:px-10">
      <header className="max-w-3xl">
        <p className="text-[12px] uppercase tracking-wider text-faint">Blueprint baseline</p>
        <h1 className="mt-1 font-editorial text-[38px] leading-tight tracking-normal">
          Product Map
        </h1>
        <p className="mt-2 text-[14px] leading-relaxed text-soft">
          This is a status map for the full Mizaan product. It shows what works in the current
          browser/localStorage prototype, what is partial, and what remains blueprint-only or future
          native/mobile work. A visible module here is not a claim that the feature is complete.
        </p>
      </header>

      <section className="mt-8 rounded-md border hairline bg-surface p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-medium">
              <AlertTriangle className="h-4 w-4 text-faint" />
              Current prototype truth
            </div>
            <p className="mt-1 max-w-2xl text-[12.5px] text-faint">
              The app remains a browser localStorage prototype. Browser archive
              export/validation/restore preview is implemented for current provider data only.
              Tauri, SQLite, portable vault folders, native filesystem document import, mobile apps,
              OCR, encryption, and full native backup/restore are not implemented.
            </p>
          </div>
          <a
            href="/vault"
            className="rounded-sm border hairline px-2.5 py-1.5 text-[12px] text-soft hover:bg-muted"
          >
            Open vault truth
          </a>
        </div>
      </section>

      <section className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatusStat
          label="Implemented"
          value={counts.implemented}
          Icon={CheckCircle2}
          note="Scoped, verified slices only"
        />
        <StatusStat
          label="Partial"
          value={counts.partial}
          Icon={CircleDashed}
          note="Usable foundations, not final systems"
        />
        <StatusStat
          label="Blueprint only"
          value={counts.blueprintOnly + counts.notStarted}
          Icon={Clock}
          note="Planned but not working"
        />
        <StatusStat
          label="Future platform"
          value={counts.futureNative + counts.futureMobile + counts.futureLocalAi}
          Icon={MonitorCog}
          note="Native, mobile, or local AI later"
        />
      </section>

      <section className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-editorial text-[24px] tracking-normal">Live prototype routes</h2>
            <p className="mt-1 text-[12.5px] text-faint">
              These modules have an active route today. Their status may still be partial.
            </p>
          </div>
          <span className="text-[12px] text-faint">{liveModules.length} routed modules</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {liveModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-editorial text-[24px] tracking-normal">Planned and future work</h2>
            <p className="mt-1 text-[12.5px] text-faint">
              These modules are shown for planning visibility only. They do not expose fake working
              actions.
            </p>
          </div>
          <span className="text-[12px] text-faint">{futureModules.length} future modules</span>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {futureModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-editorial text-[24px] tracking-normal">Module matrix</h2>
        <div className="mt-4 overflow-hidden rounded-md border hairline">
          <table className="w-full border-collapse text-[12.5px]">
            <thead className="bg-surface-muted text-[10.5px] uppercase tracking-wider text-faint">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Module</th>
                <th className="hidden px-3 py-2 text-left font-medium md:table-cell">Category</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="hidden px-3 py-2 text-left font-medium lg:table-cell">Next</th>
                <th className="px-3 py-2 text-right font-medium">Route</th>
              </tr>
            </thead>
            <tbody>
              {productModules.map((module) => (
                <tr key={module.id} className="border-t hairline">
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-foreground">{module.label}</div>
                    <div className="mt-0.5 max-w-[460px] text-[11.5px] text-faint">
                      {module.currentTruth}
                    </div>
                  </td>
                  <td className="hidden px-3 py-2.5 text-soft md:table-cell">
                    {getCategoryLabel(module.category)}
                  </td>
                  <td className="px-3 py-2.5">
                    <StatusBadge status={module.status} />
                  </td>
                  <td className="hidden px-3 py-2.5 text-faint lg:table-cell">
                    {module.nextPhase}
                  </td>
                  <td className="px-3 py-2.5 text-right">
                    {module.route && !isFutureOnlyStatus(module.status) ? (
                      <a href={module.route} className="text-soft hover:text-foreground">
                        Open
                      </a>
                    ) : (
                      <span className="text-faint">Future</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12">
        <h2 className="font-editorial text-[24px] tracking-normal">Roadmap categories</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const modules = productModules.filter((module) => module.category === category);
            return (
              <div key={category} className="rounded-md border hairline bg-surface p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[14px] font-medium">{getCategoryLabel(category)}</h3>
                  <span className="text-[11px] text-faint">{modules.length} modules</span>
                </div>
                <ul className="mt-3 space-y-2">
                  {modules.map((module) => (
                    <li key={module.id} className="flex items-center justify-between gap-3">
                      <span className="truncate text-[12.5px] text-soft">{module.label}</span>
                      <StatusBadge status={module.status} compact />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function StatusStat({
  label,
  value,
  note,
  Icon,
}: {
  label: string;
  value: number;
  note: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-md border hairline bg-surface p-3">
      <div className="flex items-center gap-2 text-[12px] text-soft">
        <Icon className="h-3.5 w-3.5 text-faint" />
        {label}
      </div>
      <div className="mt-2 font-mono text-[24px] text-foreground">{value}</div>
      <p className="mt-1 text-[11.5px] text-faint">{note}</p>
    </div>
  );
}

function ModuleCard({ module }: { module: ProductModule }) {
  const futureOnly = isFutureOnlyStatus(module.status);
  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10.5px] uppercase tracking-wider text-faint">
            {getCategoryLabel(module.category)}
          </p>
          <h3 className="mt-1 text-[15px] font-medium text-foreground">{module.label}</h3>
        </div>
        <StatusBadge status={module.status} />
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-soft">{module.summary}</p>
      <p className="mt-3 text-[11.5px] leading-relaxed text-faint">{module.currentTruth}</p>
      {futureOnly ? (
        <div className="mt-4 rounded-sm border border-dashed hairline px-2.5 py-2 text-[11.5px] text-faint">
          {module.futureReason ?? "This module is planned, but no active action exists yet."}
        </div>
      ) : (
        module.route && (
          <a
            href={module.route}
            className="mt-4 inline-flex items-center gap-1.5 rounded-sm border hairline px-2.5 py-1.5 text-[12px] text-soft hover:bg-muted hover:text-foreground"
          >
            Open route
            <ArrowUpRight className="h-3 w-3" />
          </a>
        )
      )}
      <div className="mt-4 border-t hairline pt-2 text-[11.5px] text-faint">
        Next: {module.nextPhase}
      </div>
    </article>
  );
}

function StatusBadge({
  status,
  compact = false,
}: {
  status: ProductModuleStatus;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium ${statusClass(
        status,
      )} ${compact ? "max-w-[120px] truncate" : ""}`}
      title={getStatusLabel(status)}
    >
      {getStatusLabel(status)}
    </span>
  );
}

function statusClass(status: ProductModuleStatus) {
  if (status === "implemented") return "border-emerald-500/25 bg-emerald-500/10 text-emerald-700";
  if (status === "partial") return "border-amber-500/25 bg-amber-500/10 text-amber-700";
  if (status === "blueprint-only") return "border-sky-500/25 bg-sky-500/10 text-sky-700";
  if (status === "future-native") return "border-violet-500/25 bg-violet-500/10 text-violet-700";
  if (status === "future-mobile") return "border-indigo-500/25 bg-indigo-500/10 text-indigo-700";
  if (status === "future-local-ai") return "border-teal-500/25 bg-teal-500/10 text-teal-700";
  return "border-muted bg-muted text-soft";
}
