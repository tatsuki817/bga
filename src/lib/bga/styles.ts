/**
 * BGA (Behavioral Guidelines Assessment) の4つの行動スタイル定義。
 * LIFO の「4スタイル」「通常時/プレッシャー時」「強みの使いすぎ」という
 * 一般的な考え方を参考にした独自モデル。設問・文言はすべてオリジナル。
 */

export const STYLE_IDS = ["S", "D", "A", "H"] as const;
export type StyleId = (typeof STYLE_IDS)[number];

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
  /** 強み */
  strengths: string[];
  /** 使いすぎると */
  overuse: string[];
  /** 周りからの見え方 */
  seenAs: string;
  /** テーマカラー（Tailwind の任意値で使う HEX） */
  color: string;
}

export const STYLES: Record<StyleId, StyleDef> = {
  S: {
    id: "S",
    name: "支援・貢献",
    en: "Supporting",
    motive: "役に立ちたい",
    tagline: "人のために動くことで力を発揮する",
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
    strengths: ["社交的", "適応力", "機転が利く", "場を和ませる"],
    overuse: ["八方美人", "流される", "軽く見られる", "本音が見えない"],
    seenAs: "付き合いやすく柔らかい人。ただし芯がないと誤解されやすい。",
    color: "#E0A526",
  },
};

export const STYLE_LIST: StyleDef[] = STYLE_IDS.map((id) => STYLES[id]);
