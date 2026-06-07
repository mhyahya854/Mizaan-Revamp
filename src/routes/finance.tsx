import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertTriangle, DollarSign, FilePlus2, Search } from "lucide-react";
import { useMemo, useState } from "react";

import {
  computeFinanceTotals,
  createFinanceRecordInput,
  createTransactionRecordInput,
  getFinanceDisplayFields,
  getFinancePrivacySummary,
  getFinanceStateSummary,
  isFinanceRecordItem,
  normalizeFinanceMetadataForItem,
} from "@/lib/finance/finance-record";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/finance")({
  head: () => ({ meta: [{ title: "Finance - Mizaan" }] }),
  component: FinancePage,
});

function FinancePage() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const financeSpace = snapshot.items.find(
    (item) =>
      item.category === "finance" &&
      item.metadata.promotedAsSpace === true &&
      item.metadata.itemRole === "space",
  );
  const financeRecords = useMemo(
    () =>
      snapshot.items
        .filter((item) => isFinanceRecordItem(item) && !item.archivedAt && !item.deletedAt)
        .filter((item) => (q ? searchableFinanceText(item).includes(q) : true))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [q, snapshot.items],
  );
  const totals = computeFinanceTotals(financeRecords);
  const privateFlagCount = financeRecords.filter((item) => {
    const metadata = normalizeFinanceMetadataForItem(item);
    return metadata.private || metadata.sensitive;
  }).length;
  const recurringCount = financeRecords.filter((item) => {
    const metadata = normalizeFinanceMetadataForItem(item);
    return metadata.recurring;
  }).length;

  function createRecord(
    preset: NonNullable<Parameters<typeof createFinanceRecordInput>[0]>,
    blocksTitle = "Finance notes",
  ) {
    const item = await provider.createItem(
      createFinanceRecordInput({
        parentId: financeSpace?.id,
        ...preset,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: blocksTitle },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This is a local metadata record only. Bank sync, imports, receipt OCR, tax reports, and accounting-grade ledger behavior are not implemented.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  function createTransaction(
    title: string,
    transactionType: "expense" | "income",
    category: string,
  ) {
    const item = await provider.createItem(
      createTransactionRecordInput({
        parentId: financeSpace?.id,
        title,
        transactionType,
        status: "draft",
        category,
      }),
    );
    await provider.replaceBlocks(item.id, [
      { type: "heading1", content: "Transaction notes" },
      { type: "paragraph", content: "" },
      {
        type: "callout",
        content:
          "This transaction is local metadata. It does not connect to banks, payment providers, tax tools, or accounting systems.",
      },
    ]);
    navigate({ to: "/page/$id", params: { id: item.id } });
  }

  return (
    <div className="mx-auto w-full max-w-[1120px] px-6 pb-24 pt-12 md:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[12px] uppercase tracking-wider text-faint">
            Local finance foundation
          </p>
          <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Finance</h1>
          <p className="mt-1 max-w-2xl text-[13.5px] leading-relaxed text-soft">
            Finance records are provider-backed local items in the current browser/localStorage
            prototype. The route supports typed transaction, budget, bill, subscription, and
            reimbursement metadata without claiming bank sync, imports, tax, or accounting-grade
            accuracy.
          </p>
        </div>
        <button
          onClick={() => createTransaction("Expense - Untitled", "expense", "")}
          className="inline-flex items-center gap-1.5 rounded-sm bg-foreground px-2.5 py-1.5 text-[12.5px] text-background hover:opacity-90"
        >
          <FilePlus2 className="h-3.5 w-3.5" />
          New expense
        </button>
      </header>

      <section className="mt-6 grid gap-3 md:grid-cols-4">
        <StatCard label="Records" value={String(totals.recordCount)} detail="real local items" />
        <StatCard
          label="Transactions"
          value={String(totals.transactionCount)}
          detail={`${totals.pendingCount} pending`}
        />
        <StatCard
          label="Net"
          value={formatTotal(totals.netTotal, totals)}
          detail="income minus expense"
        />
        <StatCard
          label="Review"
          value={String(totals.overdueCount + totals.invalidAmountCount)}
          detail="overdue or invalid"
        />
      </section>

      <section className="mt-5 rounded-md border hairline bg-surface px-4 py-3">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm border hairline bg-background">
            <DollarSign className="h-4 w-4 text-soft" />
          </span>
          <div>
            <h2 className="text-[13px] font-semibold text-foreground">Current finance truth</h2>
            <p className="mt-1 text-[12.5px] leading-relaxed text-soft">
              Counts and totals come only from local provider records. Mixed-currency totals are
              marked instead of converted. Private/sensitive flags are metadata only and do not
              encrypt, lock, hide from search, or hide from graph.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Create finance record
        </h2>
        <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
          <CreateButton
            title="Expense"
            detail="Draft outgoing transaction"
            onClick={() => createTransaction("Expense - Untitled", "expense", "")}
          />
          <CreateButton
            title="Income"
            detail="Draft incoming transaction"
            onClick={() => createTransaction("Income - Untitled", "income", "")}
          />
          <CreateButton
            title="Bill"
            detail="Due date metadata"
            onClick={() =>
              createRecord(
                { title: "Bill - Untitled", kind: "bill", status: "pending" },
                "Bill notes",
              )
            }
          />
          <CreateButton
            title="Subscription"
            detail="Recurring metadata"
            onClick={() =>
              createRecord(
                {
                  title: "Subscription - Untitled",
                  kind: "subscription",
                  status: "pending",
                  recurring: true,
                },
                "Subscription notes",
              )
            }
          />
          <CreateButton
            title="Budget"
            detail="Planning record"
            onClick={() =>
              createRecord(
                { title: "Budget - Untitled", kind: "budget", status: "planned" },
                "Budget notes",
              )
            }
          />
          <CreateButton
            title="Reimbursement"
            detail="Money owed metadata"
            onClick={() =>
              createRecord(
                {
                  title: "Reimbursement - Untitled",
                  kind: "reimbursement",
                  transactionType: "reimbursement",
                  status: "pending",
                },
                "Reimbursement notes",
              )
            }
          />
        </div>
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2 border-b hairline pb-2 text-[12.5px] text-soft">
        <div className="flex items-center gap-1.5 rounded-sm border hairline bg-surface px-2 py-1">
          <Search className="h-3.5 w-3.5 text-faint" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search finance, merchant, category, amount, date"
            className="w-80 max-w-[68vw] bg-transparent text-[12.5px] outline-none placeholder:text-faint"
          />
        </div>
        <span className="-mb-[9px] rounded-sm border-b-2 border-foreground px-2 py-1 pb-[9px] text-foreground">
          Finance records
        </span>
        <span className="text-faint">{financeRecords.length} local records</span>
        <span className="text-faint">{privateFlagCount} private/sensitive flags</span>
        <span className="text-faint">{recurringCount} recurring metadata</span>
      </div>

      {financeRecords.length > 0 ? (
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {financeRecords.map((item) => (
            <FinanceCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-5 rounded-md border border-dashed hairline bg-surface px-5 py-8 text-center">
          <h2 className="font-editorial text-[24px]">No finance records yet</h2>
          <p className="mx-auto mt-2 max-w-xl text-[13px] leading-relaxed text-soft">
            Create a provider-backed finance record now. Bank import, open banking, payment APIs,
            receipt OCR, budgets with automation, tax reports, and accounting ledgers are
            intentionally not shown as working controls in this phase.
          </p>
          <button
            onClick={() => createTransaction("Expense - Untitled", "expense", "")}
            className="mt-4 rounded-sm bg-foreground px-3 py-1.5 text-[12.5px] text-background hover:opacity-90"
          >
            New expense
          </button>
        </div>
      )}
    </div>
  );
}

function FinanceCard({ item }: { item: MizaanItem }) {
  const metadata = normalizeFinanceMetadataForItem(item);
  const display = getFinanceDisplayFields(metadata);
  const summary = getFinanceStateSummary(metadata);
  const privacy = getFinancePrivacySummary(metadata);

  return (
    <article className="rounded-md border hairline bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-sm border hairline text-[12px]">
          {item.icon ?? "$"}
        </span>
        <div className="min-w-0 flex-1">
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="block truncate text-[15px] font-medium hover:underline"
          >
            {display.title}
          </Link>
          <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-soft">
            {metadata.notes || item.summary || "Provider-backed local finance record."}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5 text-[11px]">
        <Badge>{display.kindLabel}</Badge>
        <Badge>{display.transactionTypeLabel}</Badge>
        <Badge>{display.statusLabel}</Badge>
        {summary.overdue && <Badge>Overdue</Badge>}
        {metadata.private && <Badge>Private metadata</Badge>}
        {metadata.sensitive && <Badge>Sensitive metadata</Badge>}
      </div>

      <dl className="mt-3 grid gap-x-4 gap-y-1.5 text-[12px] sm:grid-cols-2">
        <Meta label="Amount" value={display.amountLabel} />
        <Meta label="Date" value={display.transactionDate || "Not set"} />
        <Meta label="Due" value={display.dueDate || "Not set"} />
        <Meta label="Category" value={display.category || "Not set"} />
        <Meta
          label="Counterparty"
          value={display.merchant || display.payee || display.payer || "Not set"}
        />
        <Meta label="Account" value={display.accountLabel || display.walletLabel || "Not set"} />
        <Meta label="Payment" value={display.paymentMethodLabel} />
        <Meta label="Relations" value={String(display.relationCount)} />
      </dl>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/25 px-2 py-2 text-[11.5px] leading-relaxed text-faint">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>
          {privacy.private || privacy.sensitive
            ? "Privacy flags are metadata only. This record remains visible to current search and graph foundations."
            : "Metadata-only local finance record; no sync, import, receipt OCR, tax, or accounting system is active."}
        </span>
      </div>
    </article>
  );
}

function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-md border hairline bg-surface px-4 py-3">
      <div className="text-[11px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 truncate text-[26px] font-semibold leading-none">{value}</div>
      <div className="mt-1 text-[12px] text-faint">{detail}</div>
    </div>
  );
}

function CreateButton({
  title,
  detail,
  onClick,
}: {
  title: string;
  detail: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-sm border hairline bg-surface px-3 py-2 text-left hover:bg-muted/40"
    >
      <span className="block text-[13px] text-foreground">{title}</span>
      <span className="block text-[11.5px] text-faint">{detail}</span>
    </button>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border hairline bg-background px-2 py-0.5 text-faint">
      {children}
    </span>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-faint">{label}</dt>
      <dd className="truncate text-soft">{value}</dd>
    </div>
  );
}

function formatTotal(value: number, totals: ReturnType<typeof computeFinanceTotals>) {
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return totals.currencyMixed ? `${formatted} mixed` : `${totals.currency} ${formatted}`;
}

function searchableFinanceText(item: MizaanItem) {
  const metadata = normalizeFinanceMetadataForItem(item);
  return [
    item.title,
    item.summary,
    item.status,
    item.tags.join(" "),
    metadata.financeTitle,
    metadata.financeKind,
    metadata.transactionType,
    metadata.financeStatus,
    metadata.amount === null ? "" : String(metadata.amount),
    metadata.currency,
    metadata.transactionDate,
    metadata.dueDate,
    metadata.category,
    metadata.subcategory,
    metadata.accountLabel,
    metadata.walletLabel,
    metadata.merchant,
    metadata.payee,
    metadata.payer,
    metadata.paymentMethod,
    metadata.recurringNote,
    metadata.notes,
    metadata.linkedDocumentIds.join(" "),
    metadata.linkedProjectIds.join(" "),
    metadata.linkedTaskIds.join(" "),
    metadata.linkedPersonIds.join(" "),
    metadata.linkedCalendarEventIds.join(" "),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}


