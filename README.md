# BGA 行動指針診断（Behavioral Guidelines Assessment）

「普段のあなた」と「プレッシャー下のあなた」で行動スタイルの使い方がどう変わるかを測り、
その組み合わせから 16 タイプの行動指針を示す Web 診断です。

## コンセプト

- 4 つの行動スタイル（S 支援・貢献 / D 主導・達成 / A 分析・堅実 / H 柔軟・調和）を
  対人円環モデルの 2 軸「主導性 × 親和性」の 4 象限に対応づける
- 2 つの場面（通常時 / プレッシャー時）を別々に回答。プレッシャー時の 4 スタイルはストレス対処の分類に対応
- 1 問につき 4 文を「自分に近い順」に並べる強制選択式（1 位 4 点 〜 4 位 1 点）、各場面 12 問
- タイプ = 通常時の優位スタイル × プレッシャー時の優位スタイル = 16 タイプ（例: `SD` 型）。
  1 位と 2 位が僅差（`MIXED_GAP` 点以内）のときはタイプを断定せず、近いタイプも示す
- 結果はスコアを URL に埋め込んで共有（結果表示自体に DB は不要）
- 同意した人の回答を匿名で保存し、任意の TIPI-J 回答とあわせて妥当性を検証する

参考理論と限界は `/basis` ページ（`src/app/basis/page.tsx`）にまとめてある。
設問・タイプ名・解説文はすべてオリジナルで、特定の商用アセスメントとは無関係。

## 公開 URL

- 本番: https://bga-ten.vercel.app （Vercel、`main` への push で自動デプロイ。PR ごとにプレビュー URL も発行される）

## 開発

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # 採点ロジックのテスト (vitest)
pnpm typecheck
pnpm lint
pnpm build
```

## データ保存（任意）

Supabase に匿名の回答ログを保存できる。未設定でも診断は動く（保存だけスキップ）。

1. Supabase でプロジェクトを作り、SQL Editor で `supabase/schema.sql` を実行
2. Vercel の環境変数に次を設定（Production / Preview 両方）
   - `SUPABASE_URL` : `https://xxxx.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` : service role キー（サーバー専用。`NEXT_PUBLIC_` を付けない）
3. 再デプロイ

保存されるのは回答の並び順・スコア・タイプ・所要時間のみ。IP / UA / Cookie は保存しない。
API は `src/app/api/responses/route.ts`（診断回答）と `src/app/api/tipi/route.ts`（TIPI-J）。

## OGP 画像

- トップ: `src/app/opengraph-image.tsx`
- タイプ解説: `src/app/types/[code]/opengraph-image.tsx`（16 種）
- 診断結果: `/og?r=<結果コード>`（`src/app/og/route.tsx`。スコアのバー付き）
- テンプレートは `src/lib/og/OgCard.tsx`。`next/og`（Satori）の制約で、複数の子を持つ要素は `display:flex` 必須、Fragment 不可
- フォントは Noto Sans JP（OFL 1.1）をサブセット化して `src/assets/fonts/` に同梱。
  設問やタイプ名の文言を変えたら `python3 scripts/subset-fonts.py <NotoSansJP-VF.ttf>` で作り直す

## 構成

```
src/
  lib/bga/
    styles.ts      4 スタイルの定義（2 軸上の位置・対処パターン・強み・使いすぎ・色）
    questions.ts   設問データ（normal 12 問 + pressure 12 問）
    types.ts       16 タイプの定義（愛称・キャッチ・概要・行動指針）
    scoring.ts     採点、同点処理、僅差判定と代替タイプ、URL 符号化/復号、データ検証
    tipi.ts        TIPI-J の項目と採点（妥当性検証用）
    scoring.test.ts
  lib/server/
    supabase.ts    PostgREST を叩く最小クライアント（環境変数が無ければ無効）
  components/
    QuizRunner.tsx 診断 UI（同意、タップで順位付け、localStorage に途中保存、回答送信）
    ResultView.tsx 結果表示（スコアの形が主役、タイプは補助ラベル）
    TipiSurvey.tsx 任意の TIPI-J アンケート
  app/
    page.tsx            トップ
    quiz/               診断
    result/             結果（?r=v2.S.D.A.H-S.D.A.H）
    types/, types/[code]/  16 タイプ一覧と解説（静的生成）
    basis/              モデルの根拠と限界
    og/                 結果用 OGP 画像
    opengraph-image.tsx, types/[code]/opengraph-image.tsx  OGP 画像
    api/responses, api/tipi  回答保存 API
  lib/og/               OGP テンプレートとフォント読み込み
  assets/fonts/         サブセット済み Noto Sans JP と OFL
scripts/subset-fonts.py  フォントのサブセット生成
supabase/schema.sql   回答ログのテーブル定義
```

設問・タイプ文言を変えたいときは `src/lib/bga/` の各ファイルだけを触れば UI に反映されます。
設問数を変えても採点・URL 検証は自動で追従します（URL 形式のバージョンは `SCORE_VERSION`）。

## ロードマップ

1. MVP: 診断・結果・URL 共有・タイプ解説（完了）
2. 根拠づけ: 2 軸モデル、僅差表示、回答ログと TIPI-J による検証（実装済み、データ収集中）
3. 集めたデータで項目分析・併存的妥当性・再検査信頼性を算出し `/basis` で公開
4. 結果タイプ別 OGP 画像（完了）、相性表示
5. 有料の詳細レポート、チーム診断
