import Link from "next/link";
import { STYLES, type Result } from "@/lib/bga";
import { ProfileBars } from "./ProfileBars";
import { StyleBadge } from "./StyleBadge";
import { ShareButtons } from "./ShareButtons";

export function ResultView({ result }: { result: Result }) {
  const { type, normal, pressure, shifts, shiftIndex } = result;
  const n = STYLES[type.normal];
  const p = STYLES[type.pressure];
  const shiftLabel = shiftIndex < 0.25 ? "ほぼ変わらない" : shiftIndex < 0.5 ? "少し変わる" : shiftIndex < 0.75 ? "かなり変わる" : "大きく変わる";

  return (
    <div className="space-y-10">
      <section className="space-y-4 text-center">
        <p className="text-sm text-muted">あなたのタイプ</p>
        <div className="flex items-center justify-center gap-3">
          <StyleBadge id={type.normal} size="lg" />
          <span className="text-2xl text-muted">→</span>
          <StyleBadge id={type.pressure} size="lg" />
        </div>
        <h1 className="text-3xl font-bold">
          {type.name}
          <span className="ml-2 text-base font-normal text-muted">{type.code}型</span>
        </h1>
        <p className="text-lg">{type.catch}</p>
        <p className="mx-auto max-w-xl text-left leading-relaxed text-muted">{type.summary}</p>
        <ShareButtons text={`私のBGA行動指針診断は「${type.name}（${type.code}型）」でした。`} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <ProfileBars profile={normal} title="普段のあなた" />
        <ProfileBars profile={pressure} title="プレッシャー下のあなた" />
      </section>

      <section className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <h2 className="font-bold">プレッシャーで{shifts ? "優位スタイルが入れ替わります" : "優位スタイルは変わりません"}</h2>
        <p className="text-sm text-muted">
          スタイルの使い方の順番は、プレッシャーで「{shiftLabel}」傾向です。
          {shifts
            ? `普段は「${n.name}」が前に出ますが、追い詰められると「${p.name}」が先に動きます。周りはこの切り替わりに気づいていないことが多く、ギャップが誤解のもとになります。`
            : `普段もプレッシャー下も「${n.name}」が先に動きます。安定している分、追い詰められたときは同じスタイルを使いすぎるサインに注意が必要です。`}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">行動指針</h2>
        <ol className="space-y-3">
          {type.guidelines.map((g, i) => (
            <li key={i} className="flex gap-3 rounded-2xl border border-border bg-card p-4">
              <span className="font-bold text-muted">{i + 1}</span>
              <span className="leading-relaxed">{g}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        {[
          { label: "普段の強み", s: n, list: n.strengths },
          { label: "プレッシャー下で出やすい使いすぎ", s: p, list: p.overuse },
        ].map(({ label, s, list }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs text-muted">{label}</p>
            <div className="flex items-center gap-2">
              <StyleBadge id={s.id} size="sm" />
              <span className="font-bold">{s.name}</span>
            </div>
            <ul className="flex flex-wrap gap-2 text-sm">
              {list.map((x) => (
                <li key={x} className="rounded-full border border-border px-3 py-1">
                  {x}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="flex flex-wrap gap-3 text-sm">
        <Link href={`/types/${type.code}`} className="underline underline-offset-4 hover:text-muted">
          {type.name}の解説ページ
        </Link>
        <Link href="/types" className="underline underline-offset-4 hover:text-muted">
          16タイプ一覧
        </Link>
        <Link href="/quiz" className="underline underline-offset-4 hover:text-muted">
          もう一度診断する
        </Link>
      </section>
    </div>
  );
}
