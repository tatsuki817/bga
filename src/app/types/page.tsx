import type { Metadata } from "next";
import Link from "next/link";
import { STYLES, STYLE_IDS, TYPES } from "@/lib/bga";
import { StyleBadge } from "@/components/StyleBadge";

export const metadata: Metadata = { title: "16タイプ一覧" };

export default function TypesPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">16タイプ一覧</h1>
        <p className="text-muted text-sm">
          縦が「普段の優位スタイル」、横が「プレッシャー下の優位スタイル」です。
        </p>
      </div>
      <div className="space-y-6">
        {STYLE_IDS.map((n) => (
          <section key={n} className="space-y-3">
            <h2 className="flex items-center gap-2 font-bold">
              <StyleBadge id={n} size="sm" />
              普段は {STYLES[n].name}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {STYLE_IDS.map((p) => {
                const t = TYPES[`${n}${p}`];
                return (
                  <Link
                    key={t.code}
                    href={`/types/${t.code}`}
                    className="rounded-2xl border border-border bg-card p-4 hover:border-muted"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold">{t.name}</span>
                      <span className="text-xs text-muted">{t.code}型</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{t.catch}</p>
                    <p className="mt-2 text-xs text-muted">プレッシャー下では {STYLES[p].name}</p>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
