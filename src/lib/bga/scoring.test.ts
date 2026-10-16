import { describe, expect, it } from "vitest";
import {
  computeResult,
  decodeResult,
  encodeResult,
  isComplete,
  shiftIndex,
  validateQuestions,
  type Answers,
  type Ranking,
} from "./scoring";
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
    expect(decodeResult("v9.40.30.20.10-40.30.20.10")).toBeNull();
    // 合計が合わない
    expect(decodeResult("v1.40.40.40.40-40.30.20.10")).toBeNull();
    // 範囲外
    expect(decodeResult("v1.99.1.0.0-40.30.20.10")).toBeNull();
  });
});
