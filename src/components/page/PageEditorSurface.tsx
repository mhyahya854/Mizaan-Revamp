import { useMemo, useState } from "react";
import {
  CheckSquare,
  Code2,
  GripVertical,
  Hash,
  List,
  MessageSquare,
  Minus,
  Plus,
  Quote,
  Table2,
  Type,
} from "lucide-react";

import { getImplementedSlashCommands } from "@/lib/page/page-workspace";
import { createDefaultTableData, serializeTableData } from "@/lib/table/simple-table";
import type { MizaanBlock, VaultProvider } from "@/lib/vault/types";
import { SimpleTableBlock } from "@/components/table/SimpleTableBlock";

const ICONS = {
  paragraph: Type,
  heading1: Hash,
  heading2: Hash,
  heading3: Hash,
  bullet: List,
  numbered: List,
  todo: CheckSquare,
  quote: Quote,
  callout: MessageSquare,
  divider: Minus,
  code: Code2,
  table: Table2,
};

export function PageEditorSurface({
  itemId,
  blocks,
  provider,
}: {
  itemId: string;
  blocks: MizaanBlock[];
  provider: VaultProvider;
}) {
  const [slashOpen, setSlashOpen] = useState(false);
  const [slashQuery, setSlashQuery] = useState("");
  const commands = useMemo(() => {
    const q = slashQuery.trim().toLowerCase();
    return getImplementedSlashCommands().filter((command) => {
      return (
        !q || command.label.toLowerCase().includes(q) || command.hint.toLowerCase().includes(q)
      );
    });
  }, [slashQuery]);

  function addBlock(type: MizaanBlock["type"], after?: MizaanBlock) {
    await provider.createBlock(itemId, {
      type,
      content: type === "table" ? serializeTableData(createDefaultTableData()) : "",
      checked: type === "todo" ? false : undefined,
      order: after ? after.order + 0.5 : undefined,
    });
    setSlashOpen(false);
    setSlashQuery("");
  }

  return (
    <section className="mt-5">
      <div className="space-y-1">
        {blocks.map((block) => (
          <BlockRow
            key={block.id}
            block={block}
            onChange={async (content) => await provider.updateBlock(block.id, { content })}
            onCheckedChange={async (checked) => await provider.updateBlock(block.id, { checked })}
            onEnter={() => addBlock("paragraph", block)}
          />
        ))}
      </div>

      {!blocks.length && (
        <div className="rounded-md border border-dashed hairline px-4 py-6 text-[13px] text-faint">
          This page has no blocks yet. Add a paragraph or open the slash menu to start.
        </div>
      )}

      <div className="relative mt-3">
        <button
          onClick={() => setSlashOpen((value) => !value)}
          className="flex w-full items-center gap-2 rounded-sm px-1 py-1.5 text-[13px] text-faint hover:bg-muted"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add a block, or type / for implemented commands</span>
        </button>
        {slashOpen && (
          <div className="absolute left-0 z-20 mt-1 w-[340px] overflow-hidden rounded-md border hairline bg-popover shadow-xl">
            <div className="border-b hairline p-2">
              <input
                autoFocus
                value={slashQuery}
                onChange={(event) => setSlashQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setSlashOpen(false);
                  if (event.key === "Enter" && commands[0]) addBlock(commands[0].id);
                }}
                placeholder="Search block commands"
                className="w-full rounded-sm border hairline bg-background px-2 py-1.5 text-[13px] outline-none"
              />
            </div>
            <ul className="max-h-[280px] overflow-y-auto py-1">
              {commands.map((command) => {
                const Icon = ICONS[command.id];
                return (
                  <li key={command.id}>
                    <button
                      onClick={() => addBlock(command.id)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-soft" />
                      <span className="min-w-0">
                        <span className="block text-[13px]">{command.label}</span>
                        <span className="block truncate text-[11px] text-faint">
                          {command.hint}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

function BlockRow({
  block,
  onChange,
  onCheckedChange,
  onEnter,
}: {
  block: MizaanBlock;
  onChange: (content: string) => void;
  onCheckedChange: (checked: boolean) => void;
  onEnter: () => void;
}) {
  return (
    <div className="group relative -ml-8 flex items-start gap-1 rounded-sm px-1 py-0.5 hover:bg-muted/40">
      <div className="flex w-8 shrink-0 items-center justify-end gap-0.5 pt-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={onEnter}
          className="grid h-5 w-5 place-items-center rounded-sm text-faint hover:bg-muted"
          aria-label="Add block after"
        >
          <Plus className="h-3 w-3" />
        </button>
        <span className="grid h-5 w-5 place-items-center rounded-sm text-faint">
          <GripVertical className="h-3 w-3" />
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <EditableBlock
          block={block}
          onChange={onChange}
          onCheckedChange={onCheckedChange}
          onEnter={onEnter}
        />
      </div>
    </div>
  );
}

function EditableBlock({
  block,
  onChange,
  onCheckedChange,
  onEnter,
}: {
  block: MizaanBlock;
  onChange: (content: string) => void;
  onCheckedChange: (checked: boolean) => void;
  onEnter: () => void;
}) {
  if (block.type === "divider") return <hr className="my-3 border-t hairline" />;

  if (block.type === "table") {
    return <SimpleTableBlock block={block} onChange={onChange} />;
  }

  if (block.type === "todo") {
    return (
      <label className="flex items-start gap-2 text-[14.5px] leading-[1.6]">
        <input
          type="checkbox"
          checked={Boolean(block.checked)}
          onChange={(event) => onCheckedChange(event.target.checked)}
          className="mt-[7px] h-3.5 w-3.5 cursor-pointer accent-foreground"
        />
        <textarea
          value={block.content}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => handleEnter(event, onEnter)}
          rows={1}
          placeholder="To-do"
          className={`min-h-7 flex-1 resize-none bg-transparent leading-[1.6] outline-none ${
            block.checked ? "text-faint line-through" : "text-foreground/90"
          }`}
        />
      </label>
    );
  }

  const className = blockClassName(block.type);
  return (
    <textarea
      value={block.content}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => handleEnter(event, onEnter)}
      rows={block.type === "code" ? 3 : 1}
      placeholder={placeholderFor(block.type)}
      className={`${className} w-full resize-none bg-transparent outline-none placeholder:text-faint`}
    />
  );
}

function handleEnter(event: React.KeyboardEvent<HTMLTextAreaElement>, onEnter: () => void) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    onEnter();
  }
}

function blockClassName(type: MizaanBlock["type"]) {
  switch (type) {
    case "heading1":
      return "mt-6 font-editorial text-[28px] leading-tight";
    case "heading2":
      return "mt-5 font-editorial text-[22px] leading-snug";
    case "heading3":
      return "mt-4 font-editorial text-[18px]";
    case "quote":
      return "border-l-2 hairline pl-3 font-editorial italic text-[16px] text-foreground/85";
    case "callout":
      return "rounded-md border hairline bg-surface-muted px-3 py-2 text-[13.5px]";
    case "code":
      return "rounded-md border hairline bg-surface-muted px-3 py-2 font-mono text-[12.5px]";
    case "table":
      return "";
    case "bullet":
      return "pl-5 text-[14.5px] leading-[1.7]";
    case "numbered":
      return "pl-5 text-[14.5px] leading-[1.7]";
    default:
      return "text-[15px] leading-[1.7] text-foreground/90";
  }
}

function placeholderFor(type: MizaanBlock["type"]) {
  if (type === "heading1" || type === "heading2" || type === "heading3") return "Heading";
  if (type === "quote") return "Quote";
  if (type === "code") return "Code";
  if (type === "table") return "Table";
  return "Type / for commands";
}



