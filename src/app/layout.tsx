import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BGA 行動指針診断",
    template: "%s | BGA 行動指針診断",
  },
  description:
    "BGA（Behavioral Guidelines Assessment）は、普段のあなたとプレッシャー下のあなたを比べて、16タイプの行動指針を示す無料診断です。",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
            <Link href="/" className="font-bold tracking-tight">
              BGA <span className="text-muted font-normal text-sm">行動指針診断</span>
            </Link>
            <nav className="flex gap-4 text-sm text-muted">
              <Link href="/types" className="hover:text-foreground">16タイプ</Link>
              <Link href="/quiz" className="hover:text-foreground">診断する</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border">
          <div className="mx-auto max-w-3xl px-4 py-6 text-xs text-muted">
            BGA は独自に設計した行動スタイル診断です。特定の商用アセスメントとは関係ありません。
          </div>
        </footer>
      </body>
    </html>
  );
}
