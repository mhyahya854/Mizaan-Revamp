import { createPageFromTemplate as createWorkspacePageFromTemplate } from "../page/page-workspace";
import {
  createDefaultCalendarEventMetadata,
  type CalendarEventStatus,
  type CalendarEventType,
} from "../calendar/calendar-event";
import { createDefaultDatabaseModel, toDatabaseMetadata } from "../database/database-table";
import {
  createDefaultDocumentMetadata,
  updateDocumentMetadata,
} from "../documents/document-record";
import { createDefaultFinanceMetadata, updateFinanceMetadata } from "../finance/finance-record";
import { createDefaultGoalMetadata, updateGoalMetadata } from "../goals/goal-record";
import {
  createDefaultInteractionMetadata,
  updateInteractionMetadata,
} from "../people/interaction-record";
import { createDefaultPersonMetadata, updatePersonMetadata } from "../people/person-record";
import { createDefaultProjectMetadata, updateProjectMetadata } from "../projects/project-record";
import { createDefaultTaskMetadata, updateTaskMetadata } from "../tasks/task-record";
import { createDefaultTableData, serializeTableData } from "../table/simple-table";
import { createDefaultTrackerMetadata, updateTrackerMetadata } from "../trackers/tracker-record";
import type {
  CreateBlockInput,
  ItemCategory,
  ItemType,
  MizaanItem,
  PropertyValue,
  VaultProvider,
} from "../vault/types";
import { getImplementedTemplates as getWorkspaceTemplates } from "../page/page-workspace";

export type TemplateStatus = "implemented" | "partial" | "future";
export type TemplateCategory = ItemCategory;

export interface TemplateDefinition {
  id: string;
  name: string;
  icon: string;
  category: TemplateCategory;
  type: ItemType;
  title: string;
  summary: string;
  description: string;
  status: TemplateStatus;
  targetItemType: ItemType;
  tags: string[];
  properties: Record<string, PropertyValue>;
  metadata?: Record<string, PropertyValue>;
  blocks: CreateBlockInput[];
  universal?: boolean;
  limitations: string[];
}

export interface TemplatePreview {
  id: string;
  name: string;
  title: string;
  category: TemplateCategory;
  status: TemplateStatus;
  targetItemType: ItemType;
  description: string;
  summary: string;
  tags: string[];
  properties: Record<string, PropertyValue>;
  metadata: Record<string, PropertyValue>;
  limitations: string[];
  blockCount: number;
  canCreate: boolean;
}

export const COMMAND_PALETTE_TEMPLATE_IDS = [
  "blank-page",
  "blank-note",
  "daily-note",
  "quick-capture",
  "journal-page",
  "project-plan",
  "task-record",
  "document-record",
  "person-profile",
  "interaction-log",
  "finance-record",
  "calendar-event",
  "tracker",
  "goal",
  "basic-database",
  "simple-table-page",
] as const;

const SAFE_BLOCK_TYPES = new Set([
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
] satisfies CreateBlockInput["type"][]);

const EXTRA_IMPLEMENTED_TEMPLATES: TemplateDefinition[] = [
  {
    id: "certificate-document-record",
    name: "Certificate Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Certificate - Untitled",
    summary: "Metadata-only certificate record.",
    description: "A provider-backed local document record for certificates and credentials.",
    status: "implemented",
    targetItemType: "document",
    tags: ["document", "certificate"],
    properties: {
      status: "Metadata-only",
      documentKind: "Certificate",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Certificate - Untitled",
      documentKind: "certificate",
      tags: ["document", "certificate"],
    }),
    blocks: [
      { type: "heading1", content: "Certificate summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This record stores metadata only. Native file storage and preview remain future work.",
      },
    ],
    limitations: [
      "No file import, preview, OCR, thumbnail, or native file storage is implemented.",
    ],
  },
  {
    id: "project-task",
    name: "Project Task",
    icon: "T",
    category: "tasks",
    type: "task",
    title: "Project Task - Untitled",
    summary: "Task metadata record ready to link to a project.",
    description: "A provider-backed task item with normalized task metadata defaults.",
    status: "implemented",
    targetItemType: "task",
    tags: ["task", "project"],
    properties: { status: "Todo", priority: "Medium", projectId: "" },
    metadata: createDefaultTaskMetadata({
      taskTitle: "Project Task - Untitled",
      taskStatus: "todo",
      taskPriority: "medium",
      tags: ["task", "project"],
    }),
    blocks: [
      { type: "heading1", content: "Task notes" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a task record. Recurrence metadata is available; generated repeats, reminders, and notifications are future work.",
      },
    ],
    limitations: [
      "No recurrence generation, reminders, native notifications, or task scheduling engine is implemented.",
    ],
  },
  {
    id: "project-milestone-note",
    name: "Project Milestone Note",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Project Milestone - Untitled",
    summary: "Milestone-focused project record.",
    description: "A project metadata record shaped for a milestone checkpoint.",
    status: "implemented",
    targetItemType: "project",
    tags: ["project", "milestone"],
    properties: { status: "Planning", priority: "Medium", area: "Milestone" },
    metadata: createDefaultProjectMetadata({
      projectTitle: "Project Milestone - Untitled",
      projectStatus: "planning",
      projectPriority: "medium",
      projectArea: "Milestone",
      projectDescription: "Milestone checkpoint and next actions.",
      tags: ["project", "milestone"],
    }),
    blocks: [
      { type: "heading1", content: "Milestone outcome" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Acceptance notes" },
      { type: "todo", content: "Define acceptance check", checked: false },
    ],
    limitations: ["No Gantt, dependency engine, reminders, or calendar scheduling is implemented."],
  },
  createFinanceTemplate({
    id: "expense-record",
    name: "Expense Record",
    title: "Expense - Untitled",
    summary: "Draft outgoing transaction.",
    kind: "transaction",
    transactionType: "expense",
    status: "draft",
    tags: ["finance", "transaction", "expense"],
  }),
  createFinanceTemplate({
    id: "income-record",
    name: "Income Record",
    title: "Income - Untitled",
    summary: "Draft incoming transaction.",
    kind: "transaction",
    transactionType: "income",
    status: "draft",
    tags: ["finance", "transaction", "income"],
  }),
  createFinanceTemplate({
    id: "bill-record",
    name: "Bill Record",
    title: "Bill - Untitled",
    summary: "Local bill metadata record.",
    kind: "bill",
    transactionType: "expense",
    status: "pending",
    tags: ["finance", "bill"],
  }),
  createFinanceTemplate({
    id: "subscription-record",
    name: "Subscription Record",
    title: "Subscription - Untitled",
    summary: "Recurring metadata without reminders.",
    kind: "subscription",
    transactionType: "expense",
    status: "pending",
    recurring: true,
    tags: ["finance", "subscription"],
  }),
  createFinanceTemplate({
    id: "budget-record",
    name: "Budget Record",
    title: "Budget - Untitled",
    summary: "Local planning budget record.",
    kind: "budget",
    transactionType: "expense",
    status: "planned",
    tags: ["finance", "budget"],
  }),
  createFinanceTemplate({
    id: "reimbursement-record",
    name: "Reimbursement Record",
    title: "Reimbursement - Untitled",
    summary: "Money owed metadata.",
    kind: "reimbursement",
    transactionType: "reimbursement",
    status: "pending",
    tags: ["finance", "reimbursement"],
  }),
  createFinanceTemplate({
    id: "receipt-finance-record",
    name: "Receipt Finance Record",
    title: "Receipt Finance - Untitled",
    summary: "Finance record ready to link a receipt document.",
    kind: "receipt",
    transactionType: "expense",
    status: "draft",
    tags: ["finance", "receipt"],
  }),
  createFinanceTemplate({
    id: "invoice-finance-record",
    name: "Invoice Finance Record",
    title: "Invoice Finance - Untitled",
    summary: "Finance record ready to link an invoice document.",
    kind: "bill",
    transactionType: "expense",
    status: "pending",
    tags: ["finance", "invoice"],
  }),
  createTrackerTemplate({
    id: "habit-tracker",
    name: "Habit Tracker",
    title: "Habit Tracker - Untitled",
    summary: "Daily habit metadata record.",
    type: "habit",
    frequency: "daily",
    unit: "times",
    tags: ["tracker", "habit"],
  }),
  createTrackerTemplate({
    id: "study-tracker",
    name: "Study Tracker",
    title: "Study Tracker - Untitled",
    summary: "Study minutes or sessions.",
    type: "study",
    frequency: "weekly",
    unit: "minutes",
    tags: ["tracker", "study"],
  }),
  createTrackerTemplate({
    id: "reading-tracker",
    name: "Reading Tracker",
    title: "Reading Tracker - Untitled",
    summary: "Pages, chapters, or books.",
    type: "reading",
    frequency: "daily",
    unit: "pages",
    tags: ["tracker", "reading"],
  }),
  createTrackerTemplate({
    id: "finance-tracker",
    name: "Finance Tracker",
    title: "Finance Tracker - Untitled",
    summary: "Savings or spending metadata.",
    type: "finance",
    frequency: "monthly",
    unit: "MYR",
    tags: ["tracker", "finance"],
  }),
  createTrackerTemplate({
    id: "custom-tracker",
    name: "Custom Tracker",
    title: "Custom Tracker - Untitled",
    summary: "Custom local metric record.",
    type: "custom",
    frequency: "custom",
    unit: "",
    tags: ["tracker", "custom"],
  }),
  createGoalTemplate({
    id: "goal-plan",
    name: "Goal Plan",
    title: "Goal Plan - Untitled",
    summary: "Goal record with planning sections.",
    horizon: "short-term",
    status: "active",
    tags: ["goal", "plan"],
  }),
  createGoalTemplate({
    id: "short-term-goal",
    name: "Short-Term Goal",
    title: "Short-term Goal - Untitled",
    summary: "Near-term goal metadata.",
    horizon: "short-term",
    status: "active",
    tags: ["goal", "short-term"],
  }),
  createGoalTemplate({
    id: "long-term-goal",
    name: "Long-Term Goal",
    title: "Long-term Goal - Untitled",
    summary: "Long horizon goal metadata.",
    horizon: "long-term",
    status: "active",
    tags: ["goal", "long-term"],
  }),
  createGoalTemplate({
    id: "lifetime-goal",
    name: "Lifetime Goal",
    title: "Lifetime Goal - Untitled",
    summary: "Lifetime horizon goal metadata.",
    horizon: "lifetime",
    status: "not-started",
    tags: ["goal", "lifetime"],
  }),
  createGoalTemplate({
    id: "custom-goal",
    name: "Custom Goal",
    title: "Custom Goal - Untitled",
    summary: "Custom horizon goal metadata.",
    horizon: "custom",
    status: "not-started",
    tags: ["goal", "custom"],
  }),
  createCalendarTemplate({
    id: "calendar-appointment",
    name: "Appointment",
    title: "Appointment - Untitled",
    summary: "Local appointment event.",
    eventType: "appointment",
    status: "planned",
    tags: ["appointment"],
  }),
  createCalendarTemplate({
    id: "study-session-event",
    name: "Study Session",
    title: "Study Session - Untitled",
    summary: "Local study session event.",
    eventType: "study",
    status: "planned",
    tags: ["study"],
  }),
  createCalendarTemplate({
    id: "class-event",
    name: "Class Event",
    title: "Class - Untitled",
    summary: "Local class event.",
    eventType: "class",
    status: "planned",
    tags: ["class"],
  }),
  createCalendarTemplate({
    id: "project-milestone-event",
    name: "Project Milestone Event",
    title: "Project Milestone - Untitled",
    summary: "Local project milestone event.",
    eventType: "project-milestone",
    status: "planned",
    tags: ["project", "milestone"],
  }),
  createCalendarTemplate({
    id: "bill-due-date-event",
    name: "Bill Due Date",
    title: "Bill Due - Untitled",
    summary: "Local bill due date event without reminders.",
    eventType: "bill-due",
    status: "planned",
    tags: ["bill-due", "finance"],
  }),
  createDatabaseTemplate({
    id: "project-table",
    name: "Project Table",
    title: "Project Table",
    summary: "Local editable project table.",
    description: "A basic provider-backed database table for project tracking.",
    tags: ["database", "project"],
  }),
  createDatabaseTemplate({
    id: "reading-list-table",
    name: "Reading List",
    title: "Reading List",
    summary: "Local editable reading list table.",
    description: "A basic provider-backed database table for reading items.",
    tags: ["database", "reading"],
  }),
  createDatabaseTemplate({
    id: "finance-ledger-table",
    name: "Finance Ledger Table",
    title: "Finance Ledger",
    summary: "Local editable finance table.",
    description: "A simple planning table for finance notes. It is not bank sync or accounting.",
    tags: ["database", "finance"],
  }),
];

const PARTIAL_AND_FUTURE_TEMPLATES: TemplateDefinition[] = [
  futureTemplate({
    id: "page-system-template",
    name: "Page System Template",
    status: "partial",
    summary: "Multi-page systems need a dedicated safe creation flow.",
    limitations: [
      "Multi-page, relation-bearing template application is not implemented in this phase.",
    ],
  }),
  futureTemplate({
    id: "custom-template-builder",
    name: "Custom Template Builder",
    status: "future",
    summary: "User-created templates are future work.",
    limitations: ["No editable template builder or user template persistence exists yet."],
  }),
  futureTemplate({
    id: "template-import-export",
    name: "Template Import Export",
    status: "future",
    summary: "Template import/export remains unavailable.",
    limitations: ["Native file-based template import and export are not implemented."],
  }),
  futureTemplate({
    id: "ai-template-generation",
    name: "AI Template Generation",
    status: "future",
    summary: "AI generation is not implemented.",
    limitations: ["No local or cloud AI template generation is implemented."],
  }),
  futureTemplate({
    id: "template-version-history",
    name: "Template Version History",
    status: "future",
    summary: "Template versioning remains future work.",
    limitations: ["No template version history or rollback model exists."],
  }),
  futureTemplate({
    id: "cloud-template-marketplace",
    name: "Cloud Template Marketplace",
    status: "future",
    summary: "Marketplace and sync are not implemented.",
    limitations: ["No cloud marketplace, account, sync, or remote template service exists."],
  }),
];

export function getAllTemplates(): TemplateDefinition[] {
  return [
    ...getWorkspaceTemplates().map(enrichWorkspaceTemplate),
    ...EXTRA_IMPLEMENTED_TEMPLATES,
    ...PARTIAL_AND_FUTURE_TEMPLATES,
  ];
}

export function getImplementedTemplates(): TemplateDefinition[] {
  return getAllTemplates().filter((template) => template.status === "implemented");
}

export function getFutureTemplates(): TemplateDefinition[] {
  return getAllTemplates().filter((template) => template.status === "future");
}

export function getTemplatesByCategory(category?: TemplateCategory): TemplateDefinition[] {
  return getAllTemplates().filter((template) => !category || template.category === category);
}

export function getTemplateById(templateId: string): TemplateDefinition | undefined {
  return getAllTemplates().find((template) => template.id === templateId);
}

export function getTemplateStatusCounts(templates = getAllTemplates()) {
  return {
    implemented: templates.filter((template) => template.status === "implemented").length,
    partial: templates.filter((template) => template.status === "partial").length,
    future: templates.filter((template) => template.status === "future").length,
    total: templates.length,
  };
}

export function getTemplateCategoryCounts(templates = getAllTemplates()) {
  return templates.reduce<Record<TemplateCategory, number>>(
    (counts, template) => {
      counts[template.category] = (counts[template.category] ?? 0) + 1;
      return counts;
    },
    {} as Record<TemplateCategory, number>,
  );
}

export function getTemplateSearchText(template: TemplateDefinition): string {
  return [
    template.id,
    template.name,
    template.title,
    template.category,
    template.type,
    template.status,
    template.targetItemType,
    template.summary,
    template.description,
    template.tags.join(" "),
    stringifySearchable(template.properties),
    stringifySearchable(template.metadata),
    template.blocks.map((block) => block.content).join(" "),
    template.limitations.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getTemplatePreview(templateOrId: string | TemplateDefinition): TemplatePreview {
  const template = typeof templateOrId === "string" ? getTemplateById(templateOrId) : templateOrId;
  if (!template) throw new Error(`Unknown template: ${templateOrId}`);

  return {
    id: template.id,
    name: template.name,
    title: template.title,
    category: template.category,
    status: template.status,
    targetItemType: template.targetItemType,
    description: template.description,
    summary: template.summary,
    tags: [...template.tags],
    properties: { ...template.properties },
    metadata: normalizeTemplateMetadata(template, template.category, template.type, template.title),
    limitations: [...template.limitations],
    blockCount: template.blocks.length,
    canCreate: template.status === "implemented",
  };
}

export function validateTemplateDefinition(template: TemplateDefinition): string[] {
  const issues: string[] = [];
  if (!template.id.trim()) issues.push("Template id is required.");
  if (!template.name.trim()) issues.push("Template name is required.");
  if (!template.title.trim()) issues.push("Template title is required.");
  if (!template.category) issues.push("Template category is required.");
  if (!template.status) issues.push("Template status is required.");
  if (!template.targetItemType) issues.push("Template target item type is required.");
  if (template.blocks.some((block) => !SAFE_BLOCK_TYPES.has(block.type))) {
    issues.push("Template uses unsupported starter block types.");
  }
  if (template.status !== "implemented" && template.blocks.length > 0) {
    issues.push("Non-implemented templates must not define starter blocks.");
  }
  return issues;
}

export async function createItemFromTemplate(
  provider: VaultProvider,
  templateId: string,
  options: {
    category?: ItemCategory;
    parentId?: string;
    title?: string;
    initialContent?: string;
  } = {},
): Promise<MizaanItem> {
  const template = getTemplateById(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  if (template.status !== "implemented") {
    throw new Error(`Template is not implemented: ${templateId}`);
  }

  if (isWorkspaceTemplate(templateId)) {
    return await createWorkspacePageFromTemplate(provider, templateId, options);
  }

  const category = template.universal ? (options.category ?? template.category) : template.category;
  const type = template.universal ? typeForCategory(category) : template.type;
  const title = options.title ?? template.title;
  const metadata = normalizeTemplateMetadata(template, category, type, title);
  const item = await provider.createItem({
    title,
    category,
    type,
    icon: template.icon,
    summary: template.summary,
    status: String(template.properties.status ?? "Draft"),
    tags: [...template.tags],
    properties: { ...template.properties },
    parentId: options.parentId,
    metadata,
  });

  const blocks = options.initialContent
    ? template.blocks.map((block, index) =>
        index === 0 && block.type !== "table"
          ? { ...block, content: options.initialContent ?? "" }
          : block,
      )
    : template.blocks;
  await provider.replaceBlocks(
    item.id,
    blocks.map((block) => ({ ...block })),
  );

  if (item.type === "database") {
    const database = createDatabaseForTemplate(template.id, item.id, item.title);
    return (
      (await provider.updateItem(item.id, {
        metadata: {
          ...item.metadata,
          templateId: template.id,
          database: toDatabaseMetadata(database),
        },
      })) ?? item
    );
  }

  return item;
}

export function normalizeTemplateMetadata(
  template: TemplateDefinition,
  category: ItemCategory,
  type: ItemType,
  title: string,
): Record<string, PropertyValue> {
  const base = {
    ...(template.metadata ?? {}),
    tags: [...template.tags],
    templateId: template.id,
    templateStatus: template.status,
  };

  if (category === "documents" && type === "document") {
    return updateDocumentMetadata({ ...base, documentTitle: title }, { documentTitle: title });
  }

  if (category === "projects" && type === "project") {
    return updateProjectMetadata({ ...base, projectTitle: title }, { projectTitle: title });
  }

  if (category === "tasks" && type === "task") {
    return updateTaskMetadata({ ...base, taskTitle: title }, { taskTitle: title });
  }

  if (category === "people" && type === "person") {
    return updatePersonMetadata({ ...base, displayName: title }, { displayName: title });
  }

  if (category === "people" && type === "interaction") {
    return updateInteractionMetadata(
      { ...base, interactionTitle: title },
      { interactionTitle: title },
    );
  }

  if (category === "finance" && type === "finance") {
    return updateFinanceMetadata({ ...base, financeTitle: title }, { financeTitle: title });
  }

  if (category === "calendar" && type === "calendar") {
    return createDefaultCalendarEventMetadata({ ...base, eventTitle: title });
  }

  if (category === "trackers" && type === "tracker") {
    return updateTrackerMetadata({ ...base, trackerTitle: title }, { trackerTitle: title });
  }

  if (category === "goals" && type === "goal") {
    return updateGoalMetadata({ ...base, goalTitle: title }, { goalTitle: title });
  }

  return base;
}

function enrichWorkspaceTemplate(
  template: ReturnType<typeof getWorkspaceTemplates>[number],
): TemplateDefinition {
  return {
    ...template,
    description: template.summary,
    status: "implemented",
    targetItemType: template.type,
    limitations: inferWorkspaceTemplateLimitations(template.id),
  };
}

function inferWorkspaceTemplateLimitations(templateId: string): string[] {
  if (templateId.includes("document")) {
    return [
      "Document templates create metadata records only; file import and preview are future work.",
    ];
  }
  if (templateId === "calendar-event") {
    return [
      "Recurrence, reminders, native notifications, Google Calendar, ICS, and sync are not implemented.",
    ];
  }
  if (templateId === "tracker") {
    return ["Streaks, charts, reminders, notifications, and wearable imports are not implemented."];
  }
  if (templateId === "goal") {
    return ["Progress history, reminders, notifications, and AI coaching are not implemented."];
  }
  if (templateId === "finance-record") {
    return [
      "Bank sync, imports, receipt OCR, tax, and accounting-grade ledger behavior are not implemented.",
    ];
  }
  if (templateId === "daily-note") {
    return ["No automatic daily recurrence or reminder engine is implemented."];
  }
  if (templateId === "journal-page") {
    return ["No encryption, app lock, or hidden search behavior is implemented."];
  }
  if (templateId === "quick-capture") {
    return ["No mobile capture or global hotkey is implemented."];
  }
  if (templateId === "research-note") {
    return ["No AI summarization, citation manager, or web import is implemented."];
  }
  if (templateId === "brainstorm-note") {
    return ["No AI idea generation is implemented."];
  }
  if (templateId === "basic-database" || templateId === "simple-table-page") {
    return [
      "Advanced database views, formulas, rollups, CSV import, and export are not implemented.",
    ];
  }
  return [];
}

function isWorkspaceTemplate(templateId: string) {
  return getWorkspaceTemplates().some((template) => template.id === templateId);
}

function createFinanceTemplate(input: {
  id: string;
  name: string;
  title: string;
  summary: string;
  kind: string;
  transactionType: string;
  status: string;
  recurring?: boolean;
  tags: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "$",
    category: "finance",
    type: "finance",
    title: input.title,
    summary: input.summary,
    description: `${input.summary} Creates a normalized local finance metadata record.`,
    status: "implemented",
    targetItemType: "finance",
    tags: input.tags,
    properties: { status: titleCase(input.status), financeKind: titleCase(input.kind), amount: 0 },
    metadata: createDefaultFinanceMetadata({
      financeTitle: input.title,
      financeKind: input.kind,
      transactionType: input.transactionType,
      financeStatus: input.status,
      recurring: input.recurring ?? false,
      tags: input.tags,
    }),
    blocks: [
      { type: "heading1", content: "Finance notes" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a local metadata record only. Bank sync, imports, receipt OCR, tax reports, and accounting-grade ledgers are not implemented.",
      },
    ],
    limitations: [
      "No bank sync, payment provider, receipt OCR, tax report, or accounting engine is implemented.",
    ],
  };
}

function createTrackerTemplate(input: {
  id: string;
  name: string;
  title: string;
  summary: string;
  type: string;
  frequency: string;
  unit: string;
  tags: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "T",
    category: "trackers",
    type: "tracker",
    title: input.title,
    summary: input.summary,
    description: `${input.summary} Creates normalized local tracker metadata.`,
    status: "implemented",
    targetItemType: "tracker",
    tags: input.tags,
    properties: {
      status: "Active",
      trackerType: titleCase(input.type),
      frequency: titleCase(input.frequency),
    },
    metadata: createDefaultTrackerMetadata({
      trackerTitle: input.title,
      trackerType: input.type,
      trackerStatus: "active",
      frequency: input.frequency,
      unit: input.unit,
      tags: input.tags,
    }),
    blocks: [
      { type: "heading1", content: "What this tracks" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "Check-ins are local metadata entries. Streaks, charts, reminders, and notifications are not implemented.",
      },
    ],
    limitations: [
      "No fake streak engine, charts, reminders, notifications, AI coaching, or wearable import is implemented.",
    ],
  };
}

function createGoalTemplate(input: {
  id: string;
  name: string;
  title: string;
  summary: string;
  horizon: string;
  status: string;
  tags: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "G",
    category: "goals",
    type: "goal",
    title: input.title,
    summary: input.summary,
    description: `${input.summary} Creates normalized local goal metadata.`,
    status: "implemented",
    targetItemType: "goal",
    tags: input.tags,
    properties: {
      status: titleCase(input.status),
      horizon: titleCase(input.horizon),
      priority: "None",
    },
    metadata: createDefaultGoalMetadata({
      goalTitle: input.title,
      goalStatus: input.status,
      goalHorizon: input.horizon,
      tags: input.tags,
    }),
    blocks: [
      { type: "heading1", content: "Outcome" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Progress notes" },
      {
        type: "callout",
        content:
          "This goal stores typed local metadata only. Progress history, coaching, reminders, and notifications are future phases.",
      },
    ],
    limitations: [
      "No progress history, reminders, native notifications, AI coaching, cloud sync, or mobile capture is implemented.",
    ],
  };
}

function createCalendarTemplate(input: {
  id: string;
  name: string;
  title: string;
  summary: string;
  eventType: CalendarEventType;
  status: CalendarEventStatus;
  tags: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "C",
    category: "calendar",
    type: "calendar",
    title: input.title,
    summary: input.summary,
    description: `${input.summary} Creates a normalized local calendar event record.`,
    status: "implemented",
    targetItemType: "calendar",
    tags: input.tags,
    properties: { status: titleCase(input.status), startDate: "", endDate: "", allDay: true },
    metadata: createDefaultCalendarEventMetadata({
      eventTitle: input.title,
      eventType: input.eventType,
      eventStatus: input.status,
      tags: input.tags,
    }),
    blocks: [
      { type: "heading1", content: "Event notes" },
      {
        type: "callout",
        content:
          "This is a local calendar event record. Recurrence, reminders, native notifications, Google Calendar, ICS, and sync are not implemented.",
      },
      { type: "paragraph", content: "" },
    ],
    limitations: [
      "No recurrence, reminder engine, native notifications, ICS, Google Calendar, cloud sync, or app lock is implemented.",
    ],
  };
}

function createDatabaseTemplate(input: {
  id: string;
  name: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "#",
    category: "databases",
    type: "database",
    title: input.title,
    summary: input.summary,
    description: input.description,
    status: "implemented",
    targetItemType: "database",
    tags: input.tags,
    properties: { status: "Active" },
    metadata: {
      database: toDatabaseMetadata(createDefaultDatabaseModel("template-database", input.title)),
    },
    blocks: [],
    limitations: ["Only the current editable table database foundation is implemented."],
  };
}

function futureTemplate(input: {
  id: string;
  name: string;
  status: TemplateStatus;
  summary: string;
  limitations: string[];
}): TemplateDefinition {
  return {
    id: input.id,
    name: input.name,
    icon: "*",
    category: "templates",
    type: "template",
    title: input.name,
    summary: input.summary,
    description: input.summary,
    status: input.status,
    targetItemType: "template",
    tags: ["template", input.status],
    properties: { status: titleCase(input.status) },
    metadata: { futureOnly: input.status === "future", partialOnly: input.status === "partial" },
    blocks: [],
    limitations: input.limitations,
  };
}

function createDatabaseForTemplate(templateId: string, id: string, title: string) {
  const database = createDefaultDatabaseModel(id, title);
  if (templateId === "reading-list-table") {
    return {
      ...database,
      description: "Local reading list table.",
      columns: [
        { id: "title", name: "Title", type: "text" as const, width: 240 },
        { id: "author", name: "Author", type: "text" as const, width: 180 },
        {
          id: "status",
          name: "Status",
          type: "select" as const,
          options: ["To read", "Reading", "Done"],
        },
        { id: "notes", name: "Notes", type: "text" as const, width: 280 },
      ],
      rows: [],
      rowOrder: [],
    };
  }
  if (templateId === "finance-ledger-table") {
    return {
      ...database,
      description: "Manual finance planning table. Not bank sync or accounting.",
      columns: [
        { id: "title", name: "Entry", type: "text" as const, width: 220 },
        { id: "amount", name: "Amount", type: "number" as const, width: 120 },
        {
          id: "status",
          name: "Status",
          type: "select" as const,
          options: ["Draft", "Pending", "Cleared"],
        },
        { id: "date", name: "Date", type: "date" as const },
        { id: "notes", name: "Notes", type: "text" as const, width: 280 },
      ],
      rows: [],
      rowOrder: [],
    };
  }
  if (templateId === "project-table") {
    return {
      ...database,
      description: "Local project table.",
      columns: [
        { id: "title", name: "Project", type: "text" as const, width: 240 },
        {
          id: "status",
          name: "Status",
          type: "select" as const,
          options: ["Planning", "Active", "Done"],
        },
        {
          id: "priority",
          name: "Priority",
          type: "select" as const,
          options: ["Low", "Medium", "High"],
        },
        { id: "notes", name: "Notes", type: "text" as const, width: 280 },
      ],
      rows: [],
      rowOrder: [],
    };
  }
  return database;
}

function typeForCategory(category: ItemCategory): ItemType {
  const types: Record<ItemCategory, ItemType> = {
    notes: "note",
    documents: "document",
    projects: "project",
    tasks: "task",
    people: "person",
    finance: "finance",
    calendar: "calendar",
    trackers: "tracker",
    goals: "goal",
    databases: "database",
    templates: "template",
  };
  return types[category];
}

function stringifySearchable(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return value.map(stringifySearchable).join(" ");
  if (typeof value === "object") return Object.values(value).map(stringifySearchable).join(" ");
  return "";
}

function titleCase(value: string) {
  return value
    .split("-")
    .map((part) => part.slice(0, 1).toUpperCase() + part.slice(1))
    .join(" ");
}

export function createSimpleTableBlock(): CreateBlockInput {
  return { type: "table", content: serializeTableData(createDefaultTableData()) };
}
