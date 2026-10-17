import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { decodeResult } from "@/lib/bga";
import { ResultView } from "@/components/ResultView";

export async function generateMetadata({ searchParams }: PageProps<"/result">): Promise<Metadata> {
  const { r } = await searchParams;
  const code = typeof r === "string" ? r : null;
  const result = decodeResult(code);
  if (!result || !code) return { title: "診断結果" };
  const title = `${result.type.name}（${result.type.code}型）`;
  const image = `/og?r=${encodeURIComponent(code)}`;
  return {
    title,
    description: result.type.summary,
    openGraph: {
      title: `${title} | BGA 行動指針診断`,
      description: result.type.catch,
      url: `/result?r=${encodeURIComponent(code)}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | BGA 行動指針診断`,
      description: result.type.catch,
      images: [image],
    },
  };
}

export default function ResultPage({ searchParams }: PageProps<"/result">) {
  return (
    <Suspense fallback={<div className="py-20 text-center text-muted">読み込み中…</div>}>
      <ResultContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ResultContent({ searchParams }: Pick<PageProps<"/result">, "searchParams">) {
  const { r } = await searchParams;
  const result = decodeResult(typeof r === "string" ? r : null);
  if (!result) {
    return (
      <div className="space-y-4 py-16 text-center">
        <h1 className="text-xl font-bold">結果を読み込めませんでした</h1>
        <p className="text-muted">リンクが壊れているか、古い形式の可能性があります。</p>
        <Link href="/quiz" className="inline-block rounded-full bg-accent px-6 py-3 font-semibold text-accent-foreground">
          診断をはじめる
        </Link>
      </div>
    );
  }
  return <ResultView result={result} />;
}
