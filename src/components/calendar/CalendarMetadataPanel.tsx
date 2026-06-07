import { AlertTriangle } from "lucide-react";

import {
  CALENDAR_EVENT_STATUS_VALUES,
  CALENDAR_EVENT_TYPE_VALUES,
  getCalendarEventDisplayFields,
  getCalendarEventStateSummary,
  getCalendarStatusLabel,
  getCalendarTypeLabel,
  normalizeCalendarMetadataForItem,
  toCalendarProperties,
  updateCalendarEventMetadata,
  type CalendarEventStatus,
  type CalendarEventType,
} from "@/lib/calendar/calendar-event";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function CalendarMetadataPanel({
  item,
  provider,
}: {
  item: MizaanItem;
  provider: VaultProvider;
}) {
  const metadata = normalizeCalendarMetadataForItem(item);
  const display = getCalendarEventDisplayFields(metadata);
  const summary = getCalendarEventStateSummary(metadata);

  async function persist(patch: Record<string, unknown>) {
    const next = updateCalendarEventMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.eventTitle || "Untitled event",
      status: getCalendarStatusLabel(next.eventStatus),
      summary: next.notes || item.summary,
      tags: [next.eventType],
      properties: toCalendarProperties(next),
      metadata: next,
    });
  }

  return (
    <section className="rounded-md border hairline bg-background/70 p-3">
      <div className="flex items-start gap-2">
        <div className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-muted text-[12px]">
          C
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Calendar metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed local event. No recurrence, reminders, native notifications, ICS, or
            sync.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Event title"
          value={metadata.eventTitle}
          onChange={(value) => persist({ eventTitle: value })}
        />
        <SelectField
          label="Type"
          value={metadata.eventType}
          options={CALENDAR_EVENT_TYPE_VALUES.map((value) => ({
            value,
            label: getCalendarTypeLabel(value),
          }))}
          onChange={(value) => persist({ eventType: value as CalendarEventType })}
        />
        <SelectField
          label="Status"
          value={metadata.eventStatus}
          options={CALENDAR_EVENT_STATUS_VALUES.map((value) => ({
            value,
            label: getCalendarStatusLabel(value),
          }))}
          onChange={(value) => persist({ eventStatus: value as CalendarEventStatus })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <TextField
            label="Start date"
            type="date"
            value={metadata.startDate}
            onChange={(value) => persist({ startDate: value })}
          />
          <TextField
            label="End date"
            type="date"
            value={metadata.endDate}
            onChange={(value) => persist({ endDate: value })}
          />
        </div>
        <CheckboxField
          label="All-day event"
          checked={metadata.allDay}
          onChange={(value) => persist({ allDay: value })}
        />
        {!metadata.allDay && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            <TextField
              label="Start time"
              type="time"
              value={metadata.startTime}
              onChange={(value) => persist({ startTime: value })}
            />
            <TextField
              label="End time"
              type="time"
              value={metadata.endTime}
              onChange={(value) => persist({ endTime: value })}
            />
          </div>
        )}
        {summary.invalidRange && (
          <div className="rounded-sm border hairline bg-destructive/10 px-2 py-1.5 text-[11.5px] text-destructive">
            This event has an invalid date or time range. It remains editable metadata until fixed.
          </div>
        )}
        <TextField
          label="Location"
          value={metadata.location}
          onChange={(value) => persist({ location: value })}
        />
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
        />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Type" value={display.typeLabel} />
        <StateRow label="Status" value={display.statusLabel} />
        <StateRow label="Date" value={display.dateLabel} />
        <StateRow label="Time" value={display.timeLabel} />
        <StateRow label="Relations" value={`${display.relationCount} normalized IDs`} />
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
        <span>
          Private and sensitive flags are metadata only. They do not encrypt, lock, hide from
          search, or hide from graph in this browser prototype.
        </span>
      </div>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
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
      <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
      <textarea
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${fieldClassName} resize-none`}
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
      <span className="mb-1 block text-[10.5px] font-semibold uppercase tracking-wider text-faint">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClassName}
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
    <label className="flex items-center gap-2 text-[12px] text-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-3.5 w-3.5 rounded border-input bg-background text-foreground focus:ring-ring"
      />
      {label}
    </label>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 rounded-sm bg-muted/25 px-2 py-1">
      <span className="text-faint">{label}</span>
      <span className="truncate text-foreground">{value || "Not set"}</span>
    </div>
  );
}

function splitCsv(value: string) {
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const fieldClassName =
  "w-full rounded-sm border hairline bg-background px-2 py-1.5 text-[12.5px] text-foreground outline-none focus:ring-1 focus:ring-ring";


