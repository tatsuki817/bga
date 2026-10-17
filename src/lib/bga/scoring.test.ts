import { describe, expect, it } from "vitest";
import {
  MIXED_GAP,
  computeResult,
  decodeResult,
  encodeResult,
  isComplete,
  shiftIndex,
  validateQuestions,
  type Answers,
  type Ranking,
} from "./scoring";
import { TIPI_ITEMS, isTipiComplete, scoreTipi } from "./tipi";
import { QUESTIONS, QUESTIONS_BY_PHASE } from "./questions";
import { STYLE_IDS, type StyleId } from "./styles";
import { TYPES, TYPE_LIST } from "./types";

function answerAll(normal: Ranking, pressure: Ranking): Answers {
  const a: Answers = {};
  for (const q of QUESTIONS) a[q.id] = q.phase === "normal" ? normal : pressure;
  return a;
}

describe("question data", () => {
  it("is valid", () => {
    expect(validateQuestions()).toEqual([]);
  });
  it("has the same number of items per phase", () => {
    expect(QUESTIONS_BY_PHASE.normal.length).toBe(QUESTIONS_BY_PHASE.pressure.length);
  });
  it("does not always put the same style first", () => {
    const firsts = new Set(QUESTIONS.map((q) => q.statements[0].style));
    expect(firsts.size).toBe(4);
  });
  it("spreads each style across all four positions", () => {
    for (let pos = 0; pos < 4; pos++) {
      const styles = new Set(QUESTIONS.map((q) => q.statements[pos].style));
      expect(styles.size).toBe(4);
    }
  });
});

describe("type data", () => {
  it("defines all 16 codes consistently", () => {
    expect(TYPE_LIST).toHaveLength(16);
    for (const n of STYLE_IDS) {
      for (const p of STYLE_IDS) {
        const t = TYPES[`${n}${p}`];
        expect(t.normal).toBe(n);
        expect(t.pressure).toBe(p);
        expect(t.guidelines).toHaveLength(3);
      }
    }
  });
});

describe("scoring", () => {
  it("scores a consistent ranking as 4/3/2/1 per item", () => {
    const r = computeResult(answerAll(["S", "D", "A", "H"], ["D", "S", "A", "H"]));
    const n = QUESTIONS_BY_PHASE.normal.length;
    expect(r.normal.scores).toEqual({ S: 4 * n, D: 3 * n, A: 2 * n, H: 1 * n });
    expect(r.normal.order).toEqual(["S", "D", "A", "H"]);
    expect(r.pressure.order).toEqual(["D", "S", "A", "H"]);
    expect(r.type.code).toBe("SD");
    expect(r.shifts).toBe(true);
  });

  it("detects a stable type", () => {
    const r = computeResult(answerAll(["A", "H", "S", "D"], ["A", "S", "H", "D"]));
    expect(r.type.code).toBe("AA");
    expect(r.shifts).toBe(false);
  });

  it("breaks ties with the other phase", () => {
    // 通常時: 半分の設問で S 1位、残りで D 1位 → 同点。プレッシャー時に D が上なら D を採る
    const a: Answers = {};
    QUESTIONS_BY_PHASE.normal.forEach((q, i) => {
      a[q.id] = i % 2 === 0 ? ["S", "D", "A", "H"] : ["D", "S", "A", "H"];
    });
    for (const q of QUESTIONS_BY_PHASE.pressure) a[q.id] = ["D", "A", "S", "H"];
    const r = computeResult(a);
    expect(r.normal.scores.S).toBe(r.normal.scores.D);
    expect(r.type.code).toBe("DD");
  });

  it("marks a clear result when the gap is large", () => {
    const r = computeResult(answerAll(["S", "D", "A", "H"], ["D", "S", "A", "H"]));
    expect(r.dominance.normal.isClear).toBe(true);
    expect(r.dominance.pressure.isClear).toBe(true);
    expect(r.alternatives).toEqual([]);
  });

  it("offers alternative types when the top two are within MIXED_GAP", () => {
    // 通常時: S と D が同点 → 僅差。プレッシャー時は明確に A。
    const a: Answers = {};
    QUESTIONS_BY_PHASE.normal.forEach((q, i) => {
      a[q.id] = i % 2 === 0 ? ["S", "D", "A", "H"] : ["D", "S", "A", "H"];
    });
    for (const q of QUESTIONS_BY_PHASE.pressure) a[q.id] = ["A", "H", "S", "D"];
    const r = computeResult(a);
    expect(r.dominance.normal.gap).toBeLessThanOrEqual(MIXED_GAP);
    expect(r.dominance.normal.isClear).toBe(false);
    expect(r.dominance.pressure.isClear).toBe(true);
    // 同点は S/D のうちプレッシャー時に高い方が top（ここでは S）
    expect(r.type.code).toBe("SA");
    expect(r.alternatives.map((t) => t.code)).toEqual(["DA"]);
  });

  it("isComplete requires every question", () => {
    const a = answerAll(["S", "D", "A", "H"], ["S", "D", "A", "H"]);
    expect(isComplete(a)).toBe(true);
    delete a[QUESTIONS[0].id];
    expect(isComplete(a)).toBe(false);
  });

  it("shiftIndex is 0 for identical and 1 for reversed order", () => {
    const o: StyleId[] = ["S", "D", "A", "H"];
    expect(shiftIndex(o, o)).toBe(0);
    expect(shiftIndex(o, [...o].reverse())).toBe(1);
  });
});

describe("url encoding", () => {
  it("round-trips", () => {
    const r = computeResult(answerAll(["H", "A", "D", "S"], ["D", "H", "A", "S"]));
    const code = encodeResult(r);
    const back = decodeResult(code);
    expect(back).not.toBeNull();
    expect(back!.normal.scores).toEqual(r.normal.scores);
    expect(back!.pressure.scores).toEqual(r.pressure.scores);
    expect(back!.type.code).toBe(r.type.code);
  });

  it("rejects malformed or impossible input", () => {
    expect(decodeResult(null)).toBeNull();
    expect(decodeResult("garbage")).toBeNull();
    expect(decodeResult("v9.48.36.24.12-48.36.24.12")).toBeNull();
    // 旧バージョン (10 問時代) は拒否
    expect(decodeResult("v1.40.30.20.10-40.30.20.10")).toBeNull();
    // 合計が合わない
    expect(decodeResult("v2.48.48.48.48-48.36.24.12")).toBeNull();
    // 範囲外
    expect(decodeResult("v2.99.1.0.0-48.36.24.12")).toBeNull();
  });
});

describe("TIPI-J", () => {
  it("has 10 items, two per factor, one reversed each", () => {
    expect(TIPI_ITEMS).toHaveLength(10);
    for (const f of ["E", "A", "C", "N", "O"] as const) {
      const items = TIPI_ITEMS.filter((it) => it.factor === f);
      expect(items).toHaveLength(2);
      expect(items.filter((it) => it.reversed)).toHaveLength(1);
    }
  });
  it("scores with reversal (8 - x)", () => {
    const all7 = Object.fromEntries(TIPI_ITEMS.map((it) => [it.no, 7]));
    expect(isTipiComplete(all7)).toBe(true);
    const s = scoreTipi(all7);
    // 正項目 7 + 逆転項目 (8-7)=1 → 8
    expect(s).toEqual({ E: 8, A: 8, C: 8, N: 8, O: 8 });
    expect(isTipiComplete({ 1: 7 })).toBe(false);
  });
});
