/**
 * 日本語版 Ten Item Personality Inventory (TIPI-J)
 *
 * 出典: 小塩真司・阿部晋吾・カトローニ ピノ (2012). 日本語版 Ten Item Personality
 * Inventory (TIPI-J) 作成の試み. パーソナリティ研究, 21(1), 40-52.
 * https://doi.org/10.2132/personality.21.40
 *
 * BGA ではこの尺度を「診断の併存的妥当性を確認するための任意アンケート」として
 * 使う。BGA のスコアには一切影響しない。
 */

export const TIPI_FACTORS = ["E", "A", "C", "N", "O"] as const;
export type TipiFactor = (typeof TIPI_FACTORS)[number];

export const TIPI_FACTOR_NAMES: Record<TipiFactor, string> = {
  E: "外向性",
  A: "協調性",
  C: "勤勉性",
  N: "神経症傾向",
  O: "開放性",
};

export interface TipiItem {
  /** 1 始まりの項目番号（原尺度の順番） */
  no: number;
  text: string;
  factor: TipiFactor;
  reversed: boolean;
}

export const TIPI_INSTRUCTION =
  "1から10までのことばが、あなた自身にどのくらい当てはまるかを選んでください。";

export const TIPI_STEM = "私は自分自身のことを……";

export const TIPI_ITEMS: TipiItem[] = [
  { no: 1, text: "活発で、外向的だと思う", factor: "E", reversed: false },
  { no: 2, text: "他人に不満をもち、もめ事を起こしやすいと思う", factor: "A", reversed: true },
  { no: 3, text: "しっかりしていて、自分に厳しいと思う", factor: "C", reversed: false },
  { no: 4, text: "心配性で、うろたえやすいと思う", factor: "N", reversed: false },
  { no: 5, text: "新しいことが好きで、変わった考えをもつと思う", factor: "O", reversed: false },
  { no: 6, text: "ひかえめで、おとなしいと思う", factor: "E", reversed: true },
  { no: 7, text: "人に気をつかう、やさしい人間だと思う", factor: "A", reversed: false },
  { no: 8, text: "だらしなく、うっかりしていると思う", factor: "C", reversed: true },
  { no: 9, text: "冷静で、気分が安定していると思う", factor: "N", reversed: true },
  { no: 10, text: "発想力に欠けた、平凡な人間だと思う", factor: "O", reversed: true },
];

/** 7件法のラベル（1〜7） */
export const TIPI_SCALE: { value: number; label: string }[] = [
  { value: 1, label: "全く違うと思う" },
  { value: 2, label: "おおよそ違うと思う" },
  { value: 3, label: "少し違うと思う" },
  { value: 4, label: "どちらでもない" },
  { value: 5, label: "少しそう思う" },
  { value: 6, label: "まあまあそう思う" },
  { value: 7, label: "強くそう思う" },
];

/** 項目番号(1-10) → 回答値(1-7) */
export type TipiAnswers = Record<number, number>;

export function isTipiComplete(a: TipiAnswers): boolean {
  return TIPI_ITEMS.every((it) => isTipiValue(a[it.no]));
}

export function isTipiValue(v: unknown): v is number {
  return Number.isInteger(v) && (v as number) >= 1 && (v as number) <= 7;
}

/** 各因子 2〜14 点。逆転項目は 8 - 回答値 */
export function scoreTipi(a: TipiAnswers): Record<TipiFactor, number> {
  const out: Record<TipiFactor, number> = { E: 0, A: 0, C: 0, N: 0, O: 0 };
  for (const it of TIPI_ITEMS) {
    const v = a[it.no];
    if (!isTipiValue(v)) continue;
    out[it.factor] += it.reversed ? 8 - v : v;
  }
  return out;
}
