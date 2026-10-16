# BGA プロジェクトメモ

- Next.js 16 (App Router, `cacheComponents: true`) + TypeScript + Tailwind v4 + pnpm
- 診断ロジックは `src/lib/bga/` に純粋関数として集約。UI からはここだけを import する
- 設問・タイプ・スタイルの文言はすべてオリジナル。他社アセスメントの設問文を持ち込まない
- 変更後は `pnpm test && pnpm typecheck && pnpm lint && pnpm build` を通す
- `cacheComponents` 有効のため `export const dynamic` / `dynamicParams` は使えない。searchParams を読むページは Suspense で包む
- 本番 URL: https://bga-ten.vercel.app（Vercel、main に push で自動デプロイ）。デフォルトブランチは `main`
