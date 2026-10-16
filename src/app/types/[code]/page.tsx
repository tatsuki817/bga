import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STYLES, TYPES, TYPE_LIST, isTypeCode } from "@/lib/bga";
import { StyleBadge } from "@/components/StyleBadge";

export function generateStaticParams() {
  return TYPE_LIST.map((t) => ({ code: t.code }));
}

export async function generateMetadata({ params }: PageProps<"/types/[code]">): Promise<Metadata> {
  const { code } = await params;
  if (!isTypeCode(code)) return {};
  const t = TYPES[code];
  return { title: `${t.name}（${t.code}型）`, description: t.summary };
}

export default async function TypePage({ params }: PageProps<"/types/[code]">) {
  const { code } = await params;
  if (!isTypeCode(code)) notFound();
  const t = TYPES[code];
  const n = STYLES[t.normal];
  const p = STYLES[t.pressure];

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <StyleBadge id={t.normal} size="lg" />
          <span className="text-2xl text-muted">→</span>
          <StyleBadge id={t.pressure} size="lg" />
        </div>
        <h1 className="text-3xl font-bold">
          {t.name}
          <span className="ml-2 text-base font-normal text-muted">{t.code}型</span>
        </h1>
        <p className="text-lg">{t.catch}</p>
        <p className="leading-relaxed text-muted">{t.summary}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "普段の優位スタイル", s: n },
          { label: "プレッシャー下の優位スタイル", s: p },
        ].map(({ label, s }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs text-muted">{label}</p>
            <div className="flex items-center gap-2">
              <StyleBadge id={s.id} size="sm" />
              <span className="font-bold">{s.name}</span>
            </div>
            <p className="text-sm text-muted">{s.seenAs}</p>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">行動指針</h2>
        <ol className="space-y-3">
          {t.guidelines.map((g, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="font-bold text-muted">{i + 1}</span>
              <span className="leading-relaxed">{g}</span>
            </li>
          ))}
        </ol>
      </section>

      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/types" className="underline underline-offset-4">
          16タイプ一覧へ
        </Link>
        <Link href="/quiz" className="underline underline-offset-4">
          自分のタイプを診断する
        </Link>
      </nav>
    </article>
  );
}
