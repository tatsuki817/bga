import { STYLE_IDS, type StyleId } from "./styles";
import { QUESTIONS, QUESTIONS_BY_PHASE, type Phase, type Question } from "./questions";
import { TYPES, type TypeCode, type TypeDef } from "./types";

/** 1問の回答：スタイルIDを「自分に近い順」に並べた配列 */
export type Ranking = [StyleId, StyleId, StyleId, StyleId];

/** 設問IDごとの回答 */
export type Answers = Record<string, Ranking>;

export type Scores = Record<StyleId, number>;

export interface PhaseProfile {
  phase: Phase;
  scores: Scores;
  /** スコア降順のスタイル順位 */
  order: StyleId[];
  /** 最大スコア（配点上の理論値） */
  max: number;
  /** 最小スコア（配点上の理論値） */
  min: number;
}

export interface Result {
  normal: PhaseProfile;
  pressure: PhaseProfile;
  type: TypeDef;
  /** 優位スタイルがプレッシャー時に入れ替わるか */
  shifts: boolean;
  /** 2つのプロフィールの差の大きさ（0=同じ, 1=完全に逆） */
  shiftIndex: number;
}

/** 1位=4点, 2位=3点, 3位=2点, 4位=1点 */
export const RANK_POINTS = [4, 3, 2, 1] as const;

export const SCORE_VERSION = 1;

export function emptyScores(): Scores {
  return { S: 0, D: 0, A: 0, H: 0 };
}

export function isRanking(v: unknown): v is Ranking {
  if (!Array.isArray(v) || v.length !== 4) return false;
  const set = new Set(v);
  return set.size === 4 && STYLE_IDS.every((id) => set.has(id));
}

export function scorePhase(answers: Answers, phase: Phase): PhaseProfile {
  const questions = QUESTIONS_BY_PHASE[phase];
  const scores = emptyScores();
  for (const q of questions) {
    const r = answers[q.id];
    if (!r) continue;
    r.forEach((style, idx) => {
      scores[style] += RANK_POINTS[idx];
    });
  }
  return buildProfile(phase, scores, questions.length);
}

function buildProfile(phase: Phase, scores: Scores, nQuestions: number): PhaseProfile {
  return {
    phase,
    scores,
    order: rankStyles(scores),
    max: nQuestions * RANK_POINTS[0],
    min: nQuestions * RANK_POINTS[RANK_POINTS.length - 1],
  };
}

/** スコア降順。同点は STYLE_IDS の並び順で安定ソート */
export function rankStyles(scores: Scores, tieBreak?: Scores): StyleId[] {
  return [...STYLE_IDS].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    if (tieBreak && tieBreak[b] !== tieBreak[a]) return tieBreak[b] - tieBreak[a];
    return STYLE_IDS.indexOf(a) - STYLE_IDS.indexOf(b);
  });
}

export function isComplete(answers: Answers): boolean {
  return QUESTIONS.every((q) => isRanking(answers[q.id]));
}

export function computeResult(answers: Answers): Result {
  const normal = scorePhase(answers, "normal");
  const pressure = scorePhase(answers, "pressure");
  return resultFromProfiles(normal, pressure);
}

export function resultFromProfiles(normal: PhaseProfile, pressure: PhaseProfile): Result {
  // 同点のときはもう一方のプロフィールで決める
  const nTop = rankStyles(normal.scores, pressure.scores)[0];
  const pTop = rankStyles(pressure.scores, normal.scores)[0];
  const code = `${nTop}${pTop}` as TypeCode;
  return {
    normal,
    pressure,
    type: TYPES[code],
    shifts: nTop !== pTop,
    shiftIndex: shiftIndex(normal.order, pressure.order),
  };
}

/**
 * 順位の入れ替わり度合い。Spearman の footrule を最大値で正規化（4要素なら最大8）。
 */
export function shiftIndex(a: StyleId[], b: StyleId[]): number {
  let sum = 0;
  for (const id of STYLE_IDS) sum += Math.abs(a.indexOf(id) - b.indexOf(id));
  return sum / 8;
}

// ---------------------------------------------------------------------------
// URL 符号化：結果ページを DB なしで共有・再表示するため、スコアを文字列に畳む
// 形式: v1.<S>.<D>.<A>.<H>-<S>.<D>.<A>.<H>  (前半=通常時, 後半=プレッシャー時)
// ---------------------------------------------------------------------------

export function encodeResult(result: Pick<Result, "normal" | "pressure">): string {
  const part = (s: Scores) => STYLE_IDS.map((id) => s[id]).join(".");
  return `v${SCORE_VERSION}.${part(result.normal.scores)}-${part(result.pressure.scores)}`;
}

export function decodeResult(code: string | null | undefined): Result | null {
  if (!code) return null;
  const m = /^v(\d+)\.(\d+\.\d+\.\d+\.\d+)-(\d+\.\d+\.\d+\.\d+)$/.exec(code);
  if (!m) return null;
  if (Number(m[1]) !== SCORE_VERSION) return null;
  const parse = (phase: Phase, s: string): PhaseProfile | null => {
    const nums = s.split(".").map(Number);
    const n = QUESTIONS_BY_PHASE[phase].length;
    const max = n * RANK_POINTS[0];
    const min = n * RANK_POINTS[RANK_POINTS.length - 1];
    if (nums.some((x) => !Number.isInteger(x) || x < min || x > max)) return null;
    const total = nums.reduce((a, b) => a + b, 0);
    if (total !== n * RANK_POINTS.reduce((a, b) => a + b, 0)) return null;
    const scores = emptyScores();
    STYLE_IDS.forEach((id, i) => (scores[id] = nums[i]));
    return buildProfile(phase, scores, n);
  };
  const normal = parse("normal", m[2]);
  const pressure = parse("pressure", m[3]);
  if (!normal || !pressure) return null;
  return resultFromProfiles(normal, pressure);
}

/** 表示用: 0〜100 に正規化 */
export function toPercent(profile: PhaseProfile, id: StyleId): number {
  const span = profile.max - profile.min;
  if (span <= 0) return 0;
  return Math.round(((profile.scores[id] - profile.min) / span) * 100);
}

/** 設問データの整合性チェック（テストと起動時の保険用） */
export function validateQuestions(questions: Question[] = QUESTIONS): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const q of questions) {
    if (ids.has(q.id)) errors.push(`duplicate id: ${q.id}`);
    ids.add(q.id);
    const styles = q.statements.map((s) => s.style);
    if (!isRanking(styles)) errors.push(`${q.id}: statements must cover S/D/A/H exactly once`);
  }
  return errors;
}
