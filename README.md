# BGA 行動指針診断（Behavioral Guidelines Assessment）

「普段のあなた」と「プレッシャー下のあなた」で行動スタイルの使い方がどう変わるかを測り、
その組み合わせから 16 タイプの行動指針を示す Web 診断です。

## コンセプト

- 4 つの行動スタイル（S 支援・貢献 / D 主導・達成 / A 分析・堅実 / H 柔軟・調和）
- 2 つの場面（通常時 / プレッシャー時）を別々に回答
- 1 問につき 4 文を「自分に近い順」に並べる強制選択式（1 位 4 点 〜 4 位 1 点）
- タイプ = 通常時の優位スタイル × プレッシャー時の優位スタイル = 16 タイプ（例: `SD` 型）
- 結果はスコアを URL に埋め込んで共有（DB 不要）

LIFO などの「4 スタイル」「通常時/ストレス時」「強みの使いすぎ」という一般的な考え方を参考にした
独自モデルです。設問・タイプ名・解説文はすべてオリジナルで、特定の商用アセスメントとは無関係です。

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

## 構成

```
src/
  lib/bga/
    styles.ts      4 スタイルの定義（名前・動機・強み・使いすぎ・色）
    questions.ts   設問データ（normal 10 問 + pressure 10 問）
    types.ts       16 タイプの定義（愛称・キャッチ・概要・行動指針）
    scoring.ts     採点、同点処理、URL 符号化/復号、データ検証
    scoring.test.ts
  components/
    QuizRunner.tsx 診断 UI（タップで順位付け、localStorage に途中保存）
    ResultView.tsx 結果表示
  app/
    page.tsx            トップ
    quiz/               診断
    result/             結果（?r=v1.S.D.A.H-S.D.A.H）
    types/, types/[code]/  16 タイプ一覧と解説（静的生成）
```

設問・タイプ文言を変えたいときは `src/lib/bga/` の各ファイルだけを触れば UI に反映されます。
設問数を変えても採点・URL 検証は自動で追従します（URL 形式のバージョンは `SCORE_VERSION`）。

## ロードマップ

1. MVP: 診断・結果・URL 共有・タイプ解説（このリポジトリの現状）
2. 結果タイプ別 OGP 画像、設問の推敲とバランス調整、相性表示
3. 有料の詳細レポート、チーム診断
