"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  PHASE_META,
  QUESTIONS,
  STYLES,
  computeResult,
  encodeResult,
  isComplete,
  isRanking,
  type Answers,
  type Phase,
  type Ranking,
  type StyleId,
} from "@/lib/bga";

const STORAGE_KEY = "bga:answers:v2";
const CONSENT_KEY = "bga:consent:v1";
const STARTED_KEY = "bga:startedAt:v1";
const PHASES: Phase[] = ["normal", "pressure"];

export function responseStorageKey(code: string) {
  return `bga:response:${code}`;
}

function loadConsent(): boolean | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "1" ? true : v === "0" ? false : null;
  } catch {
    return null;
  }
}

function loadStartedAt(): number | null {
  try {
    const v = Number(localStorage.getItem(STARTED_KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch {
    return null;
  }
}

/** 回答を匿名で保存する。失敗しても診断は止めない。最大 4 秒で諦める */
async function submitResponse(answers: Answers, startedAt: number | null): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = window.setTimeout(() => ctrl.abort(), 4000);
  try {
    const res = await fetch("/api/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers, startedAt, consent: true }),
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { id?: string | null };
    return data.id ?? null;
  } catch {
    return null;
  } finally {
    window.clearTimeout(timer);
  }
}

type Screen = { kind: "intro"; phase: Phase } | { kind: "question"; index: number };

function loadAnswers(): Answers {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Answers = {};
    for (const [k, v] of Object.entries(parsed)) if (isRanking(v)) out[k] = v;
    return out;
  } catch {
    return {};
  }
}

function firstUnanswered(answers: Answers): number {
  const i = QUESTIONS.findIndex((q) => !answers[q.id]);
  return i === -1 ? QUESTIONS.length : i;
}

function initialScreen(answers: Answers): Screen {
  const idx = firstUnanswered(answers);
  if (idx <= 0 || idx >= QUESTIONS.length) return { kind: "intro", phase: "normal" };
  const q = QUESTIONS[idx];
  const prev = QUESTIONS[idx - 1];
  return prev.phase !== q.phase ? { kind: "intro", phase: q.phase } : { kind: "question", index: idx };
}

/**
 * localStorage を読むため SSR しない前提（QuizLoader から ssr:false で読み込む）。
 */
export function QuizRunner() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Answers>(loadAnswers);
  const [screen, setScreen] = useState<Screen>(() => initialScreen(loadAnswers()));
  const [picked, setPicked] = useState<StyleId[]>([]);
  const [consent, setConsent] = useState<boolean | null>(loadConsent);
  const [submitting, setSubmitting] = useState(false);

  // 途中保存
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch {
      /* 保存できなくても診断は続行できる */
    }
  }, [answers]);

  const question = screen.kind === "question" ? QUESTIONS[screen.index] : null;

  const finish = useCallback(
    async (nextAnswers: Answers) => {
      const code = encodeResult(computeResult(nextAnswers));
      setSubmitting(true);
      if (consent) {
        const id = await submitResponse(nextAnswers, loadStartedAt());
        if (id) {
          try {
            sessionStorage.setItem(responseStorageKey(code), id);
          } catch {
            /* noop */
          }
        }
      }
      try {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(STARTED_KEY);
      } catch {
        /* noop */
      }
      router.push(`/result?r=${code}`);
    },
    [consent, router],
  );

  const goNext = useCallback(
    (nextAnswers: Answers, fromIndex: number) => {
      const nextIndex = fromIndex + 1;
      if (nextIndex >= QUESTIONS.length) {
        if (isComplete(nextAnswers)) void finish(nextAnswers);
        return;
      }
      const next = QUESTIONS[nextIndex];
      const cur = QUESTIONS[fromIndex];
      setPicked([]);
      setScreen(next.phase !== cur.phase ? { kind: "intro", phase: next.phase } : { kind: "question", index: nextIndex });
    },
    [finish],
  );

  const start = (phase: Phase, agreed?: boolean) => {
    if (phase === "normal") {
      const c = agreed ?? consent ?? false;
      setConsent(c);
      try {
        localStorage.setItem(CONSENT_KEY, c ? "1" : "0");
        if (!loadStartedAt()) localStorage.setItem(STARTED_KEY, String(Date.now()));
      } catch {
        /* noop */
      }
    }
    setPicked([]);
    setScreen({ kind: "question", index: QUESTIONS.findIndex((q) => q.phase === phase) });
  };

  const tap = (style: StyleId) => {
    if (!question) return;
    const at = picked.indexOf(style);
    if (at !== -1) {
      // 選択済みをタップ → そこ以降を取り消す
      setPicked(picked.slice(0, at));
      return;
    }
    const next = [...picked, style];
    setPicked(next);
    if (next.length === 4) {
      const ranking = next as Ranking;
      const nextAnswers = { ...answers, [question.id]: ranking };
      setAnswers(nextAnswers);
      window.setTimeout(() => goNext(nextAnswers, screen.kind === "question" ? screen.index : 0), 350);
    }
  };

  const goBack = () => {
    if (screen.kind !== "question" || screen.index === 0) return;
    const prevIndex = screen.index - 1;
    setPicked([]);
    setScreen({ kind: "question", index: prevIndex });
  };

  const restart = () => {
    setAnswers({});
    setPicked([]);
    try {
      localStorage.removeItem(STARTED_KEY);
    } catch {
      /* noop */
    }
    setScreen({ kind: "intro", phase: "normal" });
  };

  const progress = useMemo(() => {
    const done = screen.kind === "question" ? screen.index : firstUnanswered(answers);
    return Math.round((done / QUESTIONS.length) * 100);
  }, [screen, answers]);

  if (submitting) {
    return <div className="py-20 text-center text-muted">結果を計算しています…</div>;
  }

  if (screen.kind === "intro") {
    const meta = PHASE_META[screen.phase];
    const isFirst = screen.phase === "normal";
    return (
      <div className="mx-auto max-w-xl space-y-6 py-10 text-center">
        <p className="text-sm text-muted">
          {PHASES.indexOf(screen.phase) + 1} / {PHASES.length}
        </p>
        <h1 className="text-2xl font-bold">{meta.title}</h1>
        <p className="text-muted leading-relaxed">{meta.lead}</p>
        <p className="rounded-2xl border border-border bg-card p-4 text-sm">{meta.instruction}</p>

        {isFirst ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-4 text-left text-sm leading-relaxed">
              <p className="font-bold">回答データの扱い</p>
              <p className="mt-1 text-muted">
                同意いただいた場合、回答内容とスコアを匿名で保存し、設問の改善と診断の妥当性検証に使います。
                氏名・メールアドレス・IPアドレスなど個人を特定する情報は収集しません。
                同意しなくても診断は同じように受けられます。
              </p>
            </div>
            <button
              onClick={() => start("normal", true)}
              className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground hover:opacity-90"
            >
              同意してはじめる
            </button>
            <div>
              <button onClick={() => start("normal", false)} className="text-sm text-muted underline underline-offset-4 hover:text-foreground">
                同意せずにはじめる
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => start("pressure")}
            className="rounded-full bg-accent px-8 py-3 font-semibold text-accent-foreground hover:opacity-90"
          >
            はじめる
          </button>
        )}
      </div>
    );
  }

  if (!question) return null;
  const phaseQuestions = QUESTIONS.filter((q) => q.phase === question.phase);
  const numberInPhase = phaseQuestions.findIndex((q) => q.id === question.id) + 1;

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{PHASE_META[question.phase].title}</span>
          <span>
            {numberInPhase} / {phaseQuestions.length}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-border">
          <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-1">
        <h2 className="text-xl font-bold leading-snug">{question.prompt}</h2>
        <p className="text-sm text-muted">自分に近い順にタップ（{picked.length}/4）</p>
      </div>

      <ul className="space-y-3">
        {question.statements.map((st) => {
          const rank = picked.indexOf(st.style);
          const selected = rank !== -1;
          return (
            <li key={st.style}>
              <button
                type="button"
                onClick={() => tap(st.style)}
                className={`flex w-full items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  selected ? "border-accent bg-card" : "border-border bg-card hover:border-muted"
                }`}
              >
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${
                    selected ? "border-transparent text-white" : "border-border text-muted"
                  }`}
                  style={selected ? { backgroundColor: STYLES[st.style].color } : undefined}
                >
                  {selected ? rank + 1 : ""}
                </span>
                <span className="leading-relaxed">{st.text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-between text-sm">
        <button onClick={goBack} disabled={screen.index === 0} className="text-muted disabled:opacity-30 hover:text-foreground">
          ← 前の質問
        </button>
        <div className="flex gap-4">
          <button onClick={() => setPicked([])} className="text-muted hover:text-foreground">
            選び直す
          </button>
          <button onClick={restart} className="text-muted hover:text-foreground">
            最初から
          </button>
        </div>
      </div>
    </div>
  );
}
