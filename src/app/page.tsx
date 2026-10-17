import Link from "next/link";
import { AXES, QUESTIONS, STYLE_LIST } from "@/lib/bga";
import { StyleBadge } from "@/components/StyleBadge";

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-5 pt-6">
        <p className="text-sm font-medium text-muted">Behavioral Guidelines Assessment</p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          普段のあなたと、
          <br />
          追い詰められたときのあなた。
        </h1>
        <p className="text-muted leading-relaxed">
          BGA（ビーガ）は、4つの行動スタイルの使い方を「余裕があるとき」と「プレッシャー下」の2場面で測り、
          その組み合わせから16タイプの行動指針を示します。所要時間は約5分、全{QUESTIONS.length}問です。
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/quiz"
            className="rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground hover:opacity-90"
          >
            診断をはじめる
          </Link>
          <Link
            href="/types"
            className="rounded-full border border-border px-6 py-3 font-semibold hover:bg-card"
          >
            16タイプを見る
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">4つの行動スタイル</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {STYLE_LIST.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <StyleBadge id={s.id} />
                <span className="font-bold">{s.name}</span>
              </div>
              <p className="text-sm text-muted">{s.tagline}</p>
              <p className="text-sm">
                <span className="text-muted">動機：</span>
                {s.motive}
              </p>
              <p className="text-xs text-muted">
                {AXES.agency.name} {s.agency > 0 ? "高" : "低"} / {AXES.communion.name} {s.communion > 0 ? "高" : "低"}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">根拠のある設計を目指しています</h2>
        <p className="text-sm leading-relaxed text-muted">
          4 スタイルは対人円環モデルの「{AXES.agency.name}」「{AXES.communion.name}」の 2 軸に、
          プレッシャー時の反応はストレス対処研究の分類に対応づけています。
          一方で、BGA という組み合わせ自体の妥当性はまだ検証中です。同意いただいた方の匿名データで検証を進め、結果は公開します。
          <Link href="/basis" className="ml-1 underline underline-offset-4">
            モデルの根拠と限界
          </Link>
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">BGA の見方</h2>
        <ol className="list-decimal space-y-2 pl-5 text-sm leading-relaxed">
          <li>どのスタイルも長所です。良し悪しではなく「使い方の順番」を見ます。</li>
          <li>
            強みは使いすぎると弱みになります。プレッシャー下で最初に出るスタイルは、使いすぎのサインが出やすい場所です。
          </li>
          <li>
            通常時とプレッシャー時で優位スタイルが入れ替わる人もいれば、変わらない人もいます。どちらにもそれぞれの行動指針があります。
          </li>
        </ol>
      </section>
    </div>
  );
}
