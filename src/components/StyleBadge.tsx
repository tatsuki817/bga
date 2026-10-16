import { STYLES, type StyleId } from "@/lib/bga";

export function StyleBadge({ id, size = "md" }: { id: StyleId; size?: "sm" | "md" | "lg" }) {
  const s = STYLES[id];
  const dim = size === "lg" ? "h-12 w-12 text-xl" : size === "sm" ? "h-6 w-6 text-xs" : "h-8 w-8 text-sm";
  return (
    <span
      className={`inline-flex ${dim} shrink-0 items-center justify-center rounded-full font-bold text-white`}
      style={{ backgroundColor: s.color }}
      aria-label={s.name}
    >
      {s.id}
    </span>
  );
}
