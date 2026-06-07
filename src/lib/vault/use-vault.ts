import { useEffect, useState } from "react";

import { getVaultProvider } from "./local-storage-vault-provider";
import { getVaultLifecycleStatus, type VaultLifecycleStatus } from "./vault-session";
import type { VaultSnapshot } from "./types";

const HYDRATION_CHECKED_AT = "pending-client-hydration";

function createHydrationSnapshot(): VaultSnapshot {
  return {
    items: [],
    blocks: [],
    relations: [],
    providerInfo: {
      id: "loading",
      name: "Loading...",
      mode: "prototype-local",
      storageLabel: "Loading...",
      warning: "Loading...",
      capabilities: {
        itemCrud: false,
        blockCrud: false,
        relations: false,
        localStoragePrototype: false,
        portableFolder: false,
        sqlite: false,
        tauriFilesystem: false,
        markdownMirrors: false,
      },
    },
    health: {
      providerId: "loading",
      itemCount: 0,
      blockCount: 0,
      relationCount: 0,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: HYDRATION_CHECKED_AT,
      warnings: [
        "Prototype browser storage is loading. Portable folder, SQLite, Tauri, and lock files are not active.",
      ],
    },
  };
}

function createHydrationLifecycleStatus(): VaultLifecycleStatus {
  const snapshot = createHydrationSnapshot();
  return {
    session: {
      vaultId: "prototype-local-vault",
      displayName: "Prototype Local Vault",
      mode: "prototype-local",
      providerId: snapshot.providerInfo.id,
      storageLabel: snapshot.providerInfo.storageLabel,
      createdAt: HYDRATION_CHECKED_AT,
      updatedAt: HYDRATION_CHECKED_AT,
    },
    providerInfo: snapshot.providerInfo,
    health: snapshot.health,
    recentVaults: [],
  };
}

export function useVaultProvider() {
  return getVaultProvider();
}

export function useVaultSnapshot() {
  const provider = getVaultProvider();
  const [snapshot, setSnapshot] = useState<VaultSnapshot>(() => createHydrationSnapshot());

  useEffect(() => {
    let active = true;
    const update = async () => {
      const snap = await provider.getSnapshot();
      if (active) setSnapshot(snap);
    };
    update();
    return provider.subscribe(update);
  }, [provider]);

  return snapshot;
}

export function useVaultLifecycleStatus() {
  const snapshot = useVaultSnapshot();
  const [status, setStatus] = useState<VaultLifecycleStatus>(() =>
    createHydrationLifecycleStatus(),
  );

  useEffect(() => {
    let active = true;
    const update = async () => {
      const stat = await getVaultLifecycleStatus();
      if (active) setStatus(stat);
    };
    update();
    return () => {
      active = false;
    };
  }, [
    snapshot.health.itemCount,
    snapshot.health.blockCount,
    snapshot.health.relationCount,
    snapshot.health.archivedCount,
    snapshot.health.deletedCount,
    snapshot.health.checkedAt,
  ]);

  return status;
}

export function isVaultSnapshotHydrating(snapshot: VaultSnapshot) {
  return snapshot.health.checkedAt === HYDRATION_CHECKED_AT;
}
