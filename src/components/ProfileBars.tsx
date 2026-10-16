import { STYLES, toPercent, type PhaseProfile } from "@/lib/bga";
import { StyleBadge } from "./StyleBadge";

export function ProfileBars({ profile, title }: { profile: PhaseProfile; title: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="mb-3 font-bold">{title}</h3>
      <ul className="space-y-2">
        {profile.order.map((id, i) => {
          const pct = toPercent(profile, id);
          return (
            <li key={id} className="flex items-center gap-3">
              <span className="w-4 text-xs text-muted">{i + 1}</span>
              <StyleBadge id={id} size="sm" />
              <span className="w-20 shrink-0 text-sm">{STYLES[id].name}</span>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: STYLES[id].color }}
                />
              </div>
              <span className="w-10 text-right text-xs tabular-nums text-muted">{pct}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
