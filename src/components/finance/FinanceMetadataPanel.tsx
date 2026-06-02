import { AlertTriangle } from "lucide-react";

import {
  FINANCE_KIND_VALUES,
  FINANCE_STATUS_VALUES,
  PAYMENT_METHOD_VALUES,
  TRANSACTION_TYPE_VALUES,
  getFinanceDisplayFields,
  getFinanceKindLabel,
  getFinancePrivacySummary,
  getFinanceStateSummary,
  getFinanceStatusLabel,
  getPaymentMethodLabel,
  getTransactionTypeLabel,
  normalizeFinanceMetadataForItem,
  updateFinanceMetadata,
  type FinanceKind,
  type FinanceStatus,
  type PaymentMethod,
  type TransactionType,
} from "@/lib/finance/finance-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function FinanceMetadataPanel({
  item,
  provider,
}: {
  item: MizaanItem;
  provider: VaultProvider;
}) {
  const metadata = normalizeFinanceMetadataForItem(item);
  const display = getFinanceDisplayFields(metadata);
  const summary = getFinanceStateSummary(metadata);
  const privacy = getFinancePrivacySummary(metadata);

  function persist(patch: Record<string, unknown>) {
    const next = updateFinanceMetadata(metadata, patch);
    provider.updateItem(item.id, {
      title: next.financeTitle || "Untitled finance record",
      status: getFinanceStatusLabel(next.financeStatus),
      summary: next.notes || item.summary,
      tags: next.tags,
      properties: {
        financeKind: getFinanceKindLabel(next.financeKind),
        transactionType: getTransactionTypeLabel(next.transactionType),
        status: getFinanceStatusLabel(next.financeStatus),
        amount: next.amount,
        currency: next.currency,
        transactionDate: next.transactionDate,
        dueDate: next.dueDate,
        category: next.category,
        private: next.private,
        sensitive: next.sensitive,
      },
      metadata: next,
    });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          $
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Finance metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed local finance record. No bank sync, imports, OCR, tax, or accounting.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Finance title"
          value={metadata.financeTitle}
          onChange={(value) => persist({ financeTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Kind"
            value={metadata.financeKind}
            options={FINANCE_KIND_VALUES.map((value) => ({
              value,
              label: getFinanceKindLabel(value),
            }))}
            onChange={(value) => persist({ financeKind: value as FinanceKind })}
          />
          <SelectField
            label="Status"
            value={metadata.financeStatus}
            options={FINANCE_STATUS_VALUES.map((value) => ({
              value,
              label: getFinanceStatusLabel(value),
            }))}
            onChange={(value) => persist({ financeStatus: value as FinanceStatus })}
          />
        </div>
        <SelectField
          label="Transaction type"
          value={metadata.transactionType}
          options={TRANSACTION_TYPE_VALUES.map((value) => ({
            value,
            label: getTransactionTypeLabel(value),
          }))}
          onChange={(value) => persist({ transactionType: value as TransactionType })}
        />
        <div className="grid gap-2 sm:grid-cols-[1fr_88px] lg:grid-cols-1">
          <TextField
            label="Amount"
            value={metadata.amount === null ? "" : String(metadata.amount)}
            onChange={(value) => persist({ amount: value })}
            placeholder="0.00"
          />
          <TextField
            label="Currency"
            value={metadata.currency}
            onChange={(value) => persist({ currency: value })}
            placeholder="MYR"
          />
        </div>
        {metadata.amountInvalid && (
          <div className="rounded-sm border hairline bg-muted/35 px-2 py-1.5 text-[11.5px] text-soft">
            Amount is stored as invalid metadata until it is a plain number such as 1200 or 1200.50.
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Transaction date"
            value={metadata.transactionDate}
            onChange={(value) => persist({ transactionDate: value })}
            type="date"
          />
          <TextField
            label="Due date"
            value={metadata.dueDate}
            onChange={(value) => persist({ dueDate: value })}
            type="date"
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Category"
            value={metadata.category}
            onChange={(value) => persist({ category: value })}
          />
          <TextField
            label="Subcategory"
            value={metadata.subcategory}
            onChange={(value) => persist({ subcategory: value })}
          />
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Account label"
            value={metadata.accountLabel}
            onChange={(value) => persist({ accountLabel: value })}
          />
          <TextField
            label="Wallet label"
            value={metadata.walletLabel}
            onChange={(value) => persist({ walletLabel: value })}
          />
        </div>
        <TextField
          label="Merchant"
          value={metadata.merchant}
          onChange={(value) => persist({ merchant: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Payee"
            value={metadata.payee}
            onChange={(value) => persist({ payee: value })}
          />
          <TextField
            label="Payer"
            value={metadata.payer}
            onChange={(value) => persist({ payer: value })}
          />
        </div>
        <SelectField
          label="Payment method"
          value={metadata.paymentMethod}
          options={PAYMENT_METHOD_VALUES.map((value) => ({
            value,
            label: getPaymentMethodLabel(value),
          }))}
          onChange={(value) => persist({ paymentMethod: value as PaymentMethod })}
        />
        <CheckboxField
          label="Recurring metadata"
          checked={metadata.recurring}
          onChange={(value) => persist({ recurring: value })}
        />
        <TextField
          label="Recurring note"
          value={metadata.recurringNote}
          onChange={(value) => persist({ recurringNote: value })}
        />
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
        />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Kind" value={summary.kindLabel} />
        <StateRow label="Type" value={summary.transactionTypeLabel} />
        <StateRow label="Status" value={summary.statusLabel} />
        <StateRow label="Amount" value={summary.amountLabel} />
        <StateRow label="Overdue" value={summary.overdue ? "Yes" : "No"} />
        <StateRow label="Relations" value={`${display.relationCount} normalized IDs`} />
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Linked documents"
          value={metadata.linkedDocumentIds.join(", ")}
          onChange={(value) => persist({ linkedDocumentIds: splitCsv(value) })}
          placeholder="doc-1, receipt-2"
        />
        <TextField
          label="Linked projects"
          value={metadata.linkedProjectIds.join(", ")}
          onChange={(value) => persist({ linkedProjectIds: splitCsv(value) })}
        />
        <TextField
          label="Linked tasks"
          value={metadata.linkedTaskIds.join(", ")}
          onChange={(value) => persist({ linkedTaskIds: splitCsv(value) })}
        />
        <TextField
          label="Linked people"
          value={metadata.linkedPersonIds.join(", ")}
          onChange={(value) => persist({ linkedPersonIds: splitCsv(value) })}
        />
        <TextField
          label="Linked calendar"
          value={metadata.linkedCalendarEventIds.join(", ")}
          onChange={(value) => persist({ linkedCalendarEventIds: splitCsv(value) })}
        />
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
        <CheckboxField
          label="Private metadata flag"
          checked={metadata.private}
          onChange={(value) => persist({ private: value })}
        />
        <CheckboxField
          label="Sensitive metadata flag"
          checked={metadata.sensitive}
          onChange={(value) => persist({ sensitive: value })}
        />
      </div>

      <div className="mt-3 flex gap-2 rounded-sm border hairline bg-muted/35 px-2 py-2 text-[11.5px] leading-relaxed text-soft">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" />
        <span>{privacy.message}</span>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "date";
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-1 min-h-[68px] w-full resize-y rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none placeholder:text-faint"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 rounded-sm border hairline bg-surface px-2 py-1.5 text-[12.5px] text-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>{label}</span>
    </label>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1">
      <span className="text-faint">{label}</span>
      <span className="truncate font-medium text-soft">{value}</span>
    </div>
  );
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}
