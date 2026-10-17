"use client";

import { useState, useSyncExternalStore } from "react";
import { TIPI_INSTRUCTION, TIPI_ITEMS, TIPI_SCALE, TIPI_STEM, isTipiComplete, type TipiAnswers } from "@/lib/bga";
import { responseStorageKey } from "./QuizRunner";

function doneKey(id: string) {
  return `bga:tipi-done:${id}`;
}

function readSession(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

const noopSubscribe = () => () => {};

/**
 * 診断結果ページに置く任意アンケート。
 * 回答保存に同意した人（sessionStorage に response id がある人）にだけ出す。
 */
export function TipiSurvey({ resultCode }: { resultCode: string }) {
  const responseId = useSyncExternalStore(
    noopSubscribe,
    () => readSession(responseStorageKey(resultCode)),
    () => null,
  );
  const alreadyDone = useSyncExternalStore(
    noopSubscribe,
    () => (responseId ? readSession(doneKey(responseId)) === "1" : false),
    () => false,
  );
  const [answers, setAnswers] = useState<TipiAnswers>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!responseId) return null;
  if (alreadyDone || state === "done") {
    return (
      <section className="rounded-2xl border border-border bg-card p-5 text-sm">
        <p className="font-bold">ご協力ありがとうございました</p>
        <p className="mt-1 text-muted">いただいた回答は、BGA の妥当性検証にだけ使います。</p>
      </section>
    );
  }

  const complete = isTipiComplete(answers);

  const submit = async () => {
    setState("sending");
    try {
      const res = await fetch("/api/tipi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ responseId, answers }),
      });
      if (!res.ok) throw new Error(String(res.status));
      try {
        sessionStorage.setItem(doneKey(responseId), "1");
      } catch {
        /* noop */
      }
      setState("done");
    } catch {
      setState("error");
    }
  };

  return (
    <section className="space-y-4 rounded-2xl border border-border bg-card p-5">
      <div className="space-y-1">
        <p className="text-xs text-muted">任意・約1分</p>
        <h2 className="font-bold">精度検証にご協力ください</h2>
        <p className="text-sm leading-relaxed text-muted">
          BGA の結果が、学術的に確立された性格尺度（TIPI-J）とどう対応するかを確認しています。
          この回答は診断結果には影響しません。
        </p>
      </div>
      <p className="text-sm">{TIPI_INSTRUCTION}</p>
      <p className="text-sm font-bold">{TIPI_STEM}</p>
      <ol className="space-y-4">
        {TIPI_ITEMS.map((it) => (
          <li key={it.no} className="space-y-2">
            <p className="text-sm">
              <span className="mr-2 text-muted">{it.no}.</span>
              {it.text}
            </p>
            <div className="grid grid-cols-7 gap-1" role="radiogroup" aria-label={it.text}>
              {TIPI_SCALE.map((opt) => {
                const on = answers[it.no] === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    title={opt.label}
                    onClick={() => setAnswers({ ...answers, [it.no]: opt.value })}
                    className={`rounded-lg border py-2 text-xs tabular-nums ${
                      on ? "border-accent bg-accent text-accent-foreground" : "border-border hover:border-muted"
                    }`}
                  >
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex justify-between text-xs text-muted">
        <span>1 = {TIPI_SCALE[0].label}</span>
        <span>7 = {TIPI_SCALE[6].label}</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={submit}
          disabled={!complete || state === "sending"}
          className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-40"
        >
          {state === "sending" ? "送信中…" : "送信する"}
        </button>
        {state === "error" && <span className="text-sm text-muted">送信に失敗しました。時間をおいて再度お試しください。</span>}
      </div>
      <p className="text-xs text-muted">
        TIPI-J: 小塩・阿部・カトローニ (2012) パーソナリティ研究, 21(1), 40-52.
      </p>
    </section>
  );
}
