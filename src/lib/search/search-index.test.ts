import { describe, expect, it } from "vitest";

import type { MizaanBlock, MizaanItem, VaultSnapshot } from "../vault/types";
import { createCalendarEventRecordInput } from "../calendar/calendar-event";
import { createFinanceRecordInput } from "../finance/finance-record";
import { createGoalRecordInput } from "../goals/goal-record";
import { createInteractionRecordInput } from "../people/interaction-record";
import { createPersonRecordInput } from "../people/person-record";
import { createProjectRecordInput } from "../projects/project-record";
import { createTaskRecordInput } from "../tasks/task-record";
import { createTrackerRecordInput } from "../trackers/tracker-record";
import { buildSearchResults, highlightMatches } from "./search-index";

function item(
  input: Partial<MizaanItem> & Pick<MizaanItem, "id" | "title" | "category" | "type">,
): MizaanItem {
  return {
    icon: "N",
    summary: "",
    status: "Active",
    tags: [],
    createdAt: "2026-05-31T00:00:00.000Z",
    updatedAt: "2026-05-31T00:00:00.000Z",
    properties: {},
    attachedFiles: [],
    metadata: {},
    ...input,
  };
}

function block(
  input: Partial<MizaanBlock> & Pick<MizaanBlock, "id" | "itemId" | "content">,
): MizaanBlock {
  return {
    type: "paragraph",
    order: 0,
    createdAt: "2026-05-31T00:00:00.000Z",
    updatedAt: "2026-05-31T00:00:00.000Z",
    ...input,
  };
}

function snapshot(items: MizaanItem[], blocks: MizaanBlock[] = []): VaultSnapshot {
  return {
    items,
    blocks,
    relations: [],
    providerInfo: {
      id: "test",
      name: "TestProvider",
      mode: "prototype-local",
      storageLabel: "test",
      warning: "test",
      capabilities: {
        itemCrud: true,
        blockCrud: true,
        relations: true,
        localStoragePrototype: true,
        portableFolder: false,
        sqlite: false,
        tauriFilesystem: false,
        markdownMirrors: false,
      },
    },
    health: {
      providerId: "test",
      itemCount: items.length,
      blockCount: blocks.length,
      relationCount: 0,
      archivedCount: 0,
      deletedCount: 0,
      portableVaultReady: false,
      sqliteReady: false,
      tauriReady: false,
      checkedAt: "2026-05-31T00:00:00.000Z",
      warnings: [],
    },
  };
}

describe("search index", () => {
  it(``, async () => {
    const data = snapshot(
      [
        item({ id: "note-1", title: "Lecture Notes", category: "notes", type: "note" }),
        item({ id: "project-1", title: "Project Plan", category: "projects", type: "project" }),
      ],
      [
        block({
          id: "block-1",
          itemId: "note-1",
          content: "Photosynthesis converts light into chemical energy.",
        }),
      ],
    );

    const results = buildSearchResults(data, { query: "chemical energy" });

    expect(results).toHaveLength(1);
    expect(results[0].item.id).toBe("note-1");
    expect(results[0].matchedFields).toContain("block");
    expect(results[0].snippet).toContain("chemical energy");
  });

  it(``, async () => {
    const data = snapshot([
      item({
        id: "old-note",
        title: "Budget note",
        category: "notes",
        type: "note",
        status: "Draft",
        tags: ["finance"],
        updatedAt: "2026-05-20T00:00:00.000Z",
      }),
      item({
        id: "new-finance",
        title: "Budget review",
        category: "finance",
        type: "finance",
        status: "Active",
        tags: ["finance"],
        updatedAt: "2026-05-31T00:00:00.000Z",
      }),
      item({
        id: "archived-finance",
        title: "Budget archive",
        category: "finance",
        type: "finance",
        status: "Active",
        tags: ["finance"],
        archivedAt: "2026-05-31T00:00:00.000Z",
      }),
    ]);

    const results = buildSearchResults(data, {
      query: "budget",
      categories: ["finance"],
      statuses: ["Active"],
      tags: ["finance"],
    });

    expect(results.map((result) => result.item.id)).toEqual(["new-finance"]);
  });

  it(``, async () => {
    const data = snapshot([
      item({
        id: "older",
        title: "Older",
        category: "notes",
        type: "note",
        updatedAt: "2026-05-20T00:00:00.000Z",
      }),
      item({
        id: "newer",
        title: "Newer",
        category: "projects",
        type: "project",
        updatedAt: "2026-05-31T00:00:00.000Z",
      }),
    ]);

    expect(buildSearchResults(data, { query: "" }).map((result) => result.item.id)).toEqual([
      "newer",
      "older",
    ]);
  });

  it(``, async () => {
    expect(highlightMatches("Mizaan design principles", "design")).toEqual([
      { text: "Mizaan ", match: false },
      { text: "design", match: true },
      { text: " principles", match: false },
    ]);
  });

  it(``, async () => {
    const projectInput = createProjectRecordInput({
      title: "Research Sprint",
      status: "active",
      priority: "urgent",
      area: "University",
    });
    const taskInput = createTaskRecordInput({
      title: "Literature Matrix",
      status: "blocked",
      priority: "medium",
      dueDate: "2026-06-30",
      projectId: "project-1",
    });
    const data = snapshot([
      item({
        id: "project-1",
        title: projectInput.title,
        category: projectInput.category,
        type: projectInput.type,
        status: projectInput.status,
        metadata: projectInput.metadata,
      }),
      item({
        id: "task-1",
        title: taskInput.title,
        category: taskInput.category,
        type: taskInput.type,
        status: taskInput.status,
        metadata: taskInput.metadata,
      }),
    ]);

    expect(
      buildSearchResults(data, { query: "University" }).map((result) => result.item.id),
    ).toEqual(["project-1"]);
    expect(
      buildSearchResults(data, { query: "2026-06-30" }).map((result) => result.item.id),
    ).toEqual(["task-1"]);
  });

  it(``, async () => {
    const personInput = createPersonRecordInput({
      displayName: "Ada Lovelace",
      relationshipType: "mentor",
      relationshipStatus: "follow-up",
      whereKnownFrom: "Research circle",
      organization: "Analytical Engine",
      context: "Mathematics and graph context",
    });
    const interactionInput = createInteractionRecordInput({
      title: "Call with Ada",
      type: "call",
      status: "follow-up-needed",
      personId: "person-1",
      interactionDate: "2026-06-02",
      summary: "Discussed analytical notes",
    });
    const data = snapshot([
      item({
        id: "person-1",
        title: personInput.title,
        category: personInput.category,
        type: personInput.type,
        status: personInput.status,
        metadata: personInput.metadata,
      }),
      item({
        id: "interaction-1",
        title: interactionInput.title,
        category: interactionInput.category,
        type: interactionInput.type,
        status: interactionInput.status,
        metadata: interactionInput.metadata,
      }),
    ]);

    expect(
      buildSearchResults(data, { query: "Research circle" }).map((result) => result.item.id),
    ).toEqual(["person-1"]);
    expect(
      buildSearchResults(data, { query: "2026-06-02" }).map((result) => result.item.id),
    ).toEqual(["interaction-1"]);
  });

  it(``, async () => {
    const financeInput = createFinanceRecordInput({
      title: "BrowserQA rent",
      kind: "transaction",
      transactionType: "expense",
      status: "pending",
      amount: "1500",
      currency: "MYR",
      transactionDate: "2026-06-02",
      category: "Housing",
      merchant: "Landlord",
      accountLabel: "Local wallet",
    });
    const data = snapshot([
      item({
        id: "finance-1",
        title: financeInput.title,
        category: financeInput.category,
        type: financeInput.type,
        status: financeInput.status,
        metadata: financeInput.metadata,
      }),
    ]);

    expect(buildSearchResults(data, { query: "Landlord" }).map((result) => result.item.id)).toEqual(
      ["finance-1"],
    );
    expect(buildSearchResults(data, { query: "1500" })[0]?.matchedFields).toContain("property");
    expect(
      buildSearchResults(data, { query: "2026-06-02" }).map((result) => result.item.id),
    ).toEqual(["finance-1"]);
  });

  it(``, async () => {
    const calendarInput = createCalendarEventRecordInput({
      title: "Library finance review",
      type: "finance",
      status: "confirmed",
      startDate: "2026-06-10",
      startTime: "08:30",
      location: "Campus library",
      notes: "Bring budget document",
    });
    const data = snapshot([
      item({
        id: "calendar-1",
        title: calendarInput.title,
        category: calendarInput.category,
        type: calendarInput.type,
        status: calendarInput.status,
        properties: calendarInput.properties,
        metadata: calendarInput.metadata,
      }),
    ]);

    expect(
      buildSearchResults(data, { query: "Campus library" }).map((result) => result.item.id),
    ).toEqual(["calendar-1"]);
    expect(
      buildSearchResults(data, { query: "2026-06-10" }).map((result) => result.item.id),
    ).toEqual(["calendar-1"]);
  });

  it(``, async () => {
    const trackerInput = createTrackerRecordInput({
      title: "Study minutes",
      type: "study",
      status: "active",
      frequency: "weekly",
      targetValue: "300",
      unit: "minutes",
      notes: "University revision tracker",
    });
    const goalInput = createGoalRecordInput({
      title: "Finish degree",
      status: "active",
      horizon: "long-term",
      targetDate: "2027-12-31",
      progressValue: "24",
      progressUnit: "credits",
      priority: "high",
      notes: "Graduation target",
    });
    const data = snapshot([
      item({
        id: "tracker-1",
        title: trackerInput.title,
        category: trackerInput.category,
        type: trackerInput.type,
        status: trackerInput.status,
        metadata: trackerInput.metadata,
      }),
      item({
        id: "goal-1",
        title: goalInput.title,
        category: goalInput.category,
        type: goalInput.type,
        status: goalInput.status,
        metadata: goalInput.metadata,
      }),
    ]);

    expect(
      buildSearchResults(data, { query: "University revision" }).map((result) => result.item.id),
    ).toEqual(["tracker-1"]);
    expect(
      buildSearchResults(data, { query: "2027-12-31" }).map((result) => result.item.id),
    ).toEqual(["goal-1"]);
    expect(buildSearchResults(data, { query: "credits" })[0]?.matchedFields).toContain("property");
  });
});

