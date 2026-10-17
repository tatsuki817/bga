import Link from "next/link";
import { AXES, MIXED_GAP, STYLES, encodeResult, type Dominance, type Result } from "@/lib/bga";
import { ProfileBars } from "./ProfileBars";
import { StyleBadge } from "./StyleBadge";
import { ShareButtons } from "./ShareButtons";
import { TipiSurvey } from "./TipiSurvey";

function ClarityBadge({ d }: { d: Dominance }) {
  return d.isClear ? (
    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">明確（2位と{d.gap}点差）</span>
  ) : (
    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
      僅差（2位の{STYLES[d.second].name}と{d.gap}点差）
    </span>
  );
}

export function ResultView({ result }: { result: Result }) {
  const { type, normal, pressure, shifts, shiftIndex, dominance, alternatives } = result;
  const n = STYLES[type.normal];
  const p = STYLES[type.pressure];
  const code = encodeResult(result);
  const shiftLabel =
    shiftIndex < 0.25 ? "ほぼ変わらない" : shiftIndex < 0.5 ? "少し変わる" : shiftIndex < 0.75 ? "かなり変わる" : "大きく変わる";
  const anyMixed = !dominance.normal.isClear || !dominance.pressure.isClear;

  return (
    <div className="space-y-10">
      {/* 1. スコアの形が主役 */}
      <section className="space-y-4">
        <p className="text-sm text-muted">あなたのスタイルの使い方</p>
        <h1 className="text-2xl font-bold leading-snug">
          普段は<span style={{ color: n.color }}>「{n.name}」</span>が先に動き、
          <br className="hidden sm:block" />
          プレッシャー下では<span style={{ color: p.color }}>「{p.name}」</span>が先に動きます。
        </h1>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <ProfileBars profile={normal} title="普段のあなた" />
            <div className="px-1">
              <ClarityBadge d={dominance.normal} />
            </div>
          </div>
          <div className="space-y-2">
            <ProfileBars profile={pressure} title="プレッシャー下のあなた" />
            <div className="px-1">
              <ClarityBadge d={dominance.pressure} />
            </div>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-muted">
          数値は各スタイルを「どれだけ先に使うか」の相対的な順位を 0〜100 に直したものです。4 つの合計は常に同じなので、
          他の人との高低比較ではなく、あなたの中での使い方の順番を表しています。
        </p>
      </section>

      {/* 2. タイプは便宜的なラベルとして */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <StyleBadge id={type.normal} />
            <span className="text-muted">→</span>
            <StyleBadge id={type.pressure} />
          </div>
          <div>
            <p className="text-xs text-muted">行動指針タイプ</p>
            <h2 className="text-xl font-bold">
              {type.name}
              <span className="ml-2 text-sm font-normal text-muted">{type.code}型</span>
            </h2>
          </div>
        </div>
        <p className="text-lg">{type.catch}</p>
        <p className="leading-relaxed text-muted">{type.summary}</p>
        {anyMixed && alternatives.length > 0 && (
          <div className="rounded-xl border border-border p-3 text-sm">
            <p className="font-bold">近いタイプもあわせて読んでください</p>
            <p className="mt-1 text-muted">
              1位と2位の差が{MIXED_GAP}点以内の場面があるため、タイプは断定していません。次のタイプも当てはまる可能性があります。
            </p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {alternatives.map((t) => (
                <li key={t.code}>
                  <Link href={`/types/${t.code}`} className="rounded-full border border-border px-3 py-1 hover:bg-background">
                    {t.name}（{t.code}型）
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <ShareButtons text={`私のBGA行動指針診断は「${type.name}（${type.code}型）」でした。`} />
      </section>

      {/* 3. 2軸での読み方 */}
      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs text-muted">2軸で見ると（普段）</p>
          <div className="flex items-center gap-2">
            <StyleBadge id={n.id} size="sm" />
            <span className="font-bold">{n.name}</span>
          </div>
          <p className="text-sm text-muted">{n.axisNote}</p>
          <ul className="text-sm">
            <li>
              {AXES.agency.name}：{n.agency > 0 ? AXES.agency.high : AXES.agency.low}
            </li>
            <li>
              {AXES.communion.name}：{n.communion > 0 ? AXES.communion.high : AXES.communion.low}
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 space-y-2">
          <p className="text-xs text-muted">プレッシャー下の対処パターン</p>
          <div className="flex items-center gap-2">
            <StyleBadge id={p.id} size="sm" />
            <span className="font-bold">{p.name}</span>
          </div>
          <p className="text-sm text-muted">{p.coping}</p>
        </div>
      </section>

      {/* 4. 切り替わり */}
      <section className="rounded-2xl border border-border bg-card p-5 space-y-2">
        <h2 className="font-bold">プレッシャーで{shifts ? "優位スタイルが入れ替わります" : "優位スタイルは変わりません"}</h2>
        <p className="text-sm text-muted">
          スタイルの使い方の順番は、プレッシャーで「{shiftLabel}」傾向です。
          {shifts
            ? `普段は「${n.name}」が前に出ますが、追い詰められると「${p.name}」が先に動きます。周りはこの切り替わりに気づいていないことが多く、ギャップが誤解のもとになります。`
            : `普段もプレッシャー下も「${n.name}」が先に動きます。安定している分、追い詰められたときは同じスタイルを使いすぎるサインに注意が必要です。`}
        </p>
      </section>

      {/* 5. 行動指針 */}
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

      <TipiSurvey resultCode={code} />

      <section className="space-y-2 text-sm">
        <p className="text-muted">
          BGA は対人円環モデルやストレス対処研究を参考にした独自モデルで、現在データを集めて検証中です。
          <Link href="/basis" className="ml-1 underline underline-offset-4">
            モデルの根拠と限界について
          </Link>
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href={`/types/${type.code}`} className="underline underline-offset-4 hover:text-muted">
            {type.name}の解説ページ
          </Link>
          <Link href="/types" className="underline underline-offset-4 hover:text-muted">
            16タイプ一覧
          </Link>
          <Link href="/quiz" className="underline underline-offset-4 hover:text-muted">
            もう一度診断する
          </Link>
        </div>
      </section>
    </div>
  );
}
