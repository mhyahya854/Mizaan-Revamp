import { getVaultProvider } from "./local-storage-vault-provider";
import type { VaultHealth, VaultProviderInfo } from "./types";

export interface VaultSession {
  vaultId: string;
  displayName: string;
  mode: "demo" | "prototype-local";
  providerId: string;
  storageLabel: string;
  createdAt: string;
  updatedAt: string;
}

export interface VaultLifecycleStatus {
  session: VaultSession;
  providerInfo: VaultProviderInfo;
  health: VaultHealth;
  recentVaults: VaultSession[];
}

const SESSION_KEY = "mizaan.prototype.vault.session.v1";
const RECENT_KEY = "mizaan.prototype.recentVaults.v1";

async function memorySession(): Promise<VaultSession> {
  const now = new Date().toISOString();
  return {
    vaultId: "prototype-local-vault",
    displayName: "Prototype Local Vault",
    mode: "prototype-local",
    providerId: (await getVaultProvider().getProviderInfo()).id,
    storageLabel: (await getVaultProvider().getProviderInfo()).storageLabel,
    createdAt: now,
    updatedAt: now,
  };
}

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

export async function getCurrentVaultSession(): Promise<VaultSession> {
  if (!canUseLocalStorage()) return await memorySession();

  const stored = window.localStorage.getItem(SESSION_KEY);
  if (stored) {
    try {
      return JSON.parse(stored) as VaultSession;
    } catch {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }

  const session = await memorySession();
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  recordRecentVault(session);
  return session;
}

export function recordRecentVault(session: VaultSession) {
  if (!canUseLocalStorage()) return;

  const existing = getRecentVaults();
  const next = [session, ...existing.filter((entry) => entry.vaultId !== session.vaultId)].slice(
    0,
    6,
  );
  window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
}

export function getRecentVaults(): VaultSession[] {
  if (!canUseLocalStorage()) return [];

  const stored = window.localStorage.getItem(RECENT_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as VaultSession[];
  } catch {
    window.localStorage.removeItem(RECENT_KEY);
    return [];
  }
}

export async function getVaultLifecycleStatus(): Promise<VaultLifecycleStatus> {
  const provider = getVaultProvider();
  const session = await getCurrentVaultSession();

  return {
    session,
    providerInfo: await provider.getProviderInfo(),
    health: await provider.getHealth(),
    recentVaults: getRecentVaults(),
  };
}
