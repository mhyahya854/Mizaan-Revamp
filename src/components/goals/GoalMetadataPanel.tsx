import { AlertTriangle } from "lucide-react";

import {
  GOAL_HORIZON_VALUES,
  GOAL_PRIORITY_VALUES,
  GOAL_STATUS_VALUES,
  getGoalDisplayFields,
  getGoalHorizonLabel,
  getGoalPriorityLabel,
  getGoalPrivacySummary,
  getGoalStateSummary,
  getGoalStatusLabel,
  normalizeGoalMetadataForItem,
  updateGoalMetadata,
  type GoalHorizon,
  type GoalPriority,
  type GoalStatus,
} from "@/lib/goals/goal-record";
import type { MizaanItem, VaultProvider } from "@/lib/vault/types";

export function GoalMetadataPanel({
  item,
  provider,
}: {
  item: MizaanItem;
  provider: VaultProvider;
}) {
  const metadata = normalizeGoalMetadataForItem(item);
  const display = getGoalDisplayFields(metadata);
  const summary = getGoalStateSummary(metadata);
  const privacy = getGoalPrivacySummary(metadata);

  function persist(patch: Record<string, unknown>) {
    const next = updateGoalMetadata(metadata, patch);
    await provider.updateItem(item.id, {
      title: next.goalTitle || "Untitled goal",
      status: getGoalStatusLabel(next.goalStatus),
      summary: next.notes || item.summary,
      tags: next.tags,
      properties: {
        status: getGoalStatusLabel(next.goalStatus),
        horizon: getGoalHorizonLabel(next.goalHorizon),
        targetDate: next.targetDate,
        progressValue: next.progressValue,
        progressUnit: next.progressUnit,
        priority: getGoalPriorityLabel(next.priority),
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
          G
        </div>
        <div>
          <h3 className="text-[12.5px] font-semibold text-foreground">Goal metadata</h3>
          <p className="mt-0.5 text-[11.5px] leading-relaxed text-faint">
            Provider-backed local goal. No reminders, coaching, charts, or fake progress history.
          </p>
        </div>
      </div>

      <div className="mt-3 space-y-2.5">
        <TextField
          label="Goal title"
          value={metadata.goalTitle}
          onChange={(value) => persist({ goalTitle: value })}
        />
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
          <SelectField
            label="Status"
            value={metadata.goalStatus}
            options={GOAL_STATUS_VALUES.map((value) => ({
              value,
              label: getGoalStatusLabel(value),
            }))}
            onChange={(value) => persist({ goalStatus: value as GoalStatus })}
          />
          <SelectField
            label="Horizon"
            value={metadata.goalHorizon}
            options={GOAL_HORIZON_VALUES.map((value) => ({
              value,
              label: getGoalHorizonLabel(value),
            }))}
            onChange={(value) => persist({ goalHorizon: value as GoalHorizon })}
          />
        </div>
        <SelectField
          label="Priority"
          value={metadata.priority}
          options={GOAL_PRIORITY_VALUES.map((value) => ({
            value,
            label: getGoalPriorityLabel(value),
          }))}
          onChange={(value) => persist({ priority: value as GoalPriority })}
        />
        <div className="grid gap-2 sm:grid-cols-[1fr_88px] lg:grid-cols-1">
          <TextField
            label="Progress"
            value={metadata.progressValue === null ? "" : String(metadata.progressValue)}
            onChange={(value) => persist({ progressValue: value })}
            placeholder="0"
          />
          <TextField
            label="Unit"
            value={metadata.progressUnit}
            onChange={(value) => persist({ progressUnit: value })}
            placeholder="%"
          />
        </div>
        {metadata.progressValueInvalid && (
          <div className="rounded-sm border hairline bg-muted/35 px-2 py-1.5 text-[11.5px] text-soft">
            Progress stays marked invalid until it is a plain number.
          </div>
        )}
        <TextField
          label="Target date"
          value={metadata.targetDate}
          onChange={(value) => persist({ targetDate: value })}
          type="date"
        />
        <TextareaField
          label="Notes"
          value={metadata.notes}
          onChange={(value) => persist({ notes: value })}
        />
      </div>

      <div className="mt-3 grid gap-1.5 text-[11.5px]">
        <StateRow label="Status" value={summary.statusLabel} />
        <StateRow label="Horizon" value={summary.horizonLabel} />
        <StateRow label="Priority" value={summary.priorityLabel} />
        <StateRow label="Progress" value={display.progressLabel} />
        <StateRow label="Overdue" value={summary.overdue ? "Yes" : "No"} />
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
          label="Linked trackers"
          value={metadata.linkedTrackerIds.join(", ")}
          onChange={(value) => persist({ linkedTrackerIds: splitCsv(value) })}
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


