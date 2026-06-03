import { describe, expect, it } from "vitest";

import { getModuleStatusCounts, isFutureOnlyStatus, productModules } from "./product-map";

describe("productModules", () => {
  it("defines every module with stable core fields", () => {
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

  it("does not contain duplicate module ids", () => {
    const ids = productModules.map((module) => module.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps future-only modules from exposing active routes", () => {
    const invalid = productModules.filter(
      (module) => isFutureOnlyStatus(module.status) && module.route,
    );

    expect(invalid).toEqual([]);
  });

  it("classifies implemented and partial modules separately", () => {
    const counts = getModuleStatusCounts(productModules);

    expect(counts.implemented).toBeGreaterThan(0);
    expect(counts.partial).toBeGreaterThan(0);
    expect(counts.blueprintOnly + counts.notStarted).toBeGreaterThan(0);
  });

  it("keeps forbidden provider and cloud claims out of module copy", () => {
    const text = productModules
      .map((module) => `${module.label} ${module.summary} ${module.futureReason ?? ""}`)
      .join(" ");

    expect(text).not.toMatch(/OAuth|Firebase|Supabase|Clerk|Google Drive|cloud sync/i);
  });

  it("marks platform storage and mobile work as future or not started", () => {
    expect(productModules.find((module) => module.id === "tauri")?.status).toBe("future-native");
    expect(productModules.find((module) => module.id === "sqlite")?.status).toBe("future-native");
    expect(productModules.find((module) => module.id === "portable-vault")?.status).toBe(
      "future-native",
    );
    expect(productModules.find((module) => module.id === "mobile-companion")?.status).toBe(
      "future-mobile",
    );
  });

  it("keeps calendar as a core module and documents as a workspace module", () => {
    expect(productModules.find((module) => module.id === "calendar")?.category).toBe("core");
    expect(productModules.find((module) => module.id === "documents")?.category).toBe("workspace");
  });

  it("keeps system tools grouped as system modules", () => {
    const systemIds = ["templates", "vault", "trash", "settings"];

    systemIds.forEach((id) => {
      expect(productModules.find((module) => module.id === id)?.category).toBe("system");
    });
  });

  it("reports browser archive hardening without claiming native backups", () => {
    const vault = productModules.find((module) => module.id === "vault");
    const backups = productModules.find((module) => module.id === "backups");
    const exportsModule = productModules.find((module) => module.id === "exports");

    expect(vault?.currentTruth).toContain("JSON archive export");
    expect(backups?.status).toBe("partial");
    expect(backups?.currentTruth).toContain("provider/localStorage archive JSON");
    expect(backups?.futureReason).toContain("Native backups");
    expect(exportsModule?.currentTruth).toContain("Browser archive JSON export exists");
  });
});
