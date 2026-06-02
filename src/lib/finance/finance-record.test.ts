import { describe, expect, it } from "vitest";

import {
  FINANCE_KIND_VALUES,
  FINANCE_STATUS_VALUES,
  PAYMENT_METHOD_VALUES,
  TRANSACTION_TYPE_VALUES,
  computeFinanceTotals,
  createDefaultFinanceMetadata,
  createFinanceRecordInput,
  createTransactionRecordInput,
  getFinanceDisplayFields,
  getFinanceGraphTargets,
  getFinancePrivacySummary,
  getFinanceSearchMetadata,
  getFinanceStateSummary,
  getFinanceStatusLabel,
  isFinanceOverdue,
  isFinanceRecordItem,
  normalizeAmount,
  normalizeCurrency,
  normalizeFinanceKind,
  normalizeFinanceMetadata,
  normalizeFinanceMetadataForItem,
  normalizeFinanceRelationIds,
  normalizeFinanceStatus,
  normalizePaymentMethod,
  normalizeTransactionType,
  updateFinanceMetadata,
} from "./finance-record";
import type { MizaanItem } from "../vault/types";

function item(input: Partial<MizaanItem> = {}): MizaanItem {
  return {
    id: input.id ?? "finance-1",
    type: input.type ?? "finance",
    category: input.category ?? "finance",
    title: input.title ?? "Finance item",
    icon: input.icon ?? "$",
    summary: input.summary ?? "",
    status: input.status ?? "Draft",
    tags: input.tags ?? [],
    createdAt: input.createdAt ?? "2026-06-02T00:00:00.000Z",
    updatedAt: input.updatedAt ?? "2026-06-02T00:00:00.000Z",
    parentId: input.parentId,
    properties: input.properties ?? {},
    attachedFiles: input.attachedFiles ?? [],
    metadata: input.metadata ?? {},
  };
}

describe("finance record model", () => {
  it("creates default transaction metadata without fake banking or accounting claims", () => {
    const metadata = createDefaultFinanceMetadata();

    expect(metadata.financeTitle).toBe("Untitled finance record");
    expect(metadata.financeKind).toBe("transaction");
    expect(metadata.transactionType).toBe("expense");
    expect(metadata.financeStatus).toBe("draft");
    expect(metadata.amount).toBeNull();
    expect(metadata.currency).toBe("MYR");
    expect(metadata.private).toBe(false);
    expect(metadata.sensitive).toBe(false);
    expect(metadata.bankSynced).toBe(false);
    expect(metadata.accountingGrade).toBe(false);
  });

  it("normalizes finance kind, transaction type, status, payment method, currency, and amount", () => {
    expect(normalizeFinanceKind("bill")).toBe("bill");
    expect(normalizeFinanceKind("unsupported")).toBe("transaction");
    expect(normalizeTransactionType("Income")).toBe("income");
    expect(normalizeTransactionType("not-real")).toBe("expense");
    expect(normalizeFinanceStatus("Paid")).toBe("cleared");
    expect(normalizeFinanceStatus("not-real")).toBe("draft");
    expect(normalizePaymentMethod("bank transfer")).toBe("bank-transfer");
    expect(normalizePaymentMethod("not-real")).toBe("unknown");
    expect(normalizeCurrency(" usd ")).toBe("USD");
    expect(normalizeCurrency("bad-symbol")).toBe("MYR");
    expect(normalizeAmount("1,234.50")).toBe(1234.5);
    expect(normalizeAmount("-42.25")).toBe(-42.25);
    expect(normalizeAmount("not a number")).toBeNull();
  });

  it("normalizes minimal metadata, trims strings, and preserves unknown safe fields", () => {
    const metadata = normalizeFinanceMetadata({
      financeTitle: "  Rent payment  ",
      financeKind: "transaction",
      transactionType: "expense",
      financeStatus: "pending",
      amount: " 2000 ",
      currency: " sar ",
      transactionDate: "2026-06-01",
      dueDate: "bad-date",
      category: " Housing ",
      subcategory: " Rent ",
      accountLabel: " Checking ",
      walletLabel: " Main wallet ",
      merchant: " Landlord ",
      payee: " Building Office ",
      payer: " Me ",
      paymentMethod: "card",
      notes: "  June rent  ",
      customSafeField: "kept",
    });

    expect(metadata.financeTitle).toBe("Rent payment");
    expect(metadata.amount).toBe(2000);
    expect(metadata.currency).toBe("SAR");
    expect(metadata.transactionDate).toBe("2026-06-01");
    expect(metadata.dueDate).toBe("");
    expect(metadata.category).toBe("Housing");
    expect(metadata.subcategory).toBe("Rent");
    expect(metadata.accountLabel).toBe("Checking");
    expect(metadata.walletLabel).toBe("Main wallet");
    expect(metadata.merchant).toBe("Landlord");
    expect(metadata.payee).toBe("Building Office");
    expect(metadata.payer).toBe("Me");
    expect(metadata.notes).toBe("June rent");
    expect(metadata.customSafeField).toBe("kept");
  });

  it("updates metadata while preserving unrelated fields", () => {
    const next = updateFinanceMetadata(
      {
        financeTitle: "Old",
        financeKind: "transaction",
        transactionType: "expense",
        financeStatus: "draft",
        customSafeField: "kept",
      },
      {
        financeTitle: "New",
        financeStatus: "cleared",
      },
    );

    expect(next.financeTitle).toBe("New");
    expect(next.financeStatus).toBe("cleared");
    expect(next.customSafeField).toBe("kept");
  });

  it("dedupes relation ids and removes invalid relation ids", () => {
    expect(normalizeFinanceRelationIds(["doc-1", " doc-1 ", "bad id", "", "person:2", 12])).toEqual(
      ["doc-1", "person:2"],
    );

    const metadata = normalizeFinanceMetadata({
      linkedDocumentIds: ["doc-1", "doc-1", "bad id"],
      linkedProjectIds: ["project-1"],
      linkedTaskIds: ["task-1"],
      linkedPersonIds: ["person-1"],
      linkedCalendarEventIds: ["calendar-1"],
    });

    expect(metadata.linkedDocumentIds).toEqual(["doc-1"]);
    expect(getFinanceGraphTargets(metadata)).toEqual([
      {
        targetId: "doc-1",
        sourceField: "linkedDocumentIds",
        edgeType: "document-link",
        label: "Linked document",
      },
      {
        targetId: "project-1",
        sourceField: "linkedProjectIds",
        edgeType: "project-link",
        label: "Linked project",
      },
      {
        targetId: "task-1",
        sourceField: "linkedTaskIds",
        edgeType: "task-link",
        label: "Linked task",
      },
      {
        targetId: "person-1",
        sourceField: "linkedPersonIds",
        edgeType: "person-link",
        label: "Linked person",
      },
      {
        targetId: "calendar-1",
        sourceField: "linkedCalendarEventIds",
        edgeType: "calendar-link",
        label: "Linked calendar event",
      },
    ]);
  });

  it("normalizes private and sensitive flags as metadata-only with an honest privacy summary", () => {
    const summary = getFinancePrivacySummary({ private: "true", sensitive: 1 });

    expect(summary).toMatchObject({
      private: true,
      sensitive: true,
      metadataOnly: true,
      encrypted: false,
      hiddenFromSearch: false,
      hiddenFromGraph: false,
    });
    expect(summary.message).toContain("metadata only");
    expect(summary.message).toContain("not encrypted");
  });

  it("creates provider-compatible finance and transaction inputs", () => {
    const finance = createFinanceRecordInput({
      title: "Monthly budget",
      kind: "budget",
      status: "planned",
      amount: "4500",
      currency: "myr",
      category: "Household",
    });
    const transaction = createTransactionRecordInput({
      title: "Coffee",
      transactionType: "expense",
      amount: "12.50",
      currency: "usd",
      merchant: "Cafe",
    });

    expect(finance).toMatchObject({
      title: "Monthly budget",
      category: "finance",
      type: "finance",
      icon: "$",
      status: "Planned",
    });
    expect(finance.tags).toEqual(["finance", "budget"]);
    expect(finance.metadata?.financeKind).toBe("budget");
    expect(finance.metadata?.amount).toBe(4500);
    expect(transaction.title).toBe("Coffee");
    expect(transaction.metadata?.transactionType).toBe("expense");
    expect(transaction.metadata?.merchant).toBe("Cafe");
  });

  it("detects real finance record items and normalizes older generic finance pages at read time", () => {
    expect(isFinanceRecordItem(item())).toBe(true);
    expect(
      isFinanceRecordItem(
        item({
          metadata: {
            promotedAsSpace: true,
            itemRole: "space",
          },
        }),
      ),
    ).toBe(false);

    const metadata = normalizeFinanceMetadataForItem(
      item({
        title: "Legacy budget",
        status: "Draft",
        tags: ["budget"],
        metadata: {},
      }),
    );

    expect(metadata.financeTitle).toBe("Legacy budget");
    expect(metadata.financeStatus).toBe("draft");
    expect(metadata.tags).toEqual(["budget"]);
  });

  it("exposes display, state, graph, and search metadata safely", () => {
    const metadata = createDefaultFinanceMetadata({
      financeTitle: "BrowserQA rent",
      financeKind: "transaction",
      transactionType: "expense",
      financeStatus: "pending",
      amount: "1500",
      currency: "MYR",
      transactionDate: "2026-06-02",
      dueDate: "2026-06-03",
      category: "Housing",
      merchant: "Landlord",
      accountLabel: "Checking",
      linkedDocumentIds: ["doc-1"],
      private: true,
    });

    expect(getFinanceDisplayFields(metadata)).toMatchObject({
      title: "BrowserQA rent",
      kindLabel: "Transaction",
      transactionTypeLabel: "Expense",
      statusLabel: "Pending",
      amountLabel: "MYR 1,500.00",
      category: "Housing",
      merchant: "Landlord",
      accountLabel: "Checking",
      documentCount: 1,
      private: true,
    });
    expect(getFinanceStateSummary(metadata, "2026-06-04")).toMatchObject({
      overdue: true,
      relationCount: 1,
      metadataOnlyPrivacy: true,
    });
    expect(getFinanceSearchMetadata(metadata).counterparty).toContain("Landlord");
    expect(getFinanceSearchMetadata(metadata).money).toContain("MYR");
  });

  it("computes totals only from real provider-backed transaction records", () => {
    const items = [
      item({
        id: "income-1",
        title: "Salary",
        metadata: createDefaultFinanceMetadata({
          financeKind: "transaction",
          transactionType: "income",
          amount: "5000",
          currency: "MYR",
          financeStatus: "cleared",
        }),
      }),
      item({
        id: "expense-1",
        title: "Rent",
        metadata: createDefaultFinanceMetadata({
          financeKind: "transaction",
          transactionType: "expense",
          amount: "1800",
          currency: "MYR",
          financeStatus: "pending",
        }),
      }),
      item({
        id: "invalid-amount",
        title: "Bad amount",
        metadata: createDefaultFinanceMetadata({
          financeKind: "transaction",
          transactionType: "expense",
          amount: "not-real",
          currency: "MYR",
        }),
      }),
      item({
        id: "budget-1",
        title: "Budget",
        metadata: createDefaultFinanceMetadata({
          financeKind: "budget",
          amount: "10000",
          currency: "MYR",
        }),
      }),
      item({
        id: "space-finance",
        title: "Finance",
        metadata: { promotedAsSpace: true },
      }),
      item({
        id: "note-1",
        category: "notes",
        type: "note",
        title: "Not finance",
        metadata: { amount: 999999 },
      }),
    ];

    expect(computeFinanceTotals(items)).toMatchObject({
      recordCount: 4,
      transactionCount: 3,
      incomeTotal: 5000,
      expenseTotal: 1800,
      netTotal: 3200,
      invalidAmountCount: 1,
      currency: "MYR",
      currencyMixed: false,
    });
  });

  it("handles mixed currencies and deterministic overdue logic", () => {
    const records = [
      item({
        id: "income-usd",
        metadata: createDefaultFinanceMetadata({
          transactionType: "income",
          amount: "100",
          currency: "USD",
        }),
      }),
      item({
        id: "expense-myr",
        metadata: createDefaultFinanceMetadata({
          transactionType: "expense",
          amount: "50",
          currency: "MYR",
        }),
      }),
    ];

    expect(computeFinanceTotals(records)).toMatchObject({
      incomeTotal: 100,
      expenseTotal: 50,
      currencyMixed: true,
      currency: "Mixed",
    });
    expect(
      isFinanceOverdue(
        createDefaultFinanceMetadata({ financeStatus: "pending", dueDate: "2026-06-01" }),
        "2026-06-02",
      ),
    ).toBe(true);
    expect(
      isFinanceOverdue(
        createDefaultFinanceMetadata({ financeStatus: "cleared", dueDate: "2026-06-01" }),
        "2026-06-02",
      ),
    ).toBe(false);
  });

  it("keeps enum value exports stable for UI option lists", () => {
    expect(FINANCE_KIND_VALUES).toContain("transaction");
    expect(FINANCE_KIND_VALUES).toContain("budget");
    expect(FINANCE_KIND_VALUES).toContain("subscription");
    expect(FINANCE_KIND_VALUES).toContain("bill");
    expect(TRANSACTION_TYPE_VALUES).toContain("expense");
    expect(TRANSACTION_TYPE_VALUES).toContain("income");
    expect(FINANCE_STATUS_VALUES).toContain("pending");
    expect(PAYMENT_METHOD_VALUES).toContain("bank-transfer");
    expect(getFinanceStatusLabel("cleared")).toBe("Cleared");
  });
});
