/**
 * BGA (Behavioral Guidelines Assessment) の4つの行動スタイル定義。
 *
 * 理論的な位置づけ:
 * - 4スタイルは対人円環モデル (Leary 1957; Wiggins 1979) の2軸
 *   「主導性 (agency)」「親和性 (communion)」の4象限に対応づける。
 * - 「強みの使いすぎが弱みになる」は Too-Much-of-a-Good-Thing 効果
 *   (Pierce & Aguinis 2013) と、ストレス下で強みが脱線要因になるという
 *   Hogan & Hogan (2001) の枠組みを参照している。
 * - プレッシャー時のスタイルは、ストレス対処 (Carver, Scheier & Weintraub 1989
 *   の COPE 分類) の代表的なパターンに対応づける。
 *
 * 設問・文言はすべてオリジナル。
 */

export const STYLE_IDS = ["S", "D", "A", "H"] as const;
export type StyleId = (typeof STYLE_IDS)[number];

export type AxisSign = 1 | -1;

export interface StyleDef {
  id: StyleId;
  /** 表示名 */
  name: string;
  /** 英語ラベル（コード説明用） */
  en: string;
  /** 根っこの動機 */
  motive: string;
  /** キャッチコピー */
  tagline: string;
  /** 対人円環上の位置: 主導性 (+1 高い / -1 低い) */
  agency: AxisSign;
  /** 対人円環上の位置: 親和性 (+1 高い / -1 低い) */
  communion: AxisSign;
  /** 2軸での説明 */
  axisNote: string;
  /** プレッシャー時に出やすい対処パターン (COPE 分類に対応) */
  coping: string;
  /** 強み */
  strengths: string[];
  /** 使いすぎると */
  overuse: string[];
  /** 周りからの見え方 */
  seenAs: string;
  /** テーマカラー */
  color: string;
}

export const AXES = {
  agency: {
    id: "agency",
    name: "主導性",
    en: "Agency",
    high: "自分から決めて動かす",
    low: "相手や状況に合わせて動く",
    description:
      "物事や人を自分から動かそうとする度合い。高いほど決断や指示を自分が引き受け、低いほど周りの流れや相手の判断を尊重します。",
  },
  communion: {
    id: "communion",
    name: "親和性",
    en: "Communion",
    high: "人とのつながりを重視する",
    low: "課題や正しさを重視する",
    description:
      "人との関係や感情をどれだけ優先するかの度合い。高いほど人の気持ちや和を優先し、低いほど課題そのものや正確さを優先します。",
  },
} as const;

export const STYLES: Record<StyleId, StyleDef> = {
  S: {
    id: "S",
    name: "支援・貢献",
    en: "Supporting",
    motive: "役に立ちたい",
    tagline: "人のために動くことで力を発揮する",
    agency: -1,
    communion: 1,
    axisNote: "親和性が高く、主導性は控えめ。相手の必要に合わせて自分を差し出す。",
    coping: "順応と自己抑制。自分の負担を増やしてでも相手や関係を守ろうとする。",
    strengths: ["誠実", "協力的", "面倒見がいい", "信頼される"],
    overuse: ["自己犠牲", "断れない", "抱え込む", "自分を後回しにする"],
    seenAs: "親身で頼れる人。ただし無理をしていても気づかれにくい。",
    color: "#2E9E6B",
  },
  D: {
    id: "D",
    name: "主導・達成",
    en: "Driving",
    motive: "結果を出したい",
    tagline: "ゴールを決めて先頭で引っ張る",
    agency: 1,
    communion: -1,
    axisNote: "主導性が高く、親和性より課題を優先する。自分で決めて自分で動かす。",
    coping: "能動的対処。問題に直接向かい、力ずくでも状況を変えようとする。",
    strengths: ["決断力", "行動力", "推進力", "責任感"],
    overuse: ["強引", "せっかち", "人の話を聞かない", "独走する"],
    seenAs: "頼りになるリーダー。ただし余裕がないと威圧的に見える。",
    color: "#D9534F",
  },
  A: {
    id: "A",
    name: "分析・堅実",
    en: "Analytical",
    motive: "確実にやりたい",
    tagline: "根拠と手順で確かな成果を積み上げる",
    agency: -1,
    communion: -1,
    axisNote: "主導性も親和性も控えめで、課題の正確さに集中する。一歩引いて確かめてから動く。",
    coping: "計画と抑制。感情より事実を整理し、動く前に考える。",
    strengths: ["慎重", "論理的", "正確", "計画的"],
    overuse: ["優柔不断", "保守的", "考えすぎ", "細部にこだわりすぎる"],
    seenAs: "しっかり者で安心感がある。ただし固く、腰が重く見えることも。",
    color: "#3B6FD4",
  },
  H: {
    id: "H",
    name: "柔軟・調和",
    en: "Harmonizing",
    motive: "うまくやりたい",
    tagline: "空気を読み、状況に合わせて場を動かす",
    agency: 1,
    communion: 1,
    axisNote: "親和性が高く、主導性もある。人とのつながりを使って場を動かす。",
    coping: "支援の希求と切り替え。人に頼り、気持ちを立て直し、やり方を変える。",
    strengths: ["社交的", "適応力", "機転が利く", "場を和ませる"],
    overuse: ["八方美人", "流される", "軽く見られる", "本音が見えない"],
    seenAs: "付き合いやすく柔らかい人。ただし芯がないと誤解されやすい。",
    color: "#E0A526",
  },
};

export const STYLE_LIST: StyleDef[] = STYLE_IDS.map((id) => STYLES[id]);
