import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, Briefcase, Calendar, FileText, HardDrive, Target } from "lucide-react";

import { PageTemplatePicker } from "@/components/page/PageTemplatePicker";
import { createPageFromTemplate } from "@/lib/page/page-workspace";
import { useVaultProvider, useVaultSnapshot } from "@/lib/vault/use-vault";
import type { ItemCategory, MizaanItem } from "@/lib/vault/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Home - Mizaan" },
      {
        name: "description",
        content:
          "Your local Mizaan home for recent pages, prototype vault health, and quick capture.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const provider = useVaultProvider();
  const snapshot = useVaultSnapshot();
  const navigate = useNavigate();
  const [capture, setCapture] = useState("");
  const [templateCategory, setTemplateCategory] = useState<ItemCategory | undefined>();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const activeItems = snapshot.items
    .filter((item) => !item.archivedAt && !item.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  const recent = activeItems.slice(0, 6);
  const projects = activeItems.filter((item) => item.category === "projects").slice(0, 4);
  const events = activeItems.filter((item) => item.category === "calendar").slice(0, 4);
  const trackers = activeItems.filter((item) => item.category === "trackers").slice(0, 4);

  function createPage(templateId: string, category?: ItemCategory, content = "", title?: string) {
    const item = createPageFromTemplate(provider, templateId, {
      category,
      initialContent: content,
      title,
    });
    navigate({ to: "/page/$id", params: { id: item.id } });
    setTemplateCategory(undefined);
  }

  function openTemplatePicker(category: ItemCategory) {
    setTemplateCategory(category);
  }

  function saveCapture() {
    const text = capture.trim();
    if (!text) return;
    createPage("blank-note", "notes", text, text.slice(0, 72));
    setCapture("");
  }

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pb-24 pt-14 md:px-10">
      <p className="text-[12.5px] uppercase tracking-wider text-faint">{today}</p>
      <h1 className="mt-2 font-editorial text-[44px] leading-[1.05] tracking-normal text-foreground">
        Good morning.
      </h1>
      <p className="mt-3 max-w-[52ch] text-[15px] text-soft">
        A quiet local workspace for pages, records, and links. The active storage is still a browser
        localStorage prototype, not the final portable vault.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        <QuickAction icon="N" label="New note" onClick={() => openTemplatePicker("notes")} />
        <QuickAction icon="P" label="New project" onClick={() => openTemplatePicker("projects")} />
        <QuickAction
          icon="D"
          label="Document record"
          onClick={() => openTemplatePicker("documents")}
        />
        <QuickAction
          icon="$"
          label="Finance record"
          onClick={() => openTemplatePicker("finance")}
        />
        <QuickAction
          icon="C"
          label="Calendar event"
          onClick={() => openTemplatePicker("calendar")}
        />
      </div>

      <section className="mt-10 rounded-md border hairline bg-surface p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-medium">
              <HardDrive className="h-3.5 w-3.5 text-faint" />
              Prototype vault health
            </div>
            <p className="mt-1 text-[12.5px] text-faint">{snapshot.providerInfo.warning}</p>
          </div>
          <Link to="/vault" className="shrink-0 text-[12px] text-faint hover:text-foreground">
            Open Vault
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-[12px]">
          <MiniStat label="Items" value={String(snapshot.health.itemCount)} />
          <MiniStat label="Blocks" value={String(snapshot.health.blockCount)} />
          <MiniStat label="Relations" value={String(snapshot.health.relationCount)} />
        </div>
      </section>

      <section className="mt-12">
        <Header title="Recently updated" to="/notes" cta="Open notes" Icon={FileText} />
        <ul className="mt-3 divide-y hairline border-y hairline">
          {recent.map((item) => (
            <li key={item.id}>
              <Link
                to="/page/$id"
                params={{ id: item.id }}
                className="flex items-center gap-3 px-1 py-2.5 hover:bg-muted/50"
              >
                <span className="w-5 text-center text-[13px] opacity-80">{item.icon}</span>
                <span className="min-w-0 flex-1 truncate text-[14px]">{item.title}</span>
                <span className="hidden truncate text-[12px] text-faint sm:inline">
                  {labelFor(item.category)}
                </span>
                <span className="ml-3 shrink-0 text-[12px] text-faint">
                  {formatDate(item.updatedAt)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <Header title="Active projects" to="/projects" cta="All projects" Icon={Briefcase} />
          <SimpleList items={projects} empty="No project pages yet." />
        </section>

        <section>
          <Header title="Calendar records" to="/calendar" cta="Open calendar" Icon={Calendar} />
          <SimpleList items={events} empty="No calendar records yet." />

          <div className="mt-8">
            <Header title="Trackers" to="/trackers" cta="View all" Icon={Target} />
            <SimpleList items={trackers} empty="No tracker pages yet." />
          </div>
        </section>
      </div>

      <section className="mt-14 border-t hairline pt-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-editorial text-[18px]">Quick capture</h3>
          <button
            onClick={saveCapture}
            disabled={!capture.trim()}
            className="rounded-sm border hairline px-2 py-1 text-[12px] text-soft hover:bg-muted disabled:cursor-not-allowed disabled:opacity-45"
          >
            Save as note
          </button>
        </div>
        <textarea
          value={capture}
          onChange={(event) => setCapture(event.target.value)}
          className="mt-3 w-full resize-none rounded-sm border hairline bg-surface px-3 py-3 text-[14px] leading-relaxed outline-none focus:ring-1 focus:ring-ring"
          rows={3}
          placeholder="Capture a thought and save it as a real local note."
        />
      </section>
      <PageTemplatePicker
        open={Boolean(templateCategory)}
        category={templateCategory}
        items={snapshot.items}
        onClose={() => setTemplateCategory(undefined)}
        onSelect={(templateId) => createPage(templateId, templateCategory)}
      />
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-sm border hairline bg-surface px-2.5 py-1.5 text-[13px] hover:bg-muted"
    >
      <span className="text-[12px] opacity-80">{icon}</span>
      {label}
    </button>
  );
}

function Header({
  title,
  to,
  cta,
  Icon,
}: {
  title: string;
  to: "/" | "/notes" | "/projects" | "/calendar" | "/trackers";
  cta: string;
  Icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[13px] text-soft">
        <Icon className="h-3.5 w-3.5 text-faint" />
        <span className="font-medium text-foreground">{title}</span>
      </div>
      <Link
        to={to}
        className="flex items-center gap-1 text-[12px] text-faint hover:text-foreground"
      >
        {cta} <ArrowUpRight className="h-3 w-3" />
      </Link>
    </div>
  );
}

function SimpleList({ items, empty }: { items: MizaanItem[]; empty: string }) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <Link
            to="/page/$id"
            params={{ id: item.id }}
            className="flex items-center gap-3 rounded-sm border hairline bg-surface px-3 py-2 hover:bg-muted/30"
          >
            <span className="w-5 text-center text-[14px] opacity-80">{item.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px]">{item.title}</div>
              <div className="text-[11.5px] text-faint">{item.status ?? "No status"}</div>
            </div>
          </Link>
        </li>
      ))}
      {!items.length && (
        <li className="rounded-sm border border-dashed hairline px-3 py-4 text-[12.5px] text-faint">
          {empty}
        </li>
      )}
    </ul>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border hairline bg-background/60 px-2 py-2">
      <div className="text-[10.5px] uppercase tracking-wider text-faint">{label}</div>
      <div className="mt-1 font-mono text-[14px] text-foreground">{value}</div>
    </div>
  );
}

function labelFor(category: ItemCategory) {
  const labels: Record<ItemCategory, string> = {
    notes: "Notes",
    documents: "Documents",
    projects: "Projects",
    people: "People",
    finance: "Finance",
    calendar: "Calendar",
    trackers: "Trackers",
    databases: "Databases",
    templates: "Templates",
  };
  return labels[category];
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
