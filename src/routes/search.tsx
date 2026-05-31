import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { buildSearchResults, highlightMatches, type SearchResult } from "@/lib/search/search-index";
import { useVaultSnapshot } from "@/lib/vault/use-vault";
import type { ItemCategory, ItemType } from "@/lib/vault/types";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Search - Mizaan" }] }),
  component: SearchPage,
});

function SearchPage() {
  const snapshot = useVaultSnapshot();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ItemCategory>("all");
  const [type, setType] = useState<"all" | ItemType>("all");
  const [status, setStatus] = useState("all");
  const [tag, setTag] = useState("all");
  const q = query.trim();

  const activeItems = useMemo(
    () => snapshot.items.filter((item) => !item.archivedAt && !item.deletedAt),
    [snapshot.items],
  );
  const categoryOptions = unique(activeItems.map((item) => item.category));
  const typeOptions = unique(activeItems.map((item) => item.type));
  const statusOptions = unique(activeItems.flatMap((item) => (item.status ? [item.status] : [])));
  const tagOptions = unique(activeItems.flatMap((item) => item.tags));
  const results = buildSearchResults(snapshot, {
    query: q,
    categories: category === "all" ? undefined : [category],
    types: type === "all" ? undefined : [type],
    statuses: status === "all" ? undefined : [status],
    tags: tag === "all" ? undefined : [tag],
  });
  const filtered = Boolean(
    q || category !== "all" || type !== "all" || status !== "all" || tag !== "all",
  );

  return (
    <div className="mx-auto w-full max-w-[900px] px-6 pb-24 pt-12 md:px-10">
      <p className="text-[12px] uppercase tracking-wider text-faint">Local pages</p>
      <h1 className="mt-1 font-editorial text-[34px] tracking-normal">Search</h1>
      <p className="mt-1 text-[13.5px] text-soft">
        Search covers provider page titles, summaries, statuses, categories, types, tags, metadata,
        properties, and current block content. Results stay inside the active local prototype vault.
      </p>

      <label className="mt-6 flex items-center gap-2 rounded-md border hairline bg-surface px-3 py-2">
        <Search className="h-4 w-4 text-faint" />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search titles, tags, metadata, and block text"
          className="h-8 min-w-0 flex-1 bg-transparent text-[14px] outline-none placeholder:text-faint"
        />
      </label>

      <div className="mt-3 grid gap-2 sm:grid-cols-4">
        <SearchSelect
          label="Category"
          value={category}
          onChange={(value) => setCategory(value as "all" | ItemCategory)}
        >
          <option value="all">All categories</option>
          {categoryOptions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </SearchSelect>
        <SearchSelect
          label="Type"
          value={type}
          onChange={(value) => setType(value as "all" | ItemType)}
        >
          <option value="all">All types</option>
          {typeOptions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </SearchSelect>
        <SearchSelect label="Status" value={status} onChange={setStatus}>
          <option value="all">All statuses</option>
          {statusOptions.map((entry) => (
            <option key={entry} value={entry}>
              {entry}
            </option>
          ))}
        </SearchSelect>
        <SearchSelect label="Tag" value={tag} onChange={setTag}>
          <option value="all">All tags</option>
          {tagOptions.map((entry) => (
            <option key={entry} value={entry}>
              #{entry}
            </option>
          ))}
        </SearchSelect>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 text-[12px] text-faint">
        <span>
          {filtered
            ? `${results.length} matching local item${results.length === 1 ? "" : "s"}`
            : "Recent local items"}
        </span>
        {filtered && (
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setType("all");
              setStatus("all");
              setTag("all");
            }}
            className="rounded-sm border hairline px-2 py-1 hover:bg-muted hover:text-foreground"
          >
            Clear filters
          </button>
        )}
      </div>

      <ul className="mt-5 divide-y hairline border-y hairline">
        {results.map((result) => (
          <li key={result.item.id}>
            <Link
              to="/page/$id"
              params={{ id: result.item.id }}
              className="flex items-start gap-3 px-1 py-3 hover:bg-muted/40"
            >
              <span className="mt-0.5 grid h-8 w-8 place-items-center rounded-sm border hairline text-[12px]">
                {result.item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] text-foreground">
                  <HighlightedText text={result.item.title} query={q} />
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-faint">
                  {result.item.category} / {result.item.type} / {result.item.status ?? "No status"}
                </span>
                <span className="mt-1 block line-clamp-2 text-[12.5px] leading-relaxed text-soft">
                  <HighlightedText text={result.snippet} query={q} />
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {result.matchedFields.map((field) => (
                    <span
                      key={field}
                      className="rounded-full border hairline bg-background px-2 py-0.5 text-[10.5px] capitalize text-faint"
                    >
                      {field}
                    </span>
                  ))}
                  {result.item.tags.map((entry) => (
                    <span
                      key={entry}
                      className="rounded-full bg-muted px-2 py-0.5 text-[10.5px] text-soft"
                    >
                      #{entry}
                    </span>
                  ))}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {!results.length && (
          <li className="px-3 py-8 text-center text-[13px] text-faint">
            No local items match this search and filter combination.
          </li>
        )}
      </ul>
    </div>
  );
}

function SearchSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-md border hairline bg-surface px-2 py-1.5">
      <span className="block text-[10.5px] uppercase tracking-wider text-faint">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 w-full bg-transparent text-[12.5px] outline-none"
      >
        {children}
      </select>
    </label>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlightMatches(text, query).map((part, index) =>
        part.match ? (
          <mark
            key={`${part.text}-${index}`}
            className="rounded-sm bg-tag-amber/25 px-0.5 text-foreground"
          >
            {part.text}
          </mark>
        ) : (
          <span key={`${part.text}-${index}`}>{part.text}</span>
        ),
      )}
    </>
  );
}

function unique<T extends string>(values: T[]) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}
