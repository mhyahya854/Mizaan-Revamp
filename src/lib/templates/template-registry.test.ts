import { describe, expect, it } from "vitest";

import {
  COMMAND_PALETTE_TEMPLATE_IDS,
  createItemFromTemplate,
  getAllTemplates,
  getFutureTemplates,
  getImplementedTemplates,
  getTemplateById,
  getTemplateCategoryCounts,
  getTemplatePreview,
  getTemplateSearchText,
  getTemplateStatusCounts,
  getTemplatesByCategory,
  validateTemplateDefinition,
} from "./template-registry";
import { normalizeCalendarEventMetadata } from "../calendar/calendar-event";
import { normalizeDocumentMetadata } from "../documents/document-record";
import { normalizeFinanceMetadata } from "../finance/finance-record";
import { normalizeGoalMetadata } from "../goals/goal-record";
import { normalizeInteractionMetadata } from "../people/interaction-record";
import { normalizePersonMetadata } from "../people/person-record";
import { normalizeProjectMetadata } from "../projects/project-record";
import { normalizeTaskMetadata } from "../tasks/task-record";
import { normalizeTrackerMetadata } from "../trackers/tracker-record";
import {
  LocalStorageVaultProvider,
  createMemoryStorage,
} from "../vault/local-storage-vault-provider";
import type { BlockType, ItemCategory, MizaanItem } from "../vault/types";

function createProvider() {
  let sequence = 0;
  return new LocalStorageVaultProvider({
    storage: createMemoryStorage(),
    now: () => "2026-06-05T00:00:00.000Z",
    idFactory: (prefix) => `${prefix}-${++sequence}`,
    seedOnEmpty: false,
  });
}

const safeBlockTypes = new Set<BlockType>([
  "paragraph",
  "heading1",
  "heading2",
  "heading3",
  "bullet",
  "numbered",
  "todo",
  "quote",
  "callout",
  "divider",
  "code",
  "table",
]);

describe("template registry", () => {
  it(``, async () => {
    const templates = getAllTemplates();
    const ids = templates.map((template) => template.id);

    expect(templates.length).toBeGreaterThanOrEqual(40);
    expect(new Set(ids).size).toBe(ids.length);

    for (const template of templates) {
      expect(template.id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(template.name.trim()).toBeTruthy();
      expect(template.title.trim()).toBeTruthy();
      expect(template.category).toBeTruthy();
      expect(template.status).toMatch(/^(implemented|partial|future)$/);
      expect(template.targetItemType).toBeTruthy();
      expect(validateTemplateDefinition(template)).toEqual([]);
    }
  });

  it(``, async () => {
    const counts = getTemplateStatusCounts();

    expect(counts.implemented).toBeGreaterThanOrEqual(35);
    expect(counts.partial).toBeGreaterThan(0);
    expect(counts.future).toBeGreaterThan(0);
    expect(counts.total).toBe(getAllTemplates().length);
    expect(getImplementedTemplates()).toHaveLength(counts.implemented);
    expect(getFutureTemplates()).toHaveLength(counts.future);
  });

  it(``, async () => {
    const notes = getTemplatesByCategory("notes");
    const finance = getTemplatesByCategory("finance");
    const searchText = getTemplateSearchText(getTemplateById("meeting-note")!);

    expect(notes.map((template) => template.id)).toContain("daily-note");
    expect(notes.map((template) => template.id)).toContain("research-note");
    expect(finance.map((template) => template.id)).toContain("subscription-record");
    expect(finance.map((template) => template.id)).toContain("budget-record");
    expect(searchText).toContain("meeting");
    expect(searchText).toContain("decisions");

    const categoryCounts = getTemplateCategoryCounts();
    expect(categoryCounts.notes).toBeGreaterThanOrEqual(7);
    expect(categoryCounts.finance).toBeGreaterThanOrEqual(8);
    expect(categoryCounts.calendar).toBeGreaterThanOrEqual(5);
  });

  it(``, async () => {
    const provider = createProvider();

    for (const template of getImplementedTemplates()) {
      const item = await createItemFromTemplate(provider, template.id);
      const blocks = await provider.getBlocks(item?.id);

      expect(item?.id).toMatch(/^item-/);
      expect(item.category).toBe(template.universal ? item.category : template.category);
      expect(item.type).toBe(template.universal ? item.type : template.type);
      expect(item.metadata.templateId).toBe(template.id);
      expect((await provider.getItem(item?.id))?.id).toBe(item?.id);
      expect(blocks.every((block) => safeBlockTypes.has(block.type))).toBe(true);
    }
  });

  it(``, async () => {
    const provider = createProvider();

    const document = await createItemFromTemplate(provider, "receipt-document-record");
    expect(normalizeDocumentMetadata(document.metadata).documentKind).toBe("receipt");

    const project = await createItemFromTemplate(provider, "study-project");
    expect(normalizeProjectMetadata(project.metadata).projectArea).toBe("Study");

    const task = await createItemFromTemplate(provider, "project-task");
    expect(normalizeTaskMetadata(task.metadata).taskStatus).toBe("todo");

    const person = await createItemFromTemplate(provider, "person-profile");
    expect(normalizePersonMetadata(person.metadata).displayName).toBe(person.title);

    const interaction = await createItemFromTemplate(provider, "interaction-log");
    expect(normalizeInteractionMetadata(interaction.metadata).interactionStatus).toBe("logged");

    const finance = await createItemFromTemplate(provider, "bill-record");
    expect(normalizeFinanceMetadata(finance.metadata).financeKind).toBe("bill");

    const tracker = await createItemFromTemplate(provider, "reading-tracker");
    expect(normalizeTrackerMetadata(tracker.metadata).trackerType).toBe("reading");

    const goal = await createItemFromTemplate(provider, "long-term-goal");
    expect(normalizeGoalMetadata(goal.metadata).goalHorizon).toBe("long-term");

    const calendar = await createItemFromTemplate(provider, "calendar-appointment");
    expect(normalizeCalendarEventMetadata(calendar.metadata).eventType).toBe("appointment");
  });

  it(``, async () => {
    const provider = createProvider();
    const simpleTable = await createItemFromTemplate(provider, "simple-table-page");
    const readingList = await createItemFromTemplate(provider, "reading-list-table");
    const financeLedger = await createItemFromTemplate(provider, "finance-ledger-table");

    expect((await provider.getBlocks(simpleTable.id)).some((block) => block.type === "table")).toBe(
      true,
    );
    expect(readingList.category).toBe("databases");
    expect(readingList.metadata.database).toBeDefined();
    expect(financeLedger.category).toBe("databases");
    expect(financeLedger.metadata.database).toBeDefined();
    expect(String(financeLedger.summary).toLowerCase()).not.toContain("bank sync");
  });

  it(``, async () => {
    const provider = createProvider();

    await expect(createItemFromTemplate(provider, "missing-template")).rejects.toThrow(/unknown/i);
    await expect(createItemFromTemplate(provider, "custom-template-builder")).rejects.toThrow(
      /not implemented/i,
    );
    await expect(createItemFromTemplate(provider, "page-system-template")).rejects.toThrow(
      /not implemented/i,
    );
  });

  it(``, async () => {
    const provider = createProvider();
    const beforeCount = (await provider.getSnapshot())?.items.length;
    const preview = getTemplatePreview("expense-record");

    expect(preview.id).toBe("expense-record");
    expect(preview.status).toBe("implemented");
    expect(preview.category).toBe("finance");
    expect(preview.targetItemType).toBe("finance");
    expect(preview.metadata.financeKind).toBe("transaction");
    expect(preview.metadata.transactionType).toBe("expense");
    expect(preview.blockCount).toBeGreaterThan(0);
    expect(preview.canCreate).toBe(true);
    expect(await (await provider.getSnapshot())?.items.length).toBe(beforeCount);
  });

  it(``, async () => {
    for (const templateId of COMMAND_PALETTE_TEMPLATE_IDS) {
      expect(getTemplateById(templateId)?.status).toBe("implemented");
    }
  });

  it(``, async () => {
    const forbiddenTrueKeys = [
      "aiGenerated",
      "cloudSynced",
      "marketplace",
      "templateSync",
      "nativeFilesystem",
      "nativeImport",
      "bankSynced",
      "accountingGrade",
      "reminderEngine",
      "nativeNotifications",
      "recurrenceEngine",
    ];

    for (const template of getImplementedTemplates()) {
      for (const key of forbiddenTrueKeys) {
        expect(template.metadata?.[key], `${template.id}.${key}`).not.toBe(true);
      }
    }
  });

  it(``, async () => {
    const seen = new Set<string>();

    for (const template of getAllTemplates()) {
      const key = `${template.category}:${template.name.toLowerCase()}`;
      expect(seen.has(key), key).toBe(false);
      seen.add(key);
    }
  });

  it(``, async () => {
    const provider = createProvider();
    const created: Record<string, MizaanItem> = {};

    for (const [category, templateId] of Object.entries({
      documents: "receipt-document-record",
      projects: "project-plan",
      tasks: "task-record",
      people: "person-profile",
      finance: "expense-record",
      calendar: "calendar-event",
      trackers: "habit-tracker",
      goals: "goal-plan",
    }) as Array<[ItemCategory, string]>) {
      created[category] = await createItemFromTemplate(provider, templateId);
    }

    expect(normalizeDocumentMetadata(created.documents.metadata).linkedFinanceIds).toEqual([]);
    expect(normalizeProjectMetadata(created.projects.metadata).linkedTaskIds).toEqual([]);
    expect(normalizeTaskMetadata(created.tasks.metadata).linkedCalendarEventIds).toEqual([]);
    expect(normalizePersonMetadata(created.people.metadata).linkedGoalIds).toEqual([]);
    expect(normalizeFinanceMetadata(created.finance.metadata).linkedDocumentIds).toEqual([]);
    expect(normalizeCalendarEventMetadata(created.calendar.metadata).linkedProjectIds).toEqual([]);
    expect(normalizeTrackerMetadata(created.trackers.metadata).linkedFinanceIds).toEqual([]);
    expect(normalizeGoalMetadata(created.goals.metadata).linkedTrackerIds).toEqual([]);
  });

  it(``, async () => {
    const provider = createProvider();

    const calendar = await createItemFromTemplate(provider, "calendar-appointment", {
      title: "Dentist Appointment",
    });
    const finance = await createItemFromTemplate(provider, "expense-record", {
      title: "Conference Travel Expense",
    });

    expect(calendar.title).toBe("Dentist Appointment");
    expect(normalizeCalendarEventMetadata(calendar.metadata).eventTitle).toBe(
      "Dentist Appointment",
    );
    expect(finance.title).toBe("Conference Travel Expense");
    expect(normalizeFinanceMetadata(finance.metadata).financeTitle).toBe(
      "Conference Travel Expense",
    );
  });
});
