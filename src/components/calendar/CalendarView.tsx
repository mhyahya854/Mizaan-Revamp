import { useMemo, useState } from "react";
import {
  AlignLeft,
  Calendar as CalendarIcon,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ListTodo,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import {
  buildAgendaEvents,
  buildCalendarDays,
  buildCalendarRangeLabel,
  createCalendarEventInput,
  filterActiveCalendarEvents,
  formatDateKey,
  normalizeCalendarEvent,
  shiftCalendarDate,
  type CalendarViewMode,
  type NormalizedCalendarEvent,
} from "@/lib/calendar/calendar-events";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { MizaanItem } from "@/lib/vault/types";
import { cn } from "@/lib/utils";

const TAG_OPTIONS = [
  "event",
  "task-deadline",
  "project-milestone",
  "bill-due",
  "appointment",
  "class",
  "study",
  "personal",
  "finance",
  "reminder-note",
  "unknown",
];
const STATUS_OPTIONS = ["Planned", "Confirmed", "Tentative", "Completed", "Cancelled", "Archived"];
const DAY_HOURS = Array.from({ length: 14 }, (_, index) => 7 + index);

export function CalendarView() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [view, setView] = useState<CalendarViewMode>("month");
  const [selectedTags, setSelectedTags] = useState<string[]>(TAG_OPTIONS);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(STATUS_OPTIONS);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MizaanItem | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(formatDateKey(new Date()));
  const [formEndDate, setFormEndDate] = useState(formatDateKey(new Date()));
  const [formStartTime, setFormStartTime] = useState("09:00");
  const [formEndTime, setFormEndTime] = useState("10:00");
  const [formSummary, setFormSummary] = useState("");
  const [formTag, setFormTag] = useState("event");
  const [formStatus, setFormStatus] = useState("Planned");
  const [formAllDay, setFormAllDay] = useState(false);

  const events = useMemo(() => filterActiveCalendarEvents(snapshot.items), [snapshot.items]);
  const allTags = useMemo(() => {
    const tags = new Set(TAG_OPTIONS);
    events.forEach((event) => tags.add(event.tag));
    return Array.from(tags);
  }, [events]);
  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) => selectedTags.includes(event.tag) && selectedStatuses.includes(event.status),
      ),
    [events, selectedStatuses, selectedTags],
  );
  const calendarDays = useMemo(
    () => buildCalendarDays(view, currentDate, filteredEvents),
    [currentDate, filteredEvents, view],
  );
  const agendaEvents = useMemo(() => buildAgendaEvents(filteredEvents), [filteredEvents]);
  const dayModel = useMemo(
    () => buildCalendarDays("day", currentDate, filteredEvents)[0],
    [currentDate, filteredEvents],
  );

  function goRelative(direction: -1 | 1) {
    setCurrentDate((date) => shiftCalendarDate(view, date, direction));
  }

  function openNewEventModal(date?: string, startTime?: string) {
    const dateKey = date || formatDateKey(currentDate);
    setEditingEvent(null);
    setFormTitle("");
    setFormDate(dateKey);
    setFormEndDate(dateKey);
    setFormStartTime(startTime || "09:00");
    setFormEndTime(startTime ? nextHourLabel(startTime) : "10:00");
    setFormSummary("");
    setFormTag("event");
    setFormStatus("Planned");
    setFormAllDay(false);
    setShowEventModal(true);
  }

  function openEditEventModal(event: MizaanItem) {
    const normalized = normalizeCalendarEvent(event);
    setEditingEvent(event);
    setFormTitle(event.title);
    setFormDate(normalized.startDate);
    setFormEndDate(normalized.endDate);
    setFormStartTime(normalized.startTime || "09:00");
    setFormEndTime(normalized.endTime || "10:00");
    setFormSummary(event.summary || "");
    setFormTag(normalized.tag);
    setFormStatus(normalized.status);
    setFormAllDay(normalized.allDay);
    setShowEventModal(true);
  }

  function handleSaveEvent(event: React.FormEvent) {
    event.preventDefault();
    if (!formTitle.trim() || !formDate) return;

    const input = createCalendarEventInput({
      title: formTitle,
      date: formDate,
      endDate: formEndDate || formDate,
      startTime: formStartTime,
      endTime: formEndTime,
      summary: formSummary,
      tag: formTag,
      status: formStatus,
      allDay: formAllDay,
    });

    if (editingEvent) {
      provider.updateItem(editingEvent.id, {
        title: input.title,
        icon: input.icon,
        summary: input.summary,
        status: input.status,
        tags: input.tags,
        properties: input.properties,
        metadata: {
          ...editingEvent.metadata,
          ...input.metadata,
        },
      });
    } else {
      provider.createItem(input);
    }
    setShowEventModal(false);
  }

  function handleDeleteEvent(eventId: string) {
    const confirmed = window.confirm("Move this event to trash?");
    if (!confirmed) return;
    provider.trashItem(eventId);
    setShowEventModal(false);
  }

  return (
    <div className="flex h-[calc(100vh-2.75rem)] w-full overflow-hidden bg-background text-foreground">
      <CalendarFilters
        tags={allTags}
        selectedTags={selectedTags}
        statuses={STATUS_OPTIONS}
        selectedStatuses={selectedStatuses}
        onToggleTag={(tag) => setSelectedTags((tags) => toggleValue(tags, tag))}
        onToggleStatus={(status) =>
          setSelectedStatuses((statuses) => toggleValue(statuses, status))
        }
        onCreate={() => openNewEventModal()}
      />

      <section className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <CalendarHeader
          label={buildCalendarRangeLabel(view, currentDate)}
          view={view}
          onViewChange={setView}
          onPrevious={() => goRelative(-1)}
          onNext={() => goRelative(1)}
          onToday={() => setCurrentDate(new Date())}
          onCreate={() => openNewEventModal()}
        />

        <div className="min-h-0 flex-1 overflow-y-auto scrollbar-thin">
          {view === "month" && (
            <MonthCalendar
              currentDate={currentDate}
              days={calendarDays}
              onCreate={openNewEventModal}
              onEdit={openEditEventModal}
            />
          )}
          {view === "week" && (
            <WeekCalendar
              days={calendarDays}
              onCreate={openNewEventModal}
              onEdit={openEditEventModal}
            />
          )}
          {view === "day" && dayModel && (
            <DayCalendar day={dayModel} onCreate={openNewEventModal} onEdit={openEditEventModal} />
          )}
          {view === "agenda" && (
            <AgendaCalendar events={agendaEvents} onEdit={openEditEventModal} />
          )}
        </div>
      </section>

      {showEventModal && (
        <CalendarEventDialog
          editingEvent={editingEvent}
          title={formTitle}
          date={formDate}
          endDate={formEndDate}
          startTime={formStartTime}
          endTime={formEndTime}
          summary={formSummary}
          tag={formTag}
          status={formStatus}
          allDay={formAllDay}
          onTitleChange={setFormTitle}
          onDateChange={(date) => {
            setFormDate(date);
            if (!formEndDate || formEndDate < date) setFormEndDate(date);
          }}
          onEndDateChange={setFormEndDate}
          onStartTimeChange={setFormStartTime}
          onEndTimeChange={setFormEndTime}
          onSummaryChange={setFormSummary}
          onTagChange={setFormTag}
          onStatusChange={setFormStatus}
          onAllDayChange={setFormAllDay}
          onClose={() => setShowEventModal(false)}
          onSubmit={handleSaveEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
}

function CalendarFilters({
  tags,
  selectedTags,
  statuses,
  selectedStatuses,
  onToggleTag,
  onToggleStatus,
  onCreate,
}: {
  tags: string[];
  selectedTags: string[];
  statuses: string[];
  selectedStatuses: string[];
  onToggleTag: (tag: string) => void;
  onToggleStatus: (status: string) => void;
  onCreate: () => void;
}) {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r hairline bg-sidebar/35 p-4 md:flex">
      <button
        onClick={onCreate}
        className="flex w-full items-center justify-center gap-2 rounded-sm border hairline bg-surface px-4 py-2 text-[13px] font-medium shadow-sm transition-colors hover:bg-muted"
      >
        <Plus className="h-4 w-4 text-soft" />
        <span>Create event</span>
      </button>

      <FilterGroup title="Calendars">
        {tags.map((tag) => (
          <CheckRow
            key={tag}
            label={tag}
            checked={selectedTags.includes(tag)}
            markerClassName={tagMarkerClass(tag)}
            onChange={() => onToggleTag(tag)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Status">
        {statuses.map((status) => (
          <CheckRow
            key={status}
            label={status}
            checked={selectedStatuses.includes(status)}
            onChange={() => onToggleStatus(status)}
          />
        ))}
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 border-t hairline pt-4 first:border-t-0 first:pt-0">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-faint">{title}</div>
      <div className="mt-3 space-y-2">{children}</div>
    </div>
  );
}

function CheckRow({
  label,
  checked,
  markerClassName,
  onChange,
}: {
  label: string;
  checked: boolean;
  markerClassName?: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[12.5px] transition-colors hover:text-foreground">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-3.5 w-3.5 rounded border-input bg-background text-foreground focus:ring-ring"
      />
      {markerClassName && <span className={cn("h-2.5 w-2.5 rounded-full", markerClassName)} />}
      <span className="capitalize">{label}</span>
    </label>
  );
}

function CalendarHeader({
  label,
  view,
  onViewChange,
  onPrevious,
  onNext,
  onToday,
  onCreate,
}: {
  label: string;
  view: CalendarViewMode;
  onViewChange: (view: CalendarViewMode) => void;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onCreate: () => void;
}) {
  return (
    <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b hairline bg-background px-4 py-2">
      <div className="flex min-w-0 items-center gap-3">
        <CalendarIcon className="h-5 w-5 shrink-0 text-soft" />
        <h1 className="truncate text-[16px] font-semibold text-foreground">{label}</h1>
        <div className="ml-1 flex items-center gap-0.5 rounded-sm border hairline bg-surface/70 p-0.5">
          <button
            onClick={onPrevious}
            className="grid h-7 w-7 place-items-center rounded-sm hover:bg-muted"
            aria-label="Previous calendar range"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={onToday}
            className="rounded-sm px-2 py-0.5 text-[12px] font-medium hover:bg-muted"
          >
            Today
          </button>
          <button
            onClick={onNext}
            className="grid h-7 w-7 place-items-center rounded-sm hover:bg-muted"
            aria-label="Next calendar range"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex rounded-sm border hairline bg-surface/70 p-0.5 text-[12px]">
          {(["month", "week", "day", "agenda"] as CalendarViewMode[]).map((entry) => (
            <button
              key={entry}
              onClick={() => onViewChange(entry)}
              className={cn(
                "rounded-sm px-3 py-1 font-medium capitalize transition-colors",
                view === entry ? "bg-muted text-foreground" : "text-soft hover:bg-muted/50",
              )}
            >
              {entry}
            </button>
          ))}
        </div>
        <button
          onClick={onCreate}
          className="grid h-8 w-8 place-items-center rounded-sm border hairline bg-surface hover:bg-muted md:hidden"
          aria-label="Create event"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}

function MonthCalendar({
  currentDate,
  days,
  onCreate,
  onEdit,
}: {
  currentDate: Date;
  days: ReturnType<typeof buildCalendarDays>;
  onCreate: (date: string) => void;
  onEdit: (event: MizaanItem) => void;
}) {
  return (
    <div className="grid min-h-[640px] grid-cols-7 grid-rows-[auto_repeat(6,minmax(88px,1fr))] border-b border-r hairline">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div
          key={day}
          className="border-b border-l hairline bg-sidebar/20 py-1.5 text-center text-[11px] font-semibold uppercase tracking-wider text-faint"
        >
          {day}
        </div>
      ))}
      {days.map((day) => (
        <DayCell
          key={day.dateKey}
          day={day}
          currentMonth={currentDate.getMonth()}
          onCreate={onCreate}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

function DayCell({
  day,
  currentMonth,
  onCreate,
  onEdit,
}: {
  day: ReturnType<typeof buildCalendarDays>[number];
  currentMonth: number;
  onCreate: (date: string) => void;
  onEdit: (event: MizaanItem) => void;
}) {
  const events = [...day.allDayEvents, ...day.timedEvents];
  const isCurrentMonth = day.date.getMonth() === currentMonth;
  const isToday = day.dateKey === formatDateKey(new Date());

  return (
    <div
      className={cn(
        "group min-h-[88px] border-b border-l hairline p-1.5 transition-colors hover:bg-muted/20",
        isCurrentMonth ? "bg-background" : "bg-sidebar/10 text-faint",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid h-6 w-6 place-items-center rounded-full text-[12px] font-semibold",
            isToday ? "bg-foreground text-background" : "text-foreground",
          )}
        >
          {day.date.getDate()}
        </span>
        <button
          onClick={() => onCreate(day.dateKey)}
          className="rounded-sm p-0.5 text-faint opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
          title="Add event to day"
        >
          <Plus className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-1 max-h-[78px] space-y-1 overflow-y-auto scrollbar-none">
        {events.map((event) => (
          <EventPill key={event.item.id} event={event} onEdit={onEdit} compact />
        ))}
      </div>
    </div>
  );
}

function WeekCalendar({
  days,
  onCreate,
  onEdit,
}: {
  days: ReturnType<typeof buildCalendarDays>;
  onCreate: (date: string) => void;
  onEdit: (event: MizaanItem) => void;
}) {
  return (
    <div className="grid min-h-[520px] grid-cols-7 border-b border-r hairline">
      {days.map((day) => {
        const events = [...day.allDayEvents, ...day.timedEvents];
        return (
          <div
            key={day.dateKey}
            className="group flex flex-col border-l hairline bg-background p-3"
          >
            <DayHeading date={day.date} dateKey={day.dateKey} />
            <div className="min-h-0 flex-1 space-y-2 overflow-y-auto scrollbar-thin">
              {events.map((event) => (
                <EventPill key={event.item.id} event={event} onEdit={onEdit} />
              ))}
              <button
                onClick={() => onCreate(day.dateKey)}
                className="flex w-full items-center justify-center gap-1.5 rounded-sm border border-dashed hairline p-2 text-[11.5px] text-faint opacity-0 transition-all hover:bg-muted hover:text-foreground group-hover:opacity-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add event</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DayCalendar({
  day,
  onCreate,
  onEdit,
}: {
  day: ReturnType<typeof buildCalendarDays>[number];
  onCreate: (date: string, startTime?: string) => void;
  onEdit: (event: MizaanItem) => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-5">
      <DayHeading date={day.date} dateKey={day.dateKey} large />
      <section className="mt-5 rounded-md border hairline bg-surface">
        <header className="border-b hairline px-4 py-3">
          <h2 className="text-[12px] font-semibold uppercase tracking-wider text-faint">
            All-day events
          </h2>
        </header>
        <div className="space-y-2 p-3">
          {day.allDayEvents.map((event) => (
            <EventPill key={event.item.id} event={event} onEdit={onEdit} />
          ))}
          {!day.allDayEvents.length && (
            <div className="rounded-sm border border-dashed hairline px-3 py-4 text-center text-[13px] text-faint">
              No all-day events for this day.
            </div>
          )}
        </div>
      </section>

      <section className="mt-5 overflow-hidden rounded-md border hairline bg-surface">
        {DAY_HOURS.map((hour) => {
          const hourLabel = `${String(hour).padStart(2, "0")}:00`;
          const matching = day.timedEvents.filter((event) =>
            event.startTime.startsWith(hourLabel.slice(0, 2)),
          );
          return (
            <div
              key={hourLabel}
              className="grid grid-cols-[72px_1fr] border-b hairline last:border-b-0"
            >
              <button
                onClick={() => onCreate(day.dateKey, hourLabel)}
                className="border-r hairline px-3 py-3 text-left font-mono text-[11px] text-faint transition-colors hover:bg-muted hover:text-foreground"
              >
                {hourLabel}
              </button>
              <div className="min-h-[56px] space-y-2 px-3 py-2">
                {matching.map((event) => (
                  <EventPill key={event.item.id} event={event} onEdit={onEdit} />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function AgendaCalendar({
  events,
  onEdit,
}: {
  events: NormalizedCalendarEvent[];
  onEdit: (event: MizaanItem) => void;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h2 className="mb-4 text-[12px] font-bold uppercase tracking-wider text-faint">
        Upcoming agenda events
      </h2>
      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <AgendaCard key={event.item.id} event={event} onEdit={onEdit} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed hairline p-8 text-center text-soft">
          <CalendarIcon className="mx-auto mb-2 h-8 w-8 text-faint" />
          <p className="text-[13.5px]">No events match your current filter settings.</p>
        </div>
      )}
    </div>
  );
}

function DayHeading({
  date,
  dateKey,
  large = false,
}: {
  date: Date;
  dateKey: string;
  large?: boolean;
}) {
  const isToday = dateKey === formatDateKey(new Date());
  return (
    <div className="flex flex-col items-center border-b hairline pb-2">
      <span className="text-[11px] font-bold uppercase tracking-wider text-faint">
        {date.toLocaleDateString("en-US", { weekday: "short" })}
      </span>
      <span
        className={cn(
          "mt-1 grid place-items-center rounded-full font-bold",
          large ? "h-10 w-10 text-[18px]" : "h-8 w-8 text-[15px]",
          isToday ? "bg-foreground text-background" : "text-foreground",
        )}
      >
        {date.getDate()}
      </span>
    </div>
  );
}

function EventPill({
  event,
  onEdit,
  compact = false,
}: {
  event: NormalizedCalendarEvent;
  onEdit: (event: MizaanItem) => void;
  compact?: boolean;
}) {
  return (
    <button
      onClick={() => onEdit(event.item)}
      className={cn(
        "flex w-full flex-col rounded-sm border px-2 text-left font-medium transition-colors hover:bg-muted",
        tagSurfaceClass(event.tag),
        compact ? "py-1 text-[11px]" : "py-2 text-[12px]",
      )}
    >
      <span className="truncate leading-tight">{event.item.title}</span>
      <span className="mt-0.5 flex items-center gap-1 text-[10px] font-normal opacity-75">
        <Clock className="h-3 w-3" />
        {event.allDay
          ? "All day"
          : `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""}`}
      </span>
    </button>
  );
}

function AgendaCard({
  event,
  onEdit,
}: {
  event: NormalizedCalendarEvent;
  onEdit: (event: MizaanItem) => void;
}) {
  return (
    <button
      onClick={() => onEdit(event.item)}
      className="flex w-full flex-col gap-2 rounded-md border hairline bg-surface p-4 text-left transition-colors hover:bg-muted/40"
    >
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-[15px] font-semibold text-foreground">{event.item.title}</h3>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10.5px] font-semibold capitalize",
            tagSurfaceClass(event.tag),
          )}
        >
          {event.tag}
        </span>
      </div>
      <div className="flex flex-wrap gap-4 text-[12.5px] text-soft">
        <IconLabel icon={CalendarDays} label={event.startDate} />
        <IconLabel
          icon={Clock}
          label={
            event.allDay
              ? "All day"
              : `${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""}`
          }
        />
        <IconLabel icon={ListTodo} label={event.status} />
      </div>
      {event.item.summary && (
        <p className="mt-1 border-t hairline pt-2 text-[13px] leading-relaxed text-soft">
          {event.item.summary}
        </p>
      )}
    </button>
  );
}

function IconLabel({
  icon: Icon,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 text-faint" />
      <span>{label}</span>
    </div>
  );
}

function CalendarEventDialog({
  editingEvent,
  title,
  date,
  endDate,
  startTime,
  endTime,
  summary,
  tag,
  status,
  allDay,
  onTitleChange,
  onDateChange,
  onEndDateChange,
  onStartTimeChange,
  onEndTimeChange,
  onSummaryChange,
  onTagChange,
  onStatusChange,
  onAllDayChange,
  onClose,
  onSubmit,
  onDelete,
}: {
  editingEvent: MizaanItem | null;
  title: string;
  date: string;
  endDate: string;
  startTime: string;
  endTime: string;
  summary: string;
  tag: string;
  status: string;
  allDay: boolean;
  onTitleChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onAllDayChange: (value: boolean) => void;
  onClose: () => void;
  onSubmit: (event: React.FormEvent) => void;
  onDelete: (eventId: string) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-md border hairline bg-popover p-5 shadow-popover">
        <header className="flex items-center justify-between border-b hairline pb-3">
          <h2 className="text-[15px] font-bold text-foreground">
            {editingEvent ? "Edit calendar event" : "Create calendar event"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-sm p-1 text-faint transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <Field label="Event title">
            <input
              type="text"
              required
              placeholder="Planning review"
              value={title}
              onChange={(event) => onTitleChange(event.target.value)}
              className={fieldClassName}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input
                type="date"
                required
                value={date}
                onChange={(event) => onDateChange(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field label="End date">
              <input
                type="date"
                required
                value={endDate}
                min={date}
                onChange={(event) => onEndDateChange(event.target.value)}
                className={fieldClassName}
              />
            </Field>
          </div>

          <label className="flex items-center gap-2 text-[12.5px] text-soft">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(event) => onAllDayChange(event.target.checked)}
              className="h-3.5 w-3.5 rounded border-input bg-background text-foreground focus:ring-ring"
            />
            All-day event
          </label>

          {!allDay && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start time">
                <input
                  type="time"
                  value={startTime}
                  onChange={(event) => onStartTimeChange(event.target.value)}
                  className={fieldClassName}
                />
              </Field>
              <Field label="End time">
                <input
                  type="time"
                  value={endTime}
                  onChange={(event) => onEndTimeChange(event.target.value)}
                  className={fieldClassName}
                />
              </Field>
            </div>
          )}

          <Field label="Category tag">
            <div className="flex flex-wrap gap-1.5">
              {TAG_OPTIONS.map((entry) => (
                <button
                  key={entry}
                  type="button"
                  onClick={() => onTagChange(entry)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11.5px] font-semibold capitalize transition-all",
                    tag === entry
                      ? "border-foreground bg-foreground text-background"
                      : tagSurfaceClass(entry),
                  )}
                >
                  {tag === entry && <Check className="h-3.5 w-3.5" />}
                  <span>{entry}</span>
                </button>
              ))}
            </div>
          </Field>

          <Field label="Event status">
            <select
              value={status}
              onChange={(event) => onStatusChange(event.target.value)}
              className={fieldClassName}
            >
              {STATUS_OPTIONS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Description">
            <textarea
              rows={3}
              placeholder="Event details or notes..."
              value={summary}
              onChange={(event) => onSummaryChange(event.target.value)}
              className={cn(fieldClassName, "resize-none")}
            />
          </Field>

          <footer className="mt-4 flex items-center justify-between border-t hairline pt-3">
            <div>
              {editingEvent && (
                <button
                  type="button"
                  onClick={() => onDelete(editingEvent.id)}
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-destructive transition-colors hover:opacity-80"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Move to trash</span>
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-sm border hairline bg-surface px-4 py-2 text-[12.5px] font-medium text-foreground transition-colors hover:bg-muted"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-sm bg-foreground px-4 py-2 text-[12.5px] font-medium text-background transition-opacity hover:opacity-90"
              >
                {editingEvent ? "Save changes" : "Create event"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

const fieldClassName =
  "w-full rounded-sm border hairline bg-background px-3 py-2 text-[13.5px] text-foreground outline-none focus:ring-1 focus:ring-ring";

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((entry) => entry !== value) : [...values, value];
}

function tagMarkerClass(tag: string) {
  const classes: Record<string, string> = {
    review: "bg-tag-amber",
    work: "bg-tag-blue",
    personal: "bg-tag-green",
    finance: "bg-tag-rose",
    other: "bg-tag-stone",
  };
  return classes[tag] ?? classes.other;
}

function tagSurfaceClass(tag: string) {
  const classes: Record<string, string> = {
    review: "border-tag-amber/40 bg-tag-amber/10 text-foreground",
    work: "border-tag-blue/40 bg-tag-blue/10 text-foreground",
    personal: "border-tag-green/40 bg-tag-green/10 text-foreground",
    finance: "border-tag-rose/40 bg-tag-rose/10 text-foreground",
    other: "border-tag-stone/40 bg-tag-stone/10 text-foreground",
  };
  return classes[tag] ?? classes.other;
}

function nextHourLabel(value: string) {
  const [hour] = value.split(":").map(Number);
  if (!Number.isFinite(hour)) return "10:00";
  return `${String(Math.min(hour + 1, 23)).padStart(2, "0")}:00`;
}
