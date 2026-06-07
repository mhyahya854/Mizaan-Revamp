import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import {
  TRACKER_FREQUENCY_VALUES,
  TRACKER_STATUS_VALUES,
  TRACKER_TYPE_VALUES,
  addTrackerCheckIn,
  getTrackerDisplayFields,
  getTrackerFrequencyLabel,
  getTrackerPrivacySummary,
  getTrackerStateSummary,
  getTrackerStatusLabel,
  getTrackerTypeLabel,
  normalizeTrackerMetadataForItem,
  updateTrackerMetadata,
  type TrackerFrequency,
  type TrackerStatus,
  type TrackerType,
} from "@/lib/trackers/tracker-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function TrackerMetadataPanel({
  item,
  provider,
}: {
  item: MizaanItem;
  provider: VaultProvider;
}) {
  const metadata = normalizeTrackerMetadataForItem(item);
  const display = getTrackerDisplayFields(metadata);
  const summary = getTrackerStateSummary(metadata);
  const privacy = getTrackerPrivacySummary(metadata);
  const [checkInDate, setCheckInDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [checkInValue, setCheckInValue] = useState("");
  const [checkInNote, setCheckInNote] = useState("");

  async function persist(patch: Record<string, unknown>) {
    const next = updateTrackerMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.trackerTitle || "Untitled tracker",
      status: getTrackerStatusLabel(next.trackerStatus),
      summary: next.notes || item.summary,
      tags: next.tags,
      properties: {
        trackerType: getTrackerTypeLabel(next.trackerType),
        status: getTrackerStatusLabel(next.trackerStatus),
        frequency: getTrackerFrequencyLabel(next.frequency),
        targetValue: next.targetValue,
        currentValue: next.currentValue,
        unit: next.unit,
        private: next.private,
        sensitive: next.sensitive,
      },
      metadata: next,
    });
  }

  async function addCheckIn() {
    const next = addTrackerCheckIn(metadata, {
      date: checkInDate,
      value: checkInValue,
      note: checkInNote,
    });
    await provider.updateItem(item.id, {
      status: getTrackerStatusLabel(next.trackerStatus),
      properties: {
        ...item.properties,
        currentValue: next.currentValue,
        checkInCount: next.checkIns.length,
      },
      metadata: next,
    });
    setCheckInValue("");
    setCheckInNote("");
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          T
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Tracker metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed local tracker. No fake streaks, charts, reminders, or notifications.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Tracker title"
          value={metadata.trackerTitle}
          onChange={(value) => persist({ trackerTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Type"
            value={metadata.trackerType}
            options={TRACKER_TYPE_VALUES.map((value) => ({
              value,
              label: getTrackerTypeLabel(value),
            }))}
            onChange={(value) => persist({ trackerType: value as TrackerType })}
          />
          <SelectField
            label="Status"
            value={metadata.trackerStatus}
            options={TRACKER_STATUS_VALUES.map((value) => ({
              value,
              label: getTrackerStatusLabel(value),
            }))}
            onChange={(value) => persist({ trackerStatus: value as TrackerStatus })}
          />
        </div>
        <SelectField
          label="Frequency"
          value={metadata.frequency}
          options={TRACKER_FREQUENCY_VALUES.map((value) => ({
            value,
            label: getTrackerFrequencyLabel(value),
          }))}
          onChange={(value) => persist({ frequency: value as TrackerFrequency })}
        />
        <div className="grid gap-2 sm:grid-cols-[1fr_1fr_82px] lg:grid-cols-1">
          <TextField
            label="Current"
            value={metadata.currentValue === null ? "" : String(metadata.currentValue)}
            onChange={(value) => persist({ currentValue: value })}
            placeholder="0"
          />
          <TextField
            label="Target"
            value={metadata.targetValue === null ? "" : String(metadata.targetValue)}
            onChange={(value) => persist({ targetValue: value })}
            placeholder="0"
          />
          <TextField
            label="Unit"
            value={metadata.unit}
            onChange={(value) => persist({ unit: value })}
            placeholder="pages"
          />
        </div>
        {(metadata.currentValueInvalid || metadata.targetValueInvalid) && (
          <div className="rounded-sm border hairline bg-muted/35 px-2 py-1.5 text-[11.5px] text-soft">
            Current and target values stay marked invalid until they are plain numbers.
          </div>
        )}
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Start date"
            value={metadata.startDate}
            onChange={(value) => persist({ startDate: value })}
            type="date"
          />
          <TextField
            label="End date"
            value={metadata.endDate}
            onChange={(value) => persist({ endDate: value })}
            type="date"
          />
        </div>
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
        />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Type" value={summary.typeLabel} />
        <StateRow label="Status" value={summary.statusLabel} />
        <StateRow label="Frequency" value={summary.frequencyLabel} />
        <StateRow label="Progress" value={display.progressLabel} />
        <StateRow label="Check-ins" value={`${summary.checkInCount} real entries`} />
        <StateRow label="Relations" value={`${display.relationCount} normalized IDs`} />
      </div>

      <div className="mt-3 rounded-sm border hairline bg-surface px-2 py-2">
        <div className="text-[11px] font-medium uppercase tracking-wider text-faint">
          Add check-in
        </div>
        <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr] lg:grid-cols-1">
          <TextField label="Date" value={checkInDate} onChange={setCheckInDate} type="date" />
          <TextField
            label="Value"
            value={checkInValue}
            onChange={setCheckInValue}
            placeholder="0"
          />
        </div>
        <TextField
          label="Note"
          value={checkInNote}
          onChange={setCheckInNote}
          placeholder="Optional"
        />
        <button
          onClick={addCheckIn}
          className="mt-2 rounded-sm bg-foreground px-2 py-1 text-[11.5px] text-background hover:opacity-90"
        >
          Add real check-in
        </button>
      </div>

      <div className="mt-3 space-y-2.5">
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
          label="Linked documents"
          value={metadata.linkedDocumentIds.join(", ")}
          onChange={(value) => persist({ linkedDocumentIds: splitCsv(value) })}
        />
        <TextField
          label="Linked finance"
          value={metadata.linkedFinanceIds.join(", ")}
          onChange={(value) => persist({ linkedFinanceIds: splitCsv(value) })}
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
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-medium uppercase tracking-wider text-faint">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
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


