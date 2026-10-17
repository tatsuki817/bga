import type { Metadata } from "next";
import Link from "next/link";
import { AXES, MIXED_GAP, QUESTIONS_BY_PHASE, STYLE_LIST } from "@/lib/bga";
import { StyleBadge } from "@/components/StyleBadge";

export const metadata: Metadata = {
  title: "モデルの根拠と限界",
  description: "BGA 行動指針診断が参考にしている理論、測定上の限界、そして自前で検証していることをまとめています。",
};

const REFERENCES: { key: string; text: string }[] = [
  { key: "leary1957", text: "Leary, T. (1957). Interpersonal diagnosis of personality. Ronald Press." },
  {
    key: "wiggins1979",
    text: "Wiggins, J. S. (1979). A psychological taxonomy of trait-descriptive terms: The interpersonal domain. Journal of Personality and Social Psychology, 37(3), 395-412.",
  },
  {
    key: "pierce2013",
    text: "Pierce, J. R., & Aguinis, H. (2013). The too-much-of-a-good-thing effect in management. Journal of Management, 39(2), 313-338.",
  },
  {
    key: "hogan2001",
    text: "Hogan, R., & Hogan, J. (2001). Assessing leadership: A view from the dark side. International Journal of Selection and Assessment, 9(1-2), 40-51.",
  },
  {
    key: "kaplan2013",
    text: "Kaplan, R. E., & Kaiser, R. B. (2013). Fear your strengths: What you are best at could be your biggest problem. Berrett-Koehler.",
  },
  {
    key: "fleeson2001",
    text: "Fleeson, W. (2001). Toward a structure- and process-integrated view of personality: Traits as density distributions of states. Journal of Personality and Social Psychology, 80(6), 1011-1027.",
  },
  {
    key: "carver1989",
    text: "Carver, C. S., Scheier, M. F., & Weintraub, J. K. (1989). Assessing coping strategies: A theoretically based approach. Journal of Personality and Social Psychology, 56(2), 267-283.",
  },
  {
    key: "brown2011",
    text: "Brown, A., & Maydeu-Olivares, A. (2011). Item response modeling of forced-choice questionnaires. Educational and Psychological Measurement, 71(3), 460-502.",
  },
  {
    key: "salgado2015",
    text: "Salgado, J. F., Anderson, N., & Táuriz, G. (2015). The validity of ipsative and quasi-ipsative forced-choice personality inventories for different occupational groups: A comprehensive meta-analysis. Journal of Occupational and Organizational Psychology, 88(4), 797-834.",
  },
  {
    key: "pittenger2005",
    text: "Pittenger, D. J. (2005). Cautionary comments regarding the Myers-Briggs Type Indicator. Consulting Psychology Journal: Practice and Research, 57(3), 210-221.",
  },
  {
    key: "oshio2012",
    text: "小塩真司・阿部晋吾・カトローニ ピノ (2012). 日本語版 Ten Item Personality Inventory (TIPI-J) 作成の試み. パーソナリティ研究, 21(1), 40-52.",
  },
];

function Ref({ k }: { k: string }) {
  const i = REFERENCES.findIndex((r) => r.key === k);
  return (
    <a href={`#ref-${k}`} className="align-super text-xs text-muted underline-offset-2 hover:underline">
      [{i + 1}]
    </a>
  );
}

export default function BasisPage() {
  const nN = QUESTIONS_BY_PHASE.normal.length;
  const nP = QUESTIONS_BY_PHASE.pressure.length;
  return (
    <article className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold">モデルの根拠と限界</h1>
        <p className="leading-relaxed text-muted">
          BGA は、確立された理論を部品として組み合わせた独自モデルです。モデル全体の妥当性はまだ検証の途中で、
          このページでは「どこまでが先行研究に支えられていて、どこからが BGA 自身の仮説か」を分けて書いています。
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">BGA が測っているもの</h2>
        <p className="leading-relaxed">
          2 つの場面（普段 / プレッシャー下）について、4 つの行動スタイルを「どの順番で使うか」を測ります。
          各設問で 4 つの文を自分に近い順に並べる強制選択式で、普段 {nN} 問、プレッシャー下 {nP} 問です。
          1 位 4 点、4 位 1 点で集計し、各場面の 1 位の組み合わせを 16 タイプのラベルにしています。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold">参考にしている理論</h2>

        <div className="space-y-2">
          <h3 className="font-bold">1. なぜ 4 スタイルか：対人円環モデル</h3>
          <p className="leading-relaxed text-muted">
            対人行動は「{AXES.agency.name}（{AXES.agency.en}）」と「{AXES.communion.name}（{AXES.communion.en}
            ）」の 2 軸で円状に整理できる、という枠組みが対人円環モデルです<Ref k="leary1957" />
            <Ref k="wiggins1979" />。BGA の 4 スタイルは、この 2 軸の 4 象限に対応づけています。
            本来は 8 方位（オクタント）で扱う精度の高いモデルなので、4 象限は意図的な簡略化です。
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {STYLE_LIST.map((s) => (
              <div key={s.id} className="flex items-start gap-2 rounded-xl border border-border bg-card p-3 text-sm">
                <StyleBadge id={s.id} size="sm" />
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-muted">{s.axisNote}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">2. 強みは使いすぎると弱みになる</h3>
          <p className="leading-relaxed text-muted">
            良い特性も一定の点を超えると効果が頭打ちになり、しばしば逆効果になる、という「Too-Much-of-a-Good-Thing 効果」
            <Ref k="pierce2013" />と、リーダーの強みの過剰使用を扱った研究<Ref k="kaplan2013" />を参考にしています。
            各スタイルの「使いすぎると」欄はこの考え方に基づく記述で、スコアが高いこと自体を問題とはみなしません。
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">3. プレッシャー下では別の面が出る</h3>
          <p className="leading-relaxed text-muted">
            普段は強みに見える特性がストレス下で脱線要因になる、という観点は Hogan らの「ダークサイド」研究
            <Ref k="hogan2001" />が出発点です。また、同じ人でも行動は状況によって大きくばらつくが、
            そのばらつき方は安定した個人差である、という知見<Ref k="fleeson2001" />が、2 場面を分けて測る設計と、
            「切り替わりの大きさ」を指標にする設計の根拠です。
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="font-bold">4. プレッシャー時の 4 スタイルはストレス対処の分類に対応</h3>
          <p className="leading-relaxed text-muted">
            ストレス対処の研究では、問題に直接向かう対処、計画や抑制、他者への支援希求、気持ちの切り替えや離脱などが区別されます
            <Ref k="carver1989" />。BGA のプレッシャー時設問は、D を能動的対処、A を計画と抑制、S を順応と自己抑制、
            H を支援希求と切り替えに対応づけて作っています。
          </p>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">測定上の限界</h2>
        <ul className="list-disc space-y-2 pl-5 leading-relaxed text-muted">
          <li>
            <span className="text-foreground">順位データであること。</span>
            並べ替え式の回答は 4 スタイルの合計点が全員同じになります（イプサティブ）。このため BGA のスコアは
            「あなたの中での使い方の順番」を表し、他の人との高低比較には使えません<Ref k="brown2011" />。
            一方で、強制選択形式そのものは、通常の評定式より実際の行動の予測力が高いという報告もあります
            <Ref k="salgado2015" />。
          </li>
          <li>
            <span className="text-foreground">タイプ分けの境界問題。</span>
            1 位と 2 位が僅差の人は、日を変えて受けるとタイプが変わりえます。これは型分類全般の弱点として知られています
            <Ref k="pittenger2005" />。BGA では 1 位と 2 位の差が {MIXED_GAP} 点以内のとき「僅差」と表示し、近いタイプもあわせて示します。
            タイプ名はあくまで便宜的なラベルで、スコアの形の方が情報量があります。
          </li>
          <li>
            <span className="text-foreground">自己報告であること。</span>
            自分で自分をどう見ているかを測っています。周りからの見え方とは一致しないことがあります。
          </li>
          <li>
            <span className="text-foreground">モデル全体の妥当性は未検証であること。</span>
            上記の理論はそれぞれ研究の蓄積がありますが、「BGA という組み合わせ」が妥当かどうかは、
            BGA 自身のデータで示す必要があります。
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">BGA 自身で検証していること</h2>
        <p className="leading-relaxed text-muted">
          同意いただいた方の回答を匿名で集め、次の 3 点を確認していきます。結果が出しだい、このページで公開します。
        </p>
        <ol className="list-decimal space-y-2 pl-5 leading-relaxed text-muted">
          <li>
            <span className="text-foreground">項目分析。</span>
            各設問の 4 文が、意図したスタイルのスコアと連動しているか。連動しない文は差し替えます。
          </li>
          <li>
            <span className="text-foreground">併存的妥当性。</span>
            確立された性格尺度（TIPI-J<Ref k="oshio2012" />）に任意で回答いただき、BGA の各スタイルと
            ビッグファイブの対応（例：D と外向性、S と協調性、A と勤勉性）を確認します。
          </li>
          <li>
            <span className="text-foreground">再検査信頼性。</span>
            期間をあけて再受検したときに、スタイルの順位がどれだけ一致するか。
          </li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">データの扱い</h2>
        <ul className="list-disc space-y-1 pl-5 leading-relaxed text-muted">
          <li>保存するのは、回答の並び順、スコア、タイプ、所要時間だけです。</li>
          <li>氏名、メールアドレス、IP アドレス、端末情報は収集しません。</li>
          <li>同意しなかった場合は何も保存されず、診断は同じように受けられます。</li>
          <li>集計結果は匿名の統計としてのみ公開します。</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold">参考文献</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted">
          {REFERENCES.map((r) => (
            <li key={r.key} id={`ref-${r.key}`}>
              {r.text}
            </li>
          ))}
        </ol>
        <p className="text-xs text-muted">
          BGA は独自に設計した診断で、特定の商用アセスメントとは関係ありません。設問・タイプ名・解説文はすべてオリジナルです。
        </p>
      </section>

      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/quiz" className="underline underline-offset-4">
          診断をはじめる
        </Link>
        <Link href="/types" className="underline underline-offset-4">
          16タイプ一覧
        </Link>
      </nav>
    </article>
  );
}
