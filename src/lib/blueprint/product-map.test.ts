import { describe, expect, it } from "vitest";

import { getModuleStatusCounts, isFutureOnlyStatus, productModules } from "./product-map";

describe("productModules", () => {
  it(``, async () => {
    expect(productModules.length).toBeGreaterThanOrEqual(24);

    productModules.forEach((module) => {
      expect(module.id).toMatch(/^[a-z0-9-]+$/);
      expect(module.label.trim()).toBe(module.label);
      expect(module.label.length).toBeGreaterThan(1);
      expect(module.status).toBeTruthy();
      expect(module.category).toBeTruthy();
      expect(module.summary.length).toBeGreaterThan(10);
      expect(module.nextPhase.length).toBeGreaterThan(4);
      expect(module.route || module.futureReason).toBeTruthy();
    });
  });

  it(``, async () => {
    const ids = productModules.map((module) => module.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it(``, async () => {
    const invalid = productModules.filter(
      (module) => isFutureOnlyStatus(module.status) && module.route,
    );

    expect(invalid).toEqual([]);
  });

  it(``, async () => {
    const counts = getModuleStatusCounts(productModules);

    expect(counts.implemented).toBeGreaterThan(0);
    expect(counts.partial).toBeGreaterThan(0);
    expect(counts.blueprintOnly + counts.notStarted).toBeGreaterThan(0);
  });

  it(``, async () => {
    const text = productModules
      .map((module) => `${module.label} ${module.summary} ${module.futureReason ?? ""}`)
      .join(" ");

    expect(text).not.toMatch(/OAuth|Firebase|Supabase|Clerk|Google Drive|cloud sync/i);
  });

  it(``, async () => {
    expect(productModules.find((module) => module.id === "tauri")?.status).toBe("future-native");
    expect(productModules.find((module) => module.id === "sqlite")?.status).toBe("future-native");
    expect(productModules.find((module) => module.id === "portable-vault")?.status).toBe(
      "future-native",
    );
    expect(productModules.find((module) => module.id === "mobile-companion")?.status).toBe(
      "future-mobile",
    );
  });

  it(``, async () => {
    expect(productModules.find((module) => module.id === "calendar")?.category).toBe("core");
    expect(productModules.find((module) => module.id === "documents")?.category).toBe("workspace");
  });

  it(``, async () => {
    const systemIds = [
      "templates",
      "vault",
      "imports",
      "exports",
      "repair-center",
      "trash",
      "settings",
    ];

    systemIds.forEach((id) => {
      expect(productModules.find((module) => module.id === id)?.category).toBe("system");
    });
  });

  it(``, async () => {
    const vault = productModules.find((module) => module.id === "vault");
    const backups = productModules.find((module) => module.id === "backups");
    const exportsModule = productModules.find((module) => module.id === "exports");

    expect(vault?.currentTruth).toContain("JSON archive export");
    expect(backups?.status).toBe("partial");
    expect(backups?.currentTruth).toContain("provider/localStorage archive JSON");
    expect(backups?.futureReason).toContain("Native backups");
    expect(exportsModule?.route).toBe("/import-export");
    expect(exportsModule?.currentTruth).toContain("Browser archive JSON export exists");
  });

  it(``, async () => {
    const imports = productModules.find((module) => module.id === "imports");
    const repair = productModules.find((module) => module.id === "repair-center");

    expect(imports?.status).toBe("partial");
    expect(imports?.route).toBe("/import-export");
    expect(imports?.currentTruth).toContain("browser archive JSON only");
    expect(imports?.currentTruth).toContain("not implemented");

    expect(repair?.status).toBe("partial");
    expect(repair?.route).toBe("/repair");
    expect(repair?.currentTruth).toContain("metadata-reference checks");
    expect(repair?.currentTruth).toContain("not implemented");
  });

  it(``, async () => {
    const trackers = productModules.find((module) => module.id === "trackers");
    const goals = productModules.find((module) => module.id === "goals");

    expect(trackers?.status).toBe("partial");
    expect(trackers?.route).toBe("/trackers");
    expect(trackers?.currentTruth).toContain("typed tracker metadata");
    expect(trackers?.currentTruth).toContain("native notifications");
    expect(trackers?.currentTruth).toContain("future");

    expect(goals?.status).toBe("partial");
    expect(goals?.route).toBe("/goals");
    expect(goals?.currentTruth).toContain("typed goal metadata");
    expect(goals?.currentTruth).toContain("cloud sync");
    expect(goals?.currentTruth).toContain("future");
  });

  it(``, async () => {
    const tasks = productModules.find((module) => module.id === "tasks");

    expect(tasks?.status).toBe("partial");
    expect(tasks?.route).toBe("/tasks");
    expect(tasks?.currentTruth).toContain("dedicated Tasks route");
    expect(tasks?.currentTruth).toContain("recurrence engine");
    expect(tasks?.currentTruth).toContain("future");
  });
});
