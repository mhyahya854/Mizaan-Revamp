import type {
  BlockType,
  CreateBlockInput,
  ItemCategory,
  ItemType,
  MizaanBlock,
  MizaanItem,
  MizaanRelation,
  PropertyValue,
  VaultProvider,
  VaultSnapshot,
} from "../vault/types";
import { createDefaultCalendarEventMetadata } from "../calendar/calendar-event";
import {
  createDefaultDatabaseModel,
  normalizeDatabaseModel,
  toDatabaseMetadata,
} from "../database/database-table";
import {
  createDefaultDocumentMetadata,
  updateDocumentMetadata,
} from "../documents/document-record";
import { createDefaultProjectMetadata, updateProjectMetadata } from "../projects/project-record";
import { createDefaultTaskMetadata, updateTaskMetadata } from "../tasks/task-record";
import { createDefaultPersonMetadata, updatePersonMetadata } from "../people/person-record";
import {
  createDefaultInteractionMetadata,
  updateInteractionMetadata,
} from "../people/interaction-record";
import { createDefaultFinanceMetadata, updateFinanceMetadata } from "../finance/finance-record";
import { createDefaultGoalMetadata, updateGoalMetadata } from "../goals/goal-record";
import { createDefaultTrackerMetadata, updateTrackerMetadata } from "../trackers/tracker-record";
import { createDefaultTableData, serializeTableData } from "../table/simple-table";
import { resolveWikiLinks, type ResolvedWikiLink } from "../wiki/wiki-links";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface ResolvedRelation {
  relation: MizaanRelation;
  source: MizaanItem;
  target: MizaanItem;
}

export type ResolvedWikiPageLink = ResolvedWikiLink;

interface PagePropertiesModel {
  type: string;
  category: string;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  blocksCount: number;
  outgoingCount: number;
  backlinksCount: number;
  relationOutgoingCount: number;
  relationBacklinksCount: number;
  wikiOutgoingCount: number;
  wikiBacklinksCount: number;
  childPagesCount: number;
  attachedFilesCount: number;
  databaseColumnsCount: number;
  databaseRowsCount: number;
  archived: boolean;
  deleted: boolean;
  providerMode: string;
}

export interface PageWorkspaceModel {
  state: "ready" | "missing";
  item: MizaanItem;
  breadcrumbs: Breadcrumb[];
  blocks: MizaanBlock[];
  properties: PagePropertiesModel;
  relations: ResolvedRelation[];
  backlinks: ResolvedRelation[];
  outgoingLinks: ResolvedRelation[];
  wikiBacklinks: ResolvedWikiPageLink[];
  wikiOutgoingLinks: ResolvedWikiPageLink[];
  childPages: MizaanItem[];
  attachedFiles: MizaanItem["attachedFiles"];
  providerWarning: string;
}

export interface SlashCommand {
  id: BlockType;
  label: string;
  hint: string;
}

interface TemplateDefinition {
  id: string;
  name: string;
  icon: string;
  category: ItemCategory;
  type: ItemType;
  title: string;
  summary: string;
  tags: string[];
  properties: Record<string, PropertyValue>;
  metadata?: Record<string, PropertyValue>;
  blocks: CreateBlockInput[];
  universal?: boolean;
}

const SPACE_LABELS: Record<ItemCategory, string> = {
  notes: "Notes",
  documents: "Documents",
  projects: "Projects",
  tasks: "Tasks",
  people: "People",
  finance: "Finance",
  calendar: "Calendar",
  trackers: "Trackers",
  goals: "Goals",
  databases: "Databases",
  templates: "Templates",
};

const SPACE_HREFS: Record<ItemCategory, string> = {
  notes: "/notes",
  documents: "/documents",
  projects: "/projects",
  tasks: "/projects",
  people: "/people",
  finance: "/finance",
  calendar: "/calendar",
  trackers: "/trackers",
  goals: "/goals",
  databases: "/databases",
  templates: "/templates",
};

const SPACE_ICONS: Record<ItemCategory, string> = {
  notes: "N",
  documents: "D",
  projects: "P",
  tasks: "T",
  people: "U",
  finance: "$",
  calendar: "C",
  trackers: "T",
  goals: "G",
  databases: "#",
  templates: "*",
};

const TEMPLATES: TemplateDefinition[] = [
  {
    id: "notes-space",
    name: "Notes Space",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Notes",
    summary: "Quick captures, meeting notes, lecture notes, journals, and long-form pages.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "notes-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Notes Space" },
      {
        type: "paragraph",
        content:
          "Welcome to your Notes Space. Here you can capture ideas, draft articles, and organize meeting details.",
      },
    ],
  },
  {
    id: "documents-space",
    name: "Documents Space",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Documents",
    summary: "Document records for files worth keeping.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "documents-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Documents Space" },
      { type: "paragraph", content: "Track local records and imported document assets." },
    ],
  },
  {
    id: "projects-space",
    name: "Projects Space",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Projects",
    summary: "Long-running threads of work.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "projects-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Projects Space" },
      { type: "paragraph", content: "Manage project paths, milestones, and deliverables." },
    ],
  },
  {
    id: "people-space",
    name: "People Space",
    icon: "U",
    category: "people",
    type: "person",
    title: "People",
    summary: "Personal profiles and relationship context.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "people-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "People Space" },
      {
        type: "paragraph",
        content: "Keep profiles of contacts, collaborators, and relationships.",
      },
    ],
  },
  {
    id: "finance-space",
    name: "Finance Space",
    icon: "$",
    category: "finance",
    type: "finance",
    title: "Finance",
    summary: "Local finance records and planning.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "finance-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Finance Space" },
      { type: "paragraph", content: "Organize ledger entries and track budgets locally." },
    ],
  },
  {
    id: "trackers-space",
    name: "Trackers Space",
    icon: "T",
    category: "trackers",
    type: "tracker",
    title: "Trackers",
    summary: "Habit and progress tracker pages.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "trackers-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Trackers Space" },
      { type: "paragraph", content: "Track habits, study time, exercises, and custom milestones." },
    ],
  },
  {
    id: "goals-space",
    name: "Goals Space",
    icon: "G",
    category: "goals",
    type: "goal",
    title: "Goals",
    summary: "Goal records that link projects, trackers, people, documents, and finance metadata.",
    tags: [],
    properties: { status: "Active" },
    metadata: {
      promotedAsSpace: true,
      itemRole: "space",
      spaceTemplateId: "goals-space",
      sidebarPinned: true,
    },
    blocks: [
      { type: "heading1", content: "Goals Space" },
      {
        type: "paragraph",
        content:
          "Keep provider-backed local goal records. Progress history, reminders, coaching, and notifications remain future work.",
      },
    ],
  },
  {
    id: "blank-page",
    name: "Blank Page",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Untitled Page",
    summary: "A blank page that adapts to the current space.",
    tags: [],
    properties: { status: "Draft" },
    universal: true,
    blocks: [{ type: "paragraph", content: "" }],
  },
  {
    id: "blank-note",
    name: "Blank Note",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Untitled Note",
    summary: "A quiet blank note.",
    tags: [],
    properties: { status: "Draft" },
    blocks: [{ type: "paragraph", content: "" }],
  },
  {
    id: "meeting-note",
    name: "Meeting Notes",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Meeting Notes - New Meeting",
    summary: "Attendees, agenda, decisions, and follow-up.",
    tags: ["meeting"],
    properties: { status: "Draft" },
    blocks: [
      { type: "heading1", content: "Purpose" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Attendees" },
      { type: "bullet", content: "" },
      { type: "heading2", content: "Decisions" },
      { type: "todo", content: "Add follow-up action", checked: false },
    ],
  },
  {
    id: "lecture-note",
    name: "Lecture Notes",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Lecture Notes - Untitled Topic",
    summary: "Structured lecture capture page.",
    tags: ["lecture"],
    properties: { status: "Draft", course: "" },
    blocks: [
      { type: "heading1", content: "Summary" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Key definitions" },
      { type: "bullet", content: "" },
      { type: "heading2", content: "Review checklist" },
      { type: "todo", content: "Review this lecture", checked: false },
    ],
  },
  {
    id: "project-plan",
    name: "General Project",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Project Plan - Untitled",
    summary: "Goal, scope, milestones, risks, and linked notes.",
    tags: ["project"],
    properties: { status: "Planning", priority: "None", deadline: "", area: "" },
    metadata: createDefaultProjectMetadata({
      projectTitle: "Project Plan - Untitled",
      projectStatus: "planning",
      projectPriority: "none",
      projectDescription: "Goal, scope, milestones, risks, and linked notes.",
    }),
    blocks: [
      { type: "heading1", content: "Goal" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Milestones" },
      { type: "todo", content: "Define first milestone", checked: false },
      { type: "heading2", content: "Risks" },
      { type: "bullet", content: "" },
    ],
  },
  {
    id: "study-project",
    name: "Study Project",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Study Project - Untitled",
    summary: "Course, exam, assignment, or learning project.",
    tags: ["project", "study"],
    properties: { status: "Planning", priority: "Medium", deadline: "", area: "Study" },
    metadata: createDefaultProjectMetadata({
      projectTitle: "Study Project - Untitled",
      projectStatus: "planning",
      projectPriority: "medium",
      projectArea: "Study",
      projectDescription: "Course, exam, assignment, or learning project.",
    }),
    blocks: [
      { type: "heading1", content: "Outcome" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Study notes" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Review checklist" },
      {
        type: "todo",
        content: "Create first linked task record from the project panel",
        checked: false,
      },
    ],
  },
  {
    id: "research-project",
    name: "Research Project",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Research Project - Untitled",
    summary: "Research question, sources, notes, and writing checkpoints.",
    tags: ["project", "research"],
    properties: { status: "Planning", priority: "Medium", deadline: "", area: "Research" },
    metadata: createDefaultProjectMetadata({
      projectTitle: "Research Project - Untitled",
      projectStatus: "planning",
      projectPriority: "medium",
      projectArea: "Research",
      projectDescription: "Research question, sources, notes, and writing checkpoints.",
    }),
    blocks: [
      { type: "heading1", content: "Research question" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Sources" },
      { type: "bullet", content: "" },
      { type: "heading2", content: "Open questions" },
      { type: "bullet", content: "" },
    ],
  },
  {
    id: "personal-project",
    name: "Personal Project",
    icon: "P",
    category: "projects",
    type: "project",
    title: "Personal Project - Untitled",
    summary: "Local personal project with notes and next actions.",
    tags: ["project", "personal"],
    properties: { status: "Planning", priority: "None", deadline: "", area: "Personal" },
    metadata: createDefaultProjectMetadata({
      projectTitle: "Personal Project - Untitled",
      projectStatus: "planning",
      projectPriority: "none",
      projectArea: "Personal",
      projectDescription: "Local personal project with notes and next actions.",
    }),
    blocks: [
      { type: "heading1", content: "Why this matters" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Notes" },
      { type: "paragraph", content: "" },
    ],
  },
  {
    id: "task-record",
    name: "Task Record",
    icon: "T",
    category: "tasks",
    type: "task",
    title: "Task - Untitled",
    summary: "Provider-backed task record.",
    tags: ["task"],
    properties: { status: "Todo", priority: "None", dueDate: "", projectId: "" },
    metadata: createDefaultTaskMetadata({
      taskTitle: "Task - Untitled",
      taskStatus: "todo",
      taskPriority: "none",
    }),
    blocks: [
      { type: "heading1", content: "Task notes" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a real task record. Recurrence, reminders, scheduling, and native notifications are future phases.",
      },
    ],
  },
  {
    id: "document-record",
    name: "General Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Untitled document",
    summary: "Metadata-only document record.",
    tags: ["document"],
    properties: {
      status: "Metadata-only",
      documentKind: "General",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata(),
    blocks: [
      { type: "heading1", content: "Summary" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "File state" },
      {
        type: "callout",
        content:
          "This is a metadata-only record. File import, preview, OCR, and native vault file storage are planned for later phases.",
      },
    ],
  },
  {
    id: "receipt-document-record",
    name: "Receipt Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Receipt - Untitled",
    summary: "Metadata-only receipt record.",
    tags: ["document", "receipt"],
    properties: {
      status: "Metadata-only",
      documentKind: "Receipt",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Receipt - Untitled",
      documentKind: "receipt",
      tags: ["document", "receipt"],
    }),
    blocks: [
      { type: "heading1", content: "Receipt summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "Receipt file import and preview are future native/filesystem work. This record stores metadata only.",
      },
    ],
  },
  {
    id: "identity-document-record",
    name: "Identity Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Identity document - Untitled",
    summary: "Metadata-only identity document record.",
    tags: ["document", "identity"],
    properties: {
      status: "Metadata-only",
      documentKind: "Identity",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Identity document - Untitled",
      documentKind: "identity",
      tags: ["document", "identity"],
    }),
    blocks: [
      { type: "heading1", content: "Identity document summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "Do not store secrets here yet. Privacy, app lock, encryption, and native file storage are later phases.",
      },
    ],
  },
  {
    id: "invoice-document-record",
    name: "Invoice Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Invoice - Untitled",
    summary: "Metadata-only invoice record.",
    tags: ["document", "invoice"],
    properties: {
      status: "Metadata-only",
      documentKind: "Invoice",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Invoice - Untitled",
      documentKind: "invoice",
      tags: ["document", "invoice"],
    }),
    blocks: [
      { type: "heading1", content: "Invoice summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This record can organize invoice metadata now. File import and preview are future native work.",
      },
    ],
  },
  {
    id: "contract-document-record",
    name: "Contract Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Contract - Untitled",
    summary: "Metadata-only contract record.",
    tags: ["document", "contract"],
    properties: {
      status: "Metadata-only",
      documentKind: "Contract",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Contract - Untitled",
      documentKind: "contract",
      tags: ["document", "contract"],
    }),
    blocks: [
      { type: "heading1", content: "Contract summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a metadata-only contract record. Native file storage, preview, and OCR are not implemented.",
      },
    ],
  },
  {
    id: "reference-document-record",
    name: "Reference Document Record",
    icon: "D",
    category: "documents",
    type: "document",
    title: "Reference document - Untitled",
    summary: "Metadata-only reference record.",
    tags: ["document", "reference"],
    properties: {
      status: "Metadata-only",
      documentKind: "Reference",
      fileState: "Browser record",
    },
    metadata: createDefaultDocumentMetadata({
      documentTitle: "Reference document - Untitled",
      documentKind: "reference",
      tags: ["document", "reference"],
    }),
    blocks: [
      { type: "heading1", content: "Reference summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "Metadata is usable now. Full document import, previews, and extracted text remain future phases.",
      },
    ],
  },
  {
    id: "person-profile",
    name: "Person Profile",
    icon: "U",
    category: "people",
    type: "person",
    title: "Person Profile - New Person",
    summary: "Context, relationship notes, and linked items.",
    tags: ["person"],
    properties: { status: "Unknown", relationshipType: "Unknown", followUpStatus: "None" },
    metadata: createDefaultPersonMetadata({
      displayName: "Person Profile - New Person",
      relationshipType: "unknown",
      relationshipStatus: "unknown",
      context: "Context, relationship notes, and linked items.",
    }),
    blocks: [
      { type: "heading1", content: "Context" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Interaction notes" },
      { type: "bullet", content: "" },
    ],
  },
  {
    id: "relationship-notes",
    name: "Relationship Notes",
    icon: "U",
    category: "people",
    type: "person",
    title: "Relationship Notes - New Person",
    summary: "Local relationship context and boundaries.",
    tags: ["person", "relationship"],
    properties: { status: "Unknown", relationshipType: "Unknown", followUpStatus: "None" },
    metadata: createDefaultPersonMetadata({
      displayName: "Relationship Notes - New Person",
      relationshipType: "unknown",
      relationshipStatus: "unknown",
      context: "Local relationship context and boundaries.",
    }),
    blocks: [
      { type: "heading1", content: "How we know each other" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Context" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Boundaries or preferences" },
      { type: "paragraph", content: "" },
    ],
  },
  {
    id: "contact-context",
    name: "Contact Context",
    icon: "U",
    category: "people",
    type: "person",
    title: "Contact Context - New Person",
    summary: "Organization, role, contact notes, and local context.",
    tags: ["person", "contact"],
    properties: { status: "Unknown", relationshipType: "Unknown", followUpStatus: "None" },
    metadata: createDefaultPersonMetadata({
      displayName: "Contact Context - New Person",
      relationshipType: "unknown",
      relationshipStatus: "unknown",
      context: "Organization, role, contact notes, and local context.",
    }),
    blocks: [
      { type: "heading1", content: "Contact context" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Organization and role" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This stores local metadata only. Contact import, Google Contacts sync, and cloud CRM are not implemented.",
      },
    ],
  },
  {
    id: "follow-up-note",
    name: "Follow-up Note",
    icon: "U",
    category: "people",
    type: "person",
    title: "Follow-up - New Person",
    summary: "Person profile with follow-up metadata ready to edit.",
    tags: ["person", "follow-up"],
    properties: { status: "Follow-up", relationshipType: "Unknown", followUpStatus: "Needed" },
    metadata: createDefaultPersonMetadata({
      displayName: "Follow-up - New Person",
      relationshipType: "unknown",
      relationshipStatus: "follow-up",
      followUpStatus: "follow-up-needed",
    }),
    blocks: [
      { type: "heading1", content: "Follow-up context" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Next step" },
      {
        type: "todo",
        content: "Set the next follow-up date in the metadata panel",
        checked: false,
      },
      {
        type: "callout",
        content:
          "This does not create reminders or native notifications. It stores follow-up metadata only.",
      },
    ],
  },
  {
    id: "interaction-log",
    name: "Interaction Log",
    icon: "I",
    category: "people",
    type: "interaction",
    title: "Interaction - Untitled",
    summary: "Provider-backed interaction record.",
    tags: ["interaction"],
    properties: { status: "Logged", interactionType: "Note", personId: "" },
    metadata: createDefaultInteractionMetadata({
      interactionTitle: "Interaction - Untitled",
      interactionType: "note",
      interactionStatus: "logged",
    }),
    blocks: [
      { type: "heading1", content: "Interaction summary" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a real local interaction record. Email capture, calendar reminders, imports, and automatic meeting history are not implemented.",
      },
    ],
  },
  {
    id: "finance-record",
    name: "Finance Record",
    icon: "$",
    category: "finance",
    type: "finance",
    title: "Finance Record - New Entry",
    summary: "Local finance record.",
    tags: ["finance", "transaction", "expense"],
    properties: { status: "Draft", amount: 0 },
    metadata: createDefaultFinanceMetadata({
      financeTitle: "Finance Record - New Entry",
      financeKind: "transaction",
      transactionType: "expense",
      financeStatus: "draft",
      tags: ["finance", "transaction", "expense"],
    }),
    blocks: [
      { type: "heading1", content: "Summary" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Receipt or related document" },
      { type: "paragraph", content: "Use relations to link a document record." },
    ],
  },
  {
    id: "calendar-event",
    name: "Calendar Event",
    icon: "C",
    category: "calendar",
    type: "calendar",
    title: "Event - Untitled",
    summary: "Local calendar event record.",
    tags: ["event"],
    properties: { status: "Planned", date: "", startDate: "", endDate: "", allDay: true },
    metadata: createDefaultCalendarEventMetadata({
      eventTitle: "Event - Untitled",
      eventType: "event",
      eventStatus: "planned",
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
  },
  {
    id: "tracker",
    name: "Tracker",
    icon: "T",
    category: "trackers",
    type: "tracker",
    title: "Tracker - Untitled",
    summary: "Local tracker metadata record.",
    tags: ["tracker"],
    properties: { status: "Not started", trackerType: "Habit", frequency: "Daily" },
    metadata: createDefaultTrackerMetadata({
      trackerTitle: "Tracker - Untitled",
      trackerType: "habit",
      trackerStatus: "not-started",
      frequency: "daily",
      tags: ["tracker"],
    }),
    blocks: [
      { type: "heading1", content: "What this tracks" },
      { type: "paragraph", content: "" },
      { type: "heading2", content: "Check-ins" },
      {
        type: "callout",
        content:
          "Check-ins are local metadata entries. Streaks, charts, reminders, and notifications are not implemented.",
      },
    ],
  },
  {
    id: "goal",
    name: "Goal",
    icon: "G",
    category: "goals",
    type: "goal",
    title: "Goal - Untitled",
    summary: "Local goal metadata record.",
    tags: ["goal"],
    properties: { status: "Not started", horizon: "Short-term", priority: "None" },
    metadata: createDefaultGoalMetadata({
      goalTitle: "Goal - Untitled",
      goalStatus: "not-started",
      goalHorizon: "short-term",
      tags: ["goal"],
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
  },
  {
    id: "simple-table-page",
    name: "Simple Table Page",
    icon: "N",
    category: "notes",
    type: "note",
    title: "Simple Table - Untitled",
    summary: "A note page with an editable simple table block.",
    tags: ["table"],
    properties: { status: "Draft" },
    blocks: [
      { type: "heading1", content: "Simple table" },
      { type: "paragraph", content: "Use this table for quick notes, comparisons, or planning." },
      { type: "table", content: serializeTableData(createDefaultTableData()) },
    ],
  },
  {
    id: "basic-database",
    name: "Basic Database",
    icon: "#",
    category: "databases",
    type: "database",
    title: "Basic Database",
    summary: "A local editable table database foundation.",
    tags: ["database"],
    properties: { status: "Active" },
    metadata: {
      database: toDatabaseMetadata(
        createDefaultDatabaseModel("template-database", "Basic Database"),
      ),
    },
    blocks: [],
  },
];

const SLASH_COMMANDS: SlashCommand[] = [
  { id: "paragraph", label: "Text", hint: "Plain paragraph block" },
  { id: "heading1", label: "Heading 1", hint: "Large section heading" },
  { id: "heading2", label: "Heading 2", hint: "Medium section heading" },
  { id: "heading3", label: "Heading 3", hint: "Small section heading" },
  { id: "bullet", label: "Bullet list", hint: "Simple bullet item" },
  { id: "numbered", label: "Numbered list", hint: "Ordered list item" },
  { id: "todo", label: "To-do", hint: "Checkbox block" },
  { id: "quote", label: "Quote", hint: "Indented quote block" },
  { id: "callout", label: "Callout", hint: "Highlighted note" },
  { id: "divider", label: "Divider", hint: "Horizontal separator" },
  { id: "code", label: "Code", hint: "Monospace code block" },
  { id: "table", label: "Simple Table", hint: "Editable rows and columns inside this page" },
];

export function getImplementedTemplates() {
  return TEMPLATES;
}

export function getTemplatesForCategory(category?: ItemCategory) {
  return TEMPLATES.filter(
    (template) => template.universal || !category || template.category === category,
  );
}

export function getImplementedSlashCommands() {
  return SLASH_COMMANDS;
}

export function getSpaceLabel(category: ItemCategory) {
  return SPACE_LABELS[category];
}

export function getSpaceHref(category: ItemCategory) {
  return SPACE_HREFS[category];
}

export function buildPageWorkspaceModel(
  provider: VaultProvider,
  itemId: string,
  snapshot: VaultSnapshot,
): PageWorkspaceModel {
  const matchedItem = snapshot.items.find((candidate) => candidate.id === itemId);
  const item = normalizeItem(matchedItem, itemId);
  const blocks = snapshot.blocks
    .filter((block) => block.itemId === item?.id)
    .sort((a, b) => a.order - b.order);
  const childPages = snapshot.items
    .filter((candidate) => candidate.parentId === item?.id && !candidate.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const outgoingLinks = resolveRelations(
    snapshot.relations.filter((relation) => relation.sourceId === item?.id),
    snapshot.items,
  );
  const backlinks = resolveRelations(
    snapshot.relations.filter((relation) => relation.targetId === item?.id),
    snapshot.items,
  );
  const wikiLinks = resolveWikiLinks(snapshot.items, snapshot.blocks);
  const wikiOutgoingLinks = wikiLinks.filter((link) => link.source.id === item?.id);
  const wikiBacklinks = wikiLinks.filter((link) => link.target.id === item?.id);
  const database =
    item.type === "database"
      ? normalizeDatabaseModel(item.metadata.database, item?.id, item?.title)
      : undefined;
  const state = matchedItem ? "ready" : "missing";

  return {
    state,
    item,
    breadcrumbs: buildBreadcrumbs(item, snapshot.items),
    blocks,
    childPages,
    relations: outgoingLinks,
    outgoingLinks,
    backlinks,
    wikiOutgoingLinks,
    wikiBacklinks,
    attachedFiles: item.attachedFiles,
    providerWarning: snapshot.providerInfo.warning,
    properties: {
      type: item.type,
      category: SPACE_LABELS[item.category],
      status: item.status ?? "No status",
      tags: item.tags,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      blocksCount: blocks.length,
      outgoingCount: outgoingLinks.length + wikiOutgoingLinks.length,
      backlinksCount: backlinks.length + wikiBacklinks.length,
      relationOutgoingCount: outgoingLinks.length,
      relationBacklinksCount: backlinks.length,
      wikiOutgoingCount: wikiOutgoingLinks.length,
      wikiBacklinksCount: wikiBacklinks.length,
      childPagesCount: childPages.length,
      attachedFilesCount: item.attachedFiles.length,
      databaseColumnsCount: database?.columns.length ?? 0,
      databaseRowsCount: database?.rows.length ?? 0,
      archived: Boolean(item?.archivedAt),
      deleted: Boolean(item?.deletedAt),
      providerMode: snapshot.providerInfo.mode,
    },
  };
}

export async function createChildPage(
  provider: VaultProvider,
  parentId: string,
  title = "Untitled Subpage",
) {
  const parent = await provider.getItem(parentId);
  const category = parent?.category ?? "notes";
  const child = await createPageFromTemplate(provider, "blank-page", {
    category,
    parentId,
    title,
  });
  await provider.createRelation({
    sourceId: parentId,
    targetId: child.id,
    relationType: "parent_child",
    label: "Child page",
  });
  return child;
}

export async function createPageFromTemplate(
  provider: VaultProvider,
  templateId: string,
  options: {
    category?: ItemCategory;
    parentId?: string;
    title?: string;
    initialContent?: string;
  } = {},
) {
  const template = TEMPLATES.find((entry) => entry.id === templateId) ?? TEMPLATES[0];
  const category = template.universal ? (options.category ?? template.category) : template.category;
  const type = template.universal ? typeForCategory(category) : template.type;
  const title = options.title ?? template.title;
  const metadata = createTemplateMetadata(template, category, type, title);
  const page = await provider.createItem({
    title,
    category,
    type,
    icon: template.universal ? SPACE_ICONS[category] : template.icon,
    summary: template.summary,
    status: String(template.properties.status ?? "Draft"),
    tags: template.tags,
    properties: template.properties,
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
  await provider.replaceBlocks(page.id, blocks);

  if (template.id === "basic-database") {
    const database = createDefaultDatabaseModel(page.id, page.title);
    return (
      (await provider.updateItem(page.id, {
        metadata: {
          ...page.metadata,
          templateId: template.id,
          database: toDatabaseMetadata(database),
        },
      })) ?? page
    );
  }

  return page;
}

function createTemplateMetadata(
  template: TemplateDefinition,
  category: ItemCategory,
  type: ItemType,
  title: string,
) {
  const base = {
    tags: template.tags,
    ...(template.metadata ?? {}),
    templateId: template.id,
  };

  if (category === "documents" && type === "document") {
    return updateDocumentMetadata({ documentTitle: title, ...base }, { documentTitle: title });
  }

  if (category === "projects" && type === "project") {
    return updateProjectMetadata({ projectTitle: title, ...base }, { projectTitle: title });
  }

  if (category === "tasks" && type === "task") {
    return updateTaskMetadata({ taskTitle: title, ...base }, { taskTitle: title });
  }

  if (category === "people" && type === "person") {
    return updatePersonMetadata({ displayName: title, ...base }, { displayName: title });
  }

  if (category === "people" && type === "interaction") {
    return updateInteractionMetadata(
      { interactionTitle: title, ...base },
      { interactionTitle: title },
    );
  }

  if (category === "finance" && type === "finance") {
    return updateFinanceMetadata({ financeTitle: title, ...base }, { financeTitle: title });
  }

  if (category === "calendar" && type === "calendar") {
    return createDefaultCalendarEventMetadata({ eventTitle: title, ...base });
  }

  if (category === "trackers" && type === "tracker") {
    return updateTrackerMetadata({ trackerTitle: title, ...base }, { trackerTitle: title });
  }

  if (category === "goals" && type === "goal") {
    return updateGoalMetadata({ goalTitle: title, ...base }, { goalTitle: title });
  }

  return base;
}

function normalizeItem(item: MizaanItem | undefined, requestedId: string): MizaanItem {
  if (!item) {
    return {
      id: requestedId,
      type: "note",
      category: "notes",
      title: "Missing page",
      icon: "N",
      summary: "This page could not be found in the current prototype vault.",
      status: "Missing",
      tags: [],
      createdAt: "unknown",
      updatedAt: "unknown",
      properties: {},
      attachedFiles: [],
      metadata: {},
    };
  }

  return {
    ...item,
    icon: item.icon ?? SPACE_ICONS[item.category],
    summary: item.summary ?? "",
    tags: item.tags ?? [],
    properties: item.properties ?? {},
    attachedFiles: item.attachedFiles ?? [],
    metadata: item.metadata ?? {},
  };
}

function buildBreadcrumbs(item: MizaanItem, allItems: MizaanItem[]): Breadcrumb[] {
  const crumbs: Breadcrumb[] = [{ label: "Home", href: "/" }];

  if (item.metadata?.promotedAsSpace === true || item?.id.startsWith("space-")) {
    crumbs.push({ label: item?.title });
    return crumbs;
  }

  crumbs.push({ label: SPACE_LABELS[item.category], href: SPACE_HREFS[item.category] });

  const chain: MizaanItem[] = [];
  const visited = new Set<string>();
  let parentId = item.parentId;

  while (parentId && !visited.has(parentId)) {
    visited.add(parentId);
    const parent = allItems.find((entry) => entry.id === parentId);
    if (!parent) break;
    chain.unshift(parent);
    parentId = parent.parentId;
  }

  chain.forEach((parent) => {
    if (parent.metadata?.promotedAsSpace === true || parent.id.startsWith("space-")) {
      return;
    }
    crumbs.push({ label: parent.title, href: `/page/${parent.id}` });
  });

  crumbs.push({ label: item?.title });
  return crumbs;
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

function resolveRelations(relations: MizaanRelation[], items: MizaanItem[]): ResolvedRelation[] {
  return relations.flatMap((relation) => {
    const source = items.find((item) => item?.id === relation.sourceId);
    const target = items.find((item) => item?.id === relation.targetId);
    if (!source || !target) return [];
    return [{ relation, source, target }];
  });
}
