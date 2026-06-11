import type { MizaanItem } from "@/lib/vault/types";

export interface TreeItem extends MizaanItem {
  children: TreeItem[];
}

export function buildSidebarTrees(items: MizaanItem[]): {
  pinnedTree: TreeItem[];
  pagesTree: TreeItem[];
} {
  const activeItems = items.filter(
    (item) =>
      item.category !== "templates" &&
      item.category !== "calendar" &&
      item.type !== "database-row" &&
      item.metadata.sidebarHidden !== true &&
      !item.archivedAt &&
      !item.deletedAt,
  );

  const sortSidebarItems = (a: TreeItem, b: TreeItem) => {
    const aPinned = a.metadata.sidebarPinned === true || a.metadata.pinned === true;
    const bPinned = b.metadata.sidebarPinned === true || b.metadata.pinned === true;

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    if (aPinned && bPinned) {
      const aOrder = a.metadata.sidebarOrder;
      const bOrder = b.metadata.sidebarOrder;
      if (aOrder !== undefined && bOrder !== undefined) {
        return (aOrder as number) - (bOrder as number);
      }
      if (aOrder !== undefined) return -1;
      if (bOrder !== undefined) return 1;

      const aPinnedAt = String(a.metadata.sidebarPinnedAt || a.metadata.pinnedAt || "");
      const bPinnedAt = String(b.metadata.sidebarPinnedAt || b.metadata.pinnedAt || "");
      if (aPinnedAt !== bPinnedAt) {
        return bPinnedAt.localeCompare(aPinnedAt);
      }
    }
    return b.updatedAt.localeCompare(a.updatedAt);
  };

  const getTreeItemChildren = (item: MizaanItem): TreeItem[] => {
    return activeItems
      .filter((child) => child.parentId === item.id)
      .map((child) => ({
        ...child,
        children: getTreeItemChildren(child),
      }))
      .sort(sortSidebarItems);
  };

  const pinnedTree: TreeItem[] = activeItems
    .filter((item) => item.metadata.sidebarPinned === true || item.metadata.pinned === true)
    .map((item) => ({
      ...item,
      children: getTreeItemChildren(item),
    }))
    .sort(sortSidebarItems);

  const pagesTree: TreeItem[] = activeItems
    .filter((item) => {
      const isPinned = item.metadata.sidebarPinned === true || item.metadata.pinned === true;
      if (isPinned) return false;

      const parentActive = item.parentId
        ? activeItems.some((parent) => parent.id === item.parentId)
        : false;
      return !parentActive;
    })
    .map((item) => ({
      ...item,
      children: getTreeItemChildren(item),
    }))
    .sort(sortSidebarItems);

  return { pinnedTree, pagesTree };
}

export function buildSidebarPageTree(items: MizaanItem[]): TreeItem[] {
  const { pinnedTree, pagesTree } = buildSidebarTrees(items);
  return [...pinnedTree, ...pagesTree];
}
