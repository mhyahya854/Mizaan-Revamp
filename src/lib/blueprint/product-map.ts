export type ProductModuleCategory =
  | "core"
  | "workspace"
  | "system"
  | "future-system"
  | "native"
  | "mobile";

export type ProductModuleStatus =
  | "implemented"
  | "partial"
  | "blueprint-only"
  | "not-started"
  | "future-native"
  | "future-mobile"
  | "future-local-ai";

export interface ProductModule {
  id: string;
  label: string;
  category: ProductModuleCategory;
  status: ProductModuleStatus;
  route?: string;
  summary: string;
  currentTruth: string;
  futureReason?: string;
  nextPhase: string;
}

export const productModules: ProductModule[] = [
  {
    id: "home",
    label: "Home",
    category: "core",
    status: "partial",
    route: "/",
    summary: "Daily start, recent local pages, quick capture, and prototype vault truth.",
    currentTruth: "Route exists and uses the active provider snapshot.",
    nextPhase: "Improve after module foundations are stronger.",
  },
  {
    id: "search",
    label: "Search",
    category: "core",
    status: "partial",
    route: "/search",
    summary: "Provider-backed local search over titles, metadata, tags, properties, and blocks.",
    currentTruth:
      "Search helper and route exist; native indexes and extracted document text do not.",
    nextPhase: "Expand document metadata search after the Documents foundation.",
  },
  {
    id: "databases",
    label: "Databases",
    category: "core",
    status: "partial",
    route: "/databases",
    summary: "Basic local table database pages with real row, column, and cell editing.",
    currentTruth: "Core table operations persist in the browser prototype.",
    nextPhase: "Database views and filters.",
  },
  {
    id: "graph",
    label: "Graph",
    category: "core",
    status: "partial",
    route: "/graph",
    summary: "Relation-based graph foundation from provider items and relation records.",
    currentTruth: "Route renders real provider nodes and explicit relation edges only.",
    nextPhase: "Graph relation foundation.",
  },
  {
    id: "calendar",
    label: "Calendar",
    category: "core",
    status: "partial",
    route: "/calendar",
    summary: "Core local calendar module with prototype event records and multiple views.",
    currentTruth: "Calendar remains a core module, not a normal promoted page.",
    nextPhase: "Calendar completion.",
  },
  {
    id: "notes",
    label: "Notes",
    category: "workspace",
    status: "partial",
    route: "/notes",
    summary: "Page-based note space with provider-backed blocks and note templates.",
    currentTruth: "Basic note creation and editing exist; rich text is incomplete.",
    nextPhase: "Editor foundation.",
  },
  {
    id: "documents",
    label: "Documents",
    category: "workspace",
    status: "partial",
    route: "/documents",
    summary: "Document records are currently generic metadata pages, not real stored files.",
    currentTruth: "Route and template exist; dedicated document metadata model is next.",
    nextPhase: "Documents foundation.",
  },
  {
    id: "projects",
    label: "Projects",
    category: "workspace",
    status: "partial",
    route: "/projects",
    summary: "Provider-backed project records with linked local task records.",
    currentTruth:
      "Project metadata, creation, route/list UI, linked tasks, search metadata, graph edges, and templates are implemented for the browser prototype. Kanban, timelines, recurrence, reminders, and native scheduling are future.",
    nextPhase: "People foundation, then richer project views after relation targets mature.",
  },
  {
    id: "tasks",
    label: "Tasks",
    category: "workspace",
    status: "partial",
    summary: "Provider-backed task records linked to projects in the current local prototype.",
    currentTruth:
      "Task metadata, provider-backed creation, project-linked editing, task page metadata, search metadata, graph edges, and templates exist. No dedicated task route, recurrence engine, reminders, native notifications, or calendar scheduling exists.",
    futureReason:
      "A dedicated task workspace should wait until project, people, finance, and calendar relations are stronger.",
    nextPhase: "Route-level task workspace later.",
  },
  {
    id: "people",
    label: "People",
    category: "workspace",
    status: "partial",
    route: "/people",
    summary:
      "Provider-backed local person records with relationship metadata and linked interactions.",
    currentTruth:
      "Person metadata, person creation, People route/list UI, person detail metadata, interaction records, search metadata, graph edges, privacy metadata flags, and templates are implemented for the browser prototype. Contact import/sync, real privacy lock/encryption, hidden search/graph behavior, reminders, AI summaries, and full CRM timelines are future.",
    nextPhase: "Finance foundation.",
  },
  {
    id: "finance",
    label: "Finance",
    category: "workspace",
    status: "partial",
    route: "/finance",
    summary:
      "Provider-backed local finance records with typed transaction, budget, bill, subscription, and reimbursement metadata.",
    currentTruth:
      "Finance metadata, record creation, route/list UI, detail metadata panel, local summary totals, search metadata, graph edges, command-palette creation, and template defaults are implemented for the browser prototype. Bank sync/import, receipt OCR, tax/accounting systems, automated budgets, reminders, privacy enforcement, and native storage are future.",
    nextPhase: "Trackers/goals foundation.",
  },
  {
    id: "trackers",
    label: "Trackers",
    category: "workspace",
    status: "partial",
    route: "/trackers",
    summary: "Habit and progress tracker pages using the current page workspace.",
    currentTruth: "Generic tracker pages exist; check-in engine is future.",
    nextPhase: "Trackers/goals foundation.",
  },
  {
    id: "goals",
    label: "Goals",
    category: "workspace",
    status: "blueprint-only",
    summary: "Future goal system linking projects, trackers, calendar, and notes.",
    currentTruth: "No route or provider-backed goal model exists.",
    futureReason: "Goal records need a typed model and route before actions can be shown.",
    nextPhase: "Trackers/goals foundation.",
  },
  {
    id: "custom-pages",
    label: "Custom Pages",
    category: "workspace",
    status: "partial",
    route: "/notes",
    summary: "User-created pages and subpages inside the provider-backed workspace.",
    currentTruth: "Generic pages, blocks, parent links, and child creation exist.",
    nextPhase: "Page workspace hardening.",
  },
  {
    id: "templates",
    label: "Templates",
    category: "system",
    status: "partial",
    route: "/templates",
    summary: "Creation sources that produce real provider-backed prototype pages.",
    currentTruth: "Static template definitions exist; template editing does not.",
    nextPhase: "Templates expansion.",
  },
  {
    id: "vault",
    label: "Vault",
    category: "system",
    status: "partial",
    route: "/vault",
    summary: "Storage truth, provider identity, health counts, and prototype warnings.",
    currentTruth: "The current provider is a browser localStorage prototype.",
    nextPhase: "Backup/export/restore hardening.",
  },
  {
    id: "trash",
    label: "Trash",
    category: "system",
    status: "partial",
    route: "/trash",
    summary: "Soft-deleted local prototype items and recovery status.",
    currentTruth: "Restore can work for deleted records; permanent deletion policy is future.",
    nextPhase: "Repair/recovery center.",
  },
  {
    id: "settings",
    label: "Settings",
    category: "system",
    status: "partial",
    route: "/settings",
    summary: "Prototype app facts and safe preference controls.",
    currentTruth: "Theme controls and read-only storage facts exist.",
    nextPhase: "Settings hardening.",
  },
  {
    id: "blueprint",
    label: "Product Map",
    category: "system",
    status: "implemented",
    route: "/blueprint",
    summary: "Honest module map showing implemented, partial, planned, and future-only areas.",
    currentTruth: "This phase adds the route and product-map data tests.",
    nextPhase: "Keep updated during every bounded implementation phase.",
  },
  {
    id: "imports",
    label: "Imports",
    category: "future-system",
    status: "blueprint-only",
    summary: "Future safe import manager with preview and validation.",
    currentTruth: "No import manager route or working import flow exists.",
    futureReason: "Import work needs validation and non-destructive preview first.",
    nextPhase: "Import/export manager.",
  },
  {
    id: "exports",
    label: "Exports",
    category: "future-system",
    status: "blueprint-only",
    summary: "Future local export manager for readable formats and selected data.",
    currentTruth: "No export manager route or export manifest exists.",
    futureReason: "Export work needs scoped format and validation design.",
    nextPhase: "Import/export manager.",
  },
  {
    id: "backups",
    label: "Backups",
    category: "future-system",
    status: "blueprint-only",
    summary: "Future backup and restore manager with restore preview.",
    currentTruth: "No backup engine or restore preview exists.",
    futureReason: "Backups need manifest validation and safe restore rules.",
    nextPhase: "Backup/export/restore hardening.",
  },
  {
    id: "repair-center",
    label: "Repair Center",
    category: "future-system",
    status: "blueprint-only",
    summary: "Future inspect-and-repair surface for malformed local data.",
    currentTruth: "Only limited helper-level validation exists today.",
    futureReason: "A repair route needs issue registry, preview, and logs.",
    nextPhase: "Repair/recovery center.",
  },
  {
    id: "migration-center",
    label: "Migration Center",
    category: "future-system",
    status: "not-started",
    summary: "Future migration dry-run and schema transition surface.",
    currentTruth: "No migration manifest or migration UI exists.",
    futureReason: "Migrations need storage-provider architecture first.",
    nextPhase: "Native Windows readiness.",
  },
  {
    id: "privacy-lock",
    label: "Privacy/Lock",
    category: "future-system",
    status: "not-started",
    summary: "Future privacy mode, private pages, app lock, and search/graph hiding.",
    currentTruth: "No privacy metadata or lock behavior exists.",
    futureReason: "Privacy work needs a clear storage and index policy.",
    nextPhase: "Privacy/lock UX.",
  },
  {
    id: "plugin-manager",
    label: "Plugin Manager",
    category: "future-system",
    status: "not-started",
    summary: "Future extension surface that is deliberately out of scope.",
    currentTruth: "No plugin system exists.",
    futureReason: "Plugins are not safe before core local storage is complete.",
    nextPhase: "Do not implement until core app is mature.",
  },
  {
    id: "local-ai",
    label: "Local AI",
    category: "future-system",
    status: "future-local-ai",
    summary: "Future local-only OCR, similarity, and intelligence surface.",
    currentTruth: "No local model runtime, OCR, embeddings, or extracted text index exists.",
    futureReason: "Local AI must be optional and local-only after document storage exists.",
    nextPhase: "Local AI planning.",
  },
  {
    id: "release-update",
    label: "Release/Update Center",
    category: "future-system",
    status: "not-started",
    summary: "Future Windows release, installer, update, and version status surface.",
    currentTruth: "No native release system exists.",
    futureReason: "Release work needs native Windows app phases first.",
    nextPhase: "Final QA and release hardening.",
  },
  {
    id: "tauri",
    label: "Tauri Shell",
    category: "native",
    status: "future-native",
    summary: "Future Windows native shell and command boundary.",
    currentTruth: "The app is still a browser prototype.",
    futureReason: "Tauri shell must wait for native readiness work.",
    nextPhase: "Tauri shell.",
  },
  {
    id: "sqlite",
    label: "SQLite Provider",
    category: "native",
    status: "future-native",
    summary: "Future runtime database provider for structured local persistence.",
    currentTruth: "No SQLite provider, schema, or migrations exist.",
    futureReason: "SQLite belongs after the native shell boundary is in place.",
    nextPhase: "SQLite provider.",
  },
  {
    id: "portable-vault",
    label: "Portable Vault Folders",
    category: "native",
    status: "future-native",
    summary: "Future human-readable vault folder structure and lock-file workflow.",
    currentTruth: "No folder picker, lock file, or mirror writer exists.",
    futureReason: "Portable folders need native filesystem access and SQLite.",
    nextPhase: "Portable vault folders.",
  },
  {
    id: "native-filesystem",
    label: "Native Filesystem",
    category: "native",
    status: "future-native",
    summary: "Future native filesystem access for vault files and document imports.",
    currentTruth: "No Tauri filesystem commands exist.",
    futureReason: "Native filesystem work is blocked until Tauri is implemented.",
    nextPhase: "Native filesystem document import.",
  },
  {
    id: "mobile-companion",
    label: "Mobile Companion",
    category: "mobile",
    status: "future-mobile",
    summary: "Future Android/iOS companion workflow for capture and review.",
    currentTruth: "No mobile app or mobile sync workflow exists.",
    futureReason: "Mobile planning waits until the desktop vault architecture is real.",
    nextPhase: "Mobile companion planning.",
  },
];

export function isFutureOnlyStatus(status: ProductModuleStatus) {
  return (
    status === "blueprint-only" ||
    status === "not-started" ||
    status === "future-native" ||
    status === "future-mobile" ||
    status === "future-local-ai"
  );
}

export function getModuleStatusCounts(modules: ProductModule[] = productModules) {
  return modules.reduce(
    (counts, module) => {
      if (module.status === "implemented") counts.implemented += 1;
      if (module.status === "partial") counts.partial += 1;
      if (module.status === "blueprint-only") counts.blueprintOnly += 1;
      if (module.status === "not-started") counts.notStarted += 1;
      if (module.status === "future-native") counts.futureNative += 1;
      if (module.status === "future-mobile") counts.futureMobile += 1;
      if (module.status === "future-local-ai") counts.futureLocalAi += 1;
      return counts;
    },
    {
      implemented: 0,
      partial: 0,
      blueprintOnly: 0,
      notStarted: 0,
      futureNative: 0,
      futureMobile: 0,
      futureLocalAi: 0,
    },
  );
}

export function getLiveModules(modules: ProductModule[] = productModules) {
  return modules.filter((module) => Boolean(module.route) && !isFutureOnlyStatus(module.status));
}

export function getFutureModules(modules: ProductModule[] = productModules) {
  return modules.filter((module) => isFutureOnlyStatus(module.status));
}

export function getStatusLabel(status: ProductModuleStatus) {
  const labels: Record<ProductModuleStatus, string> = {
    implemented: "Implemented",
    partial: "Partial",
    "blueprint-only": "Blueprint only",
    "not-started": "Not started",
    "future-native": "Future native",
    "future-mobile": "Future mobile",
    "future-local-ai": "Future local AI",
  };
  return labels[status];
}

export function getCategoryLabel(category: ProductModuleCategory) {
  const labels: Record<ProductModuleCategory, string> = {
    core: "Core",
    workspace: "Workspace",
    system: "System",
    "future-system": "Future system",
    native: "Native",
    mobile: "Mobile",
  };
  return labels[category];
}
