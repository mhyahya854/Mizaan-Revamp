import { Boxes, Calendar, FileText, Link2, Tags } from "lucide-react";

import type { PageWorkspaceModel } from "@/lib/page/page-workspace";

export function PageProperties({ model }: { model: PageWorkspaceModel }) {
  const rows = [
    { label: "Type", value: model.properties.type, Icon: FileText },
    { label: "Status", value: model.properties.status, Icon: Boxes },
    {
      label: "Tags",
      value: model.properties.tags.length ? model.properties.tags.join(", ") : "No tags",
      Icon: Tags,
    },
    { label: "Created", value: formatDate(model.properties.createdAt), Icon: Calendar },
    { label: "Updated", value: formatDate(model.properties.updatedAt), Icon: Calendar },
    {
      label: "Links",
      value: `${model.properties.outgoingCount} outgoing / ${model.properties.backlinksCount} incoming`,
      Icon: Link2,
    },
    ...(model.item.type === "database"
      ? [
          {
            label: "Rows",
            value: `${model.properties.databaseRowsCount} rows / ${model.properties.databaseColumnsCount} columns`,
            Icon: Boxes,
          },
        ]
      : []),
  ];

  return (
    <section className="mt-5 grid gap-1 border-b hairline pb-5 text-[12.5px] sm:grid-cols-2">
      {rows.map((row) => (
        <div key={row.label} className="flex min-w-0 items-center gap-2 rounded-sm px-1 py-1">
          <row.Icon className="h-3.5 w-3.5 shrink-0 text-faint" />
          <span className="w-20 shrink-0 text-faint">{row.label}</span>
          <span className="truncate text-foreground/90">{row.value}</span>
        </div>
      ))}
    </section>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

