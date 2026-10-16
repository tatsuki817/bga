"use client";

import dynamic from "next/dynamic";

const QuizRunner = dynamic(() => import("./QuizRunner").then((m) => m.QuizRunner), {
  ssr: false,
  loading: () => <div className="py-20 text-center text-muted">読み込み中…</div>,
});

export function QuizLoader() {
  return <QuizRunner />;
}
