# BGA プロジェクトメモ

- Next.js 16 (App Router, `cacheComponents: true`) + TypeScript + Tailwind v4 + pnpm
- 診断ロジックは `src/lib/bga/` に純粋関数として集約。UI からはここだけを import する
- 設問・タイプ・スタイルの文言はすべてオリジナル。他社アセスメントの設問文を持ち込まない
- 変更後は `pnpm test && pnpm typecheck && pnpm lint && pnpm build` を通す
- `cacheComponents` 有効のため `export const dynamic` / `dynamicParams` は使えない。searchParams を読むページは Suspense で包む
- 本番 URL: https://bga-ten.vercel.app（Vercel、main に push で自動デプロイ）。デフォルトブランチは `main`
- 回答保存は `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` が設定されたときだけ有効。未設定でも診断は動くこと
- 設問数・配点を変えたら `SCORE_VERSION` を上げる（古い結果 URL は無効になる）
- 理論的な位置づけ（対人円環 2 軸、TMGT、Hogan、COPE）は `src/app/basis/page.tsx` に集約。文言を変えるときは根拠ページとの整合を保つ
- OGP 画像（`src/lib/og/`）の見た目を変えて確認するときは `rm -rf .next` してからビルドする。増分ビルドだと `next start` が古い画像を返すことがあった
- ローカル検証でサーバーを止めるときは `fuser -k -TERM 3123/tcp`。`pkill -f "next start"` は自分のシェルごと落とす
