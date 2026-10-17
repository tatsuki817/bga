import { NextResponse } from "next/server";
import { TIPI_ITEMS, isTipiComplete, isTipiValue, scoreTipi, type TipiAnswers } from "@/lib/bga";
import { insertRow, storageEnabled } from "@/lib/server/supabase";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** TIPI-J の任意回答を、対応する診断回答 (responses.id) に紐づけて保存する */
export async function POST(req: Request) {
  let body: { responseId?: unknown; answers?: unknown };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }
  const responseId = typeof body.responseId === "string" && UUID.test(body.responseId) ? body.responseId : null;
  if (!responseId) return NextResponse.json({ error: "invalid responseId" }, { status: 400 });

  const answers: TipiAnswers = {};
  if (body.answers && typeof body.answers === "object") {
    for (const it of TIPI_ITEMS) {
      const v = (body.answers as Record<string, unknown>)[String(it.no)];
      if (isTipiValue(v)) answers[it.no] = v;
    }
  }
  if (!isTipiComplete(answers)) return NextResponse.json({ error: "incomplete answers" }, { status: 400 });
  if (!storageEnabled()) return NextResponse.json({ stored: false });

  try {
    const row = await insertRow("tipi_responses", {
      response_id: responseId,
      answers,
      scores: scoreTipi(answers),
    });
    return NextResponse.json({ stored: Boolean(row) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ stored: false, error: "storage error" }, { status: 502 });
  }
}
