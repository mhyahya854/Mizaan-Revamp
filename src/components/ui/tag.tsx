import { cn } from "@/lib/utils";

export type TagColor = "blue" | "green" | "amber" | "rose" | "violet" | "stone";

const map: Record<TagColor, string> = {
  blue: "text-tag-blue bg-tag-blue/10",
  green: "text-tag-green bg-tag-green/10",
  amber: "text-tag-amber bg-tag-amber/10",
  rose: "text-tag-rose bg-tag-rose/10",
  violet: "text-tag-violet bg-tag-violet/10",
  stone: "text-tag-stone bg-tag-stone/10",
};

export function Tag({
  color = "stone",
  children,
  className,
}: {
  color?: TagColor;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] font-medium",
        map[color],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ color = "stone", className }: { color?: TagColor; className?: string }) {
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 rounded-full", className)}
      style={{ backgroundColor: `var(--tag-${color})` }}
    />
  );
}

