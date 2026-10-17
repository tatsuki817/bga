import { NextResponse } from "next/server";
import {
  QUESTIONS,
  SCORE_VERSION,
  computeResult,
  isComplete,
  isRanking,
  type Answers,
} from "@/lib/bga";
import { insertRow, storageEnabled } from "@/lib/server/supabase";

interface Payload {
  answers?: unknown;
  startedAt?: unknown;
  consent?: unknown;
}

/**
 * 診断の回答を匿名で保存する。
 * - 同意 (consent=true) がない場合は保存しない
 * - 個人を特定する情報（IP, UA, Cookie）は保存しない
 * - 保存先が未設定なら stored=false で 200 を返す（診断は止めない）
 */
export async function POST(req: Request) {
  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  if (body.consent !== true) {
    return NextResponse.json({ stored: false, id: null });
  }
  const answers = sanitizeAnswers(body.answers);
  if (!answers || !isComplete(answers)) {
    return NextResponse.json({ error: "incomplete answers" }, { status: 400 });
  }
  if (!storageEnabled()) {
    return NextResponse.json({ stored: false, id: null });
  }

  const result = computeResult(answers);
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : null;
  const durationMs = startedAt ? Math.max(0, Math.min(Date.now() - startedAt, 6 * 60 * 60 * 1000)) : null;

  try {
    const row = await insertRow("responses", {
      score_version: SCORE_VERSION,
      answers,
      normal_scores: result.normal.scores,
      pressure_scores: result.pressure.scores,
      type_code: result.type.code,
      normal_clear: result.dominance.normal.isClear,
      pressure_clear: result.dominance.pressure.isClear,
      shift_index: result.shiftIndex,
      duration_ms: durationMs,
    });
    return NextResponse.json({ stored: Boolean(row), id: row?.id ?? null });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ stored: false, id: null, error: "storage error" }, { status: 502 });
  }
}

function sanitizeAnswers(v: unknown): Answers | null {
  if (!v || typeof v !== "object") return null;
  const out: Answers = {};
  const ids = new Set(QUESTIONS.map((q) => q.id));
  for (const [k, r] of Object.entries(v as Record<string, unknown>)) {
    if (!ids.has(k) || !isRanking(r)) continue;
    out[k] = r;
  }
  return out;
}
