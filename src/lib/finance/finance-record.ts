import type { CreateItemInput, MizaanItem, PropertyValue } from "../vault/types";

export const FINANCE_KIND_VALUES = [
  "transaction",
  "budget",
  "subscription",
  "bill",
  "receipt",
  "reimbursement",
  "general",
] as const;

export type FinanceKind = (typeof FINANCE_KIND_VALUES)[number];

export const TRANSACTION_TYPE_VALUES = [
  "expense",
  "income",
  "transfer",
  "refund",
  "reimbursement",
  "adjustment",
] as const;

export type TransactionType = (typeof TRANSACTION_TYPE_VALUES)[number];

export const FINANCE_STATUS_VALUES = [
  "draft",
  "planned",
  "pending",
  "cleared",
  "overdue",
  "canceled",
  "archived",
] as const;

export type FinanceStatus = (typeof FINANCE_STATUS_VALUES)[number];

export const PAYMENT_METHOD_VALUES = [
  "unknown",
  "cash",
  "card",
  "bank-transfer",
  "wallet",
  "check",
  "other",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHOD_VALUES)[number];

export interface FinanceMetadata extends Record<string, PropertyValue> {
  financeTitle: string;
  financeKind: FinanceKind;
  transactionType: TransactionType;
  financeStatus: FinanceStatus;
  amount: number | null;
  amountInvalid: boolean;
  currency: string;
  transactionDate: string;
  dueDate: string;
  category: string;
  subcategory: string;
  accountLabel: string;
  walletLabel: string;
  merchant: string;
  payee: string;
  payer: string;
  paymentMethod: PaymentMethod;
  recurring: boolean;
  recurringNote: string;
  notes: string;
  private: boolean;
  sensitive: boolean;
  bankSynced: false;
  accountingGrade: false;
  linkedDocumentIds: string[];
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedPersonIds: string[];
  linkedCalendarEventIds: string[];
  tags: string[];
}

export interface CreateFinanceRecordOptions {
  title?: string;
  kind?: FinanceKind | string;
  transactionType?: TransactionType | string;
  status?: FinanceStatus | string;
  amount?: string | number | null;
  currency?: string;
  transactionDate?: string;
  dueDate?: string;
  category?: string;
  subcategory?: string;
  accountLabel?: string;
  walletLabel?: string;
  merchant?: string;
  payee?: string;
  payer?: string;
  paymentMethod?: PaymentMethod | string;
  recurring?: boolean;
  recurringNote?: string;
  notes?: string;
  private?: boolean;
  sensitive?: boolean;
  tags?: string[];
  parentId?: string;
}

export interface FinanceGraphTarget {
  targetId: string;
  sourceField:
    | "linkedDocumentIds"
    | "linkedProjectIds"
    | "linkedTaskIds"
    | "linkedPersonIds"
    | "linkedCalendarEventIds";
  edgeType: "document-link" | "project-link" | "task-link" | "person-link" | "calendar-link";
  label: string;
}

export interface FinanceTotals {
  recordCount: number;
  transactionCount: number;
  incomeTotal: number;
  expenseTotal: number;
  netTotal: number;
  invalidAmountCount: number;
  pendingCount: number;
  overdueCount: number;
  currency: string;
  currencyMixed: boolean;
}

const FINANCE_KIND_LABELS: Record<FinanceKind, string> = {
  transaction: "Transaction",
  budget: "Budget",
  subscription: "Subscription",
  bill: "Bill",
  receipt: "Receipt",
  reimbursement: "Reimbursement",
  general: "General",
};

const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  expense: "Expense",
  income: "Income",
  transfer: "Transfer",
  refund: "Refund",
  reimbursement: "Reimbursement",
  adjustment: "Adjustment",
};

const FINANCE_STATUS_LABELS: Record<FinanceStatus, string> = {
  draft: "Draft",
  planned: "Planned",
  pending: "Pending",
  cleared: "Cleared",
  overdue: "Overdue",
  canceled: "Canceled",
  archived: "Archived",
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  unknown: "Unknown",
  cash: "Cash",
  card: "Card",
  "bank-transfer": "Bank transfer",
  wallet: "Wallet",
  check: "Check",
  other: "Other",
};

const FINANCE_GRAPH_RELATION_FIELDS: Array<{
  field: FinanceGraphTarget["sourceField"];
  edgeType: FinanceGraphTarget["edgeType"];
  label: string;
}> = [
  { field: "linkedDocumentIds", edgeType: "document-link", label: "Linked document" },
  { field: "linkedProjectIds", edgeType: "project-link", label: "Linked project" },
  { field: "linkedTaskIds", edgeType: "task-link", label: "Linked task" },
  { field: "linkedPersonIds", edgeType: "person-link", label: "Linked person" },
  {
    field: "linkedCalendarEventIds",
    edgeType: "calendar-link",
    label: "Linked calendar event",
  },
];

export function createDefaultFinanceMetadata(input: Record<string, unknown> = {}): FinanceMetadata {
  return normalizeFinanceMetadata({
    financeTitle: "Untitled finance record",
    financeKind: "transaction",
    transactionType: "expense",
    financeStatus: "draft",
    amount: null,
    amountInvalid: false,
    currency: "MYR",
    transactionDate: "",
    dueDate: "",
    category: "",
    subcategory: "",
    accountLabel: "",
    walletLabel: "",
    merchant: "",
    payee: "",
    payer: "",
    paymentMethod: "unknown",
    recurring: false,
    recurringNote: "",
    notes: "",
    private: false,
    sensitive: false,
    bankSynced: false,
    accountingGrade: false,
    linkedDocumentIds: [],
    linkedProjectIds: [],
    linkedTaskIds: [],
    linkedPersonIds: [],
    linkedCalendarEventIds: [],
    tags: [],
    ...input,
  });
}

export function normalizeFinanceMetadata(input: unknown): FinanceMetadata {
  const source = isRecord(input) ? input : {};
  const normalized: Record<string, PropertyValue> = {};

  for (const [key, value] of Object.entries(source)) {
    const safeValue = toPropertyValue(value);
    if (safeValue !== undefined) normalized[key] = safeValue;
  }

  const rawTitle = normalizeString(source.financeTitle);
  const amount = normalizeAmount(source.amount);
  const amountInvalid =
    source.amount === undefined || source.amount === null
      ? normalizeBoolean(source.amountInvalid)
      : isInvalidAmount(source.amount);

  return {
    ...normalized,
    financeTitle: rawTitle || "Untitled finance record",
    financeKind:
      source.financeKind === undefined ? "transaction" : normalizeFinanceKind(source.financeKind),
    transactionType:
      source.transactionType === undefined
        ? "expense"
        : normalizeTransactionType(source.transactionType),
    financeStatus:
      source.financeStatus === undefined ? "draft" : normalizeFinanceStatus(source.financeStatus),
    amount,
    amountInvalid,
    currency: normalizeCurrency(source.currency),
    transactionDate: normalizeDateString(source.transactionDate),
    dueDate: normalizeDateString(source.dueDate),
    category: normalizeString(source.category),
    subcategory: normalizeString(source.subcategory),
    accountLabel: normalizeString(source.accountLabel),
    walletLabel: normalizeString(source.walletLabel),
    merchant: normalizeString(source.merchant),
    payee: normalizeString(source.payee),
    payer: normalizeString(source.payer),
    paymentMethod:
      source.paymentMethod === undefined ? "unknown" : normalizePaymentMethod(source.paymentMethod),
    recurring: normalizeBoolean(source.recurring),
    recurringNote: normalizeString(source.recurringNote),
    notes: normalizeString(source.notes),
    private: normalizeBoolean(source.private),
    sensitive: normalizeBoolean(source.sensitive),
    bankSynced: false,
    accountingGrade: false,
    linkedDocumentIds: normalizeFinanceRelationIds(source.linkedDocumentIds),
    linkedProjectIds: normalizeFinanceRelationIds(source.linkedProjectIds),
    linkedTaskIds: normalizeFinanceRelationIds(source.linkedTaskIds),
    linkedPersonIds: normalizeFinanceRelationIds(source.linkedPersonIds),
    linkedCalendarEventIds: normalizeFinanceRelationIds(source.linkedCalendarEventIds),
    tags: normalizeStringArray(source.tags),
  };
}

export function updateFinanceMetadata(
  current: unknown,
  patch: Record<string, unknown>,
): FinanceMetadata {
  const currentMetadata = normalizeFinanceMetadata(current);
  return normalizeFinanceMetadata({ ...currentMetadata, ...patch });
}

export function createFinanceRecordInput(
  options: CreateFinanceRecordOptions = {},
): CreateItemInput {
  const title = normalizeString(options.title) || "Untitled finance record";
  const kind = normalizeFinanceKind(options.kind ?? "transaction");
  const transactionType = normalizeTransactionType(options.transactionType ?? "expense");
  const tags =
    kind === "transaction"
      ? uniqueStrings(["finance", kind, transactionType, ...(options.tags ?? [])])
      : uniqueStrings(["finance", kind, ...(options.tags ?? [])]);
  const metadata = createDefaultFinanceMetadata({
    financeTitle: title,
    financeKind: kind,
    transactionType,
    financeStatus: options.status ?? "draft",
    amount: options.amount ?? null,
    currency: options.currency ?? "MYR",
    transactionDate: options.transactionDate ?? "",
    dueDate: options.dueDate ?? "",
    category: options.category ?? "",
    subcategory: options.subcategory ?? "",
    accountLabel: options.accountLabel ?? "",
    walletLabel: options.walletLabel ?? "",
    merchant: options.merchant ?? "",
    payee: options.payee ?? "",
    payer: options.payer ?? "",
    paymentMethod: options.paymentMethod ?? "unknown",
    recurring: options.recurring ?? false,
    recurringNote: options.recurringNote ?? "",
    notes: options.notes ?? "",
    private: options.private ?? false,
    sensitive: options.sensitive ?? false,
    tags,
  });

  return {
    title: metadata.financeTitle,
    category: "finance",
    type: "finance",
    icon: "$",
    summary: metadata.notes || "Local finance record with provider-backed metadata.",
    status: getFinanceStatusLabel(metadata.financeStatus),
    tags,
    parentId: options.parentId,
    properties: {
      financeKind: getFinanceKindLabel(metadata.financeKind),
      transactionType: getTransactionTypeLabel(metadata.transactionType),
      status: getFinanceStatusLabel(metadata.financeStatus),
      amount: metadata.amount,
      currency: metadata.currency,
      transactionDate: metadata.transactionDate,
      dueDate: metadata.dueDate,
      category: metadata.category,
      private: metadata.private,
      sensitive: metadata.sensitive,
    },
    attachedFiles: [],
    metadata,
  };
}

export function createTransactionRecordInput(
  options: Omit<CreateFinanceRecordOptions, "kind"> = {},
): CreateItemInput {
  return createFinanceRecordInput({ ...options, kind: "transaction" });
}

export function isFinanceRecordItem(
  item: Pick<MizaanItem, "category" | "type" | "metadata">,
): boolean {
  return (
    item.category === "finance" &&
    item.type === "finance" &&
    item.metadata.promotedAsSpace !== true &&
    item.metadata.itemRole !== "space"
  );
}

export function normalizeFinanceMetadataForItem(
  item: Pick<MizaanItem, "title" | "status" | "tags" | "metadata">,
): FinanceMetadata {
  return normalizeFinanceMetadata({
    financeTitle: item.title,
    financeStatus: item.status,
    tags: item.tags,
    ...item.metadata,
  });
}

export function normalizeFinanceKind(value: unknown): FinanceKind {
  return normalizeEnum(value, FINANCE_KIND_VALUES, "transaction");
}

export function normalizeTransactionType(value: unknown): TransactionType {
  return normalizeEnum(value, TRANSACTION_TYPE_VALUES, "expense");
}

export function normalizeFinanceStatus(value: unknown): FinanceStatus {
  const normalized = normalizeString(value).toLowerCase();
  if (normalized === "paid" || normalized === "complete" || normalized === "completed") {
    return "cleared";
  }
  if (normalized === "cancelled") return "canceled";
  return normalizeEnum(value, FINANCE_STATUS_VALUES, "draft");
}

export function normalizePaymentMethod(value: unknown): PaymentMethod {
  const normalized = normalizeString(value).toLowerCase().replace(/_/g, "-");
  if (normalized === "bank transfer") return "bank-transfer";
  return normalizeEnum(normalized, PAYMENT_METHOD_VALUES, "unknown");
}

export function normalizeCurrency(value: unknown): string {
  const normalized = normalizeString(value).toUpperCase();
  return /^[A-Z]{3}$/.test(normalized) ? normalized : "MYR";
}

export function normalizeAmount(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;

  const normalized = value.trim().replace(/,/g, "");
  if (!normalized) return null;
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : null;
}

export function normalizeFinanceRelationIds(value: unknown): string[] {
  const values = Array.isArray(value) ? value : [];
  return uniqueStrings(
    values.flatMap((entry) => {
      if (typeof entry !== "string") return [];
      const normalized = entry.trim();
      if (!isValidItemId(normalized)) return [];
      return [normalized];
    }),
  );
}

export function getFinanceDisplayFields(metadataInput: unknown) {
  const metadata = normalizeFinanceMetadata(metadataInput);
  return {
    title: metadata.financeTitle,
    kindLabel: getFinanceKindLabel(metadata.financeKind),
    transactionTypeLabel: getTransactionTypeLabel(metadata.transactionType),
    statusLabel: getFinanceStatusLabel(metadata.financeStatus),
    paymentMethodLabel: getPaymentMethodLabel(metadata.paymentMethod),
    amountLabel: formatAmount(metadata.amount, metadata.currency),
    amount: metadata.amount,
    amountInvalid: metadata.amountInvalid,
    currency: metadata.currency,
    transactionDate: metadata.transactionDate,
    dueDate: metadata.dueDate,
    category: metadata.category,
    subcategory: metadata.subcategory,
    accountLabel: metadata.accountLabel,
    walletLabel: metadata.walletLabel,
    merchant: metadata.merchant,
    payee: metadata.payee,
    payer: metadata.payer,
    notes: metadata.notes,
    documentCount: metadata.linkedDocumentIds.length,
    projectCount: metadata.linkedProjectIds.length,
    taskCount: metadata.linkedTaskIds.length,
    personCount: metadata.linkedPersonIds.length,
    calendarEventCount: metadata.linkedCalendarEventIds.length,
    relationCount: getFinanceGraphTargets(metadata).length,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getFinanceStateSummary(metadataInput: unknown, today?: string) {
  const metadata = normalizeFinanceMetadata(metadataInput);
  return {
    kindLabel: getFinanceKindLabel(metadata.financeKind),
    transactionTypeLabel: getTransactionTypeLabel(metadata.transactionType),
    statusLabel: getFinanceStatusLabel(metadata.financeStatus),
    amountLabel: formatAmount(metadata.amount, metadata.currency),
    overdue: isFinanceOverdue(metadata, today),
    relationCount: getFinanceGraphTargets(metadata).length,
    metadataOnlyPrivacy: true,
    private: metadata.private,
    sensitive: metadata.sensitive,
  };
}

export function getFinancePrivacySummary(metadataInput: unknown) {
  const metadata = normalizeFinanceMetadata(metadataInput);
  return {
    private: metadata.private,
    sensitive: metadata.sensitive,
    metadataOnly: true,
    encrypted: false,
    hiddenFromSearch: false,
    hiddenFromGraph: false,
    message:
      "Private and sensitive flags are metadata only in this browser prototype; finance content is not encrypted, locked, hidden from search, or hidden from graph.",
  };
}

export function getFinanceGraphTargets(metadataInput: unknown): FinanceGraphTarget[] {
  const metadata = normalizeFinanceMetadata(metadataInput);

  return FINANCE_GRAPH_RELATION_FIELDS.flatMap(({ field, edgeType, label }) =>
    metadata[field].map((targetId) => ({
      targetId,
      sourceField: field,
      edgeType,
      label,
    })),
  );
}

export function getFinanceSearchMetadata(metadataInput: unknown) {
  const metadata = normalizeFinanceMetadata(metadataInput);
  return {
    title: metadata.financeTitle,
    type: [metadata.financeKind, metadata.transactionType, metadata.financeStatus].join(" "),
    counterparty: [metadata.merchant, metadata.payee, metadata.payer].filter(Boolean).join(" "),
    category: [metadata.category, metadata.subcategory, metadata.tags.join(" ")]
      .filter(Boolean)
      .join(" "),
    money: [metadata.amount === null ? "" : String(metadata.amount), metadata.currency]
      .filter(Boolean)
      .join(" "),
    dates: [metadata.transactionDate, metadata.dueDate].filter(Boolean).join(" "),
    account: [metadata.accountLabel, metadata.walletLabel, metadata.paymentMethod]
      .filter(Boolean)
      .join(" "),
    notes: [metadata.notes, metadata.recurringNote].filter(Boolean).join(" "),
    relations: getFinanceGraphTargets(metadata)
      .map((target) => target.targetId)
      .join(" "),
    privacy: `metadata-only private:${metadata.private} sensitive:${metadata.sensitive}`,
  };
}

export function computeFinanceTotals(items: MizaanItem[], today?: string): FinanceTotals {
  const records = items.filter(
    (candidate) => isFinanceRecordItem(candidate) && !candidate.archivedAt && !candidate.deletedAt,
  );
  const transactions = records
    .map((record) => normalizeFinanceMetadataForItem(record))
    .filter((metadata) => metadata.financeKind === "transaction");
  const validTransactions = transactions.filter((metadata) => metadata.amount !== null);
  const currencies = uniqueStrings(validTransactions.map((metadata) => metadata.currency));
  const incomeTotal = sumBy(validTransactions, (metadata) =>
    metadata.transactionType === "income" ? Math.abs(metadata.amount ?? 0) : 0,
  );
  const expenseTotal = sumBy(validTransactions, (metadata) =>
    metadata.transactionType === "expense" ? Math.abs(metadata.amount ?? 0) : 0,
  );

  return {
    recordCount: records.length,
    transactionCount: transactions.length,
    incomeTotal,
    expenseTotal,
    netTotal: incomeTotal - expenseTotal,
    invalidAmountCount: transactions.filter((metadata) => metadata.amountInvalid).length,
    pendingCount: transactions.filter((metadata) => metadata.financeStatus === "pending").length,
    overdueCount: transactions.filter((metadata) => isFinanceOverdue(metadata, today)).length,
    currency: currencies.length > 1 ? "Mixed" : (currencies[0] ?? "MYR"),
    currencyMixed: currencies.length > 1,
  };
}

export function isFinanceOverdue(metadataInput: unknown, today?: string): boolean {
  const metadata = normalizeFinanceMetadata(metadataInput);
  if (!metadata.dueDate) return false;
  if (["cleared", "canceled", "archived"].includes(metadata.financeStatus)) return false;
  const currentDate = normalizeDateString(today) || new Date().toISOString().slice(0, 10);
  return metadata.dueDate < currentDate;
}

export function getFinanceKindLabel(kind: FinanceKind): string {
  return FINANCE_KIND_LABELS[kind];
}

export function getTransactionTypeLabel(type: TransactionType): string {
  return TRANSACTION_TYPE_LABELS[type];
}

export function getFinanceStatusLabel(status: FinanceStatus): string {
  return FINANCE_STATUS_LABELS[status];
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return PAYMENT_METHOD_LABELS[method];
}

function formatAmount(amount: number | null, currency: string): string {
  if (amount === null) return "No amount recorded";
  return `${currency} ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function isInvalidAmount(value: unknown): boolean {
  if (value === null || value === undefined || value === "") return false;
  return normalizeAmount(value) === null;
}

function sumBy<T>(values: T[], getValue: (value: T) => number) {
  return values.reduce((total, value) => total + getValue(value), 0);
}

function normalizeEnum<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
  fallback: T[number],
): T[number] {
  const normalized = normalizeString(value).toLowerCase();
  return allowed.includes(normalized) ? normalized : fallback;
}

function normalizeString(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number" || typeof value === "boolean") return String(value).trim();
  return "";
}

function normalizeDateString(value: unknown): string {
  const normalized = normalizeString(value);
  if (!normalized) return "";
  return /^\d{4}-\d{2}-\d{2}$/.test(normalized) ? normalized : "";
}

function normalizeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return uniqueStrings(value.map(normalizeString).filter(Boolean));
}

function normalizeBoolean(value: unknown): boolean {
  if (value === true || value === 1) return true;
  if (typeof value === "string") return value.trim().toLowerCase() === "true";
  return false;
}

function uniqueStrings(values: string[]): string[] {
  return values
    .map((value) => value.trim())
    .filter(Boolean)
    .filter((value, index, array) => array.indexOf(value) === index);
}

function isValidItemId(value: string): boolean {
  return /^[A-Za-z0-9._:-]+$/.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function toPropertyValue(value: unknown): PropertyValue | undefined {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    const arrayValue = value.flatMap((entry) => {
      const safeValue = toPropertyValue(entry);
      return safeValue === undefined ? [] : [safeValue];
    });
    return arrayValue;
  }
  if (isRecord(value)) {
    const result: Record<string, PropertyValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      const safeValue = toPropertyValue(entry);
      if (safeValue !== undefined) result[key] = safeValue;
    }
    return result;
  }
  return undefined;
}
