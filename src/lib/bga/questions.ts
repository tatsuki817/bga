import type { StyleId } from "./styles";

export type Phase = "normal" | "pressure";

export interface Statement {
  style: StyleId;
  text: string;
}

export interface Question {
  id: string;
  phase: Phase;
  /** 設問の見出し（状況の説明） */
  prompt: string;
  /** 4文。表示順はこの配列順。必ず4スタイルが1つずつ含まれる */
  statements: [Statement, Statement, Statement, Statement];
}

export const PHASE_META: Record<
  Phase,
  { title: string; lead: string; instruction: string }
> = {
  normal: {
    title: "パート1：普段のあなた",
    lead: "余裕があるとき、物事が順調に進んでいるときの自分を思い浮かべてください。",
    instruction: "4つの文を「自分に近い順」にタップして並べてください。",
  },
  pressure: {
    title: "パート2：プレッシャー下のあなた",
    lead: "締め切りが迫っている、うまくいっていない、追い詰められているときの自分を思い浮かべてください。",
    instruction: "理想ではなく「実際にそうなりがちな順」に並べてください。",
  },
};

export const QUESTIONS: Question[] = [
  // ---------------- normal ----------------
  {
    id: "n01",
    phase: "normal",
    prompt: "仕事やプロジェクトで、自分が自然にとる役割は？",
    statements: [
      { style: "S", text: "困っている人がいないか気を配り、手を差し伸べる" },
      { style: "D", text: "目標を決めて、先頭に立って引っ張る" },
      { style: "A", text: "情報を集めて整理し、確実な進め方を考える" },
      { style: "H", text: "場の空気を読んで、みんなが動きやすいように調整する" },
    ],
  },
  {
    id: "n02",
    phase: "normal",
    prompt: "新しいことを始めるとき",
    statements: [
      { style: "D", text: "まずやってみて、走りながら考える" },
      { style: "A", text: "事前に調べ、計画を立ててから着手する" },
      { style: "H", text: "周りの様子を見て、良さそうなやり方に乗っかる" },
      { style: "S", text: "誰かの役に立つかどうかを基準に決める" },
    ],
  },
  {
    id: "n03",
    phase: "normal",
    prompt: "人から頼られたとき",
    statements: [
      { style: "H", text: "相手との関係を考えて、角が立たないように対応する" },
      { style: "S", text: "自分のことを後回しにしてでも応える" },
      { style: "D", text: "引き受けたからには、自分のやり方で最短で片付ける" },
      { style: "A", text: "内容をよく確認してから、できる範囲を約束する" },
    ],
  },
  {
    id: "n04",
    phase: "normal",
    prompt: "会議や話し合いの場で",
    statements: [
      { style: "A", text: "根拠やデータを示して議論を整理する" },
      { style: "H", text: "意見の違う人の間を取り持つ" },
      { style: "S", text: "発言しづらそうな人に話を振る" },
      { style: "D", text: "結論を急ぎ、意思決定を促す" },
    ],
  },
  {
    id: "n05",
    phase: "normal",
    prompt: "自分が大切にしている価値観",
    statements: [
      { style: "D", text: "成果、スピード" },
      { style: "S", text: "誠実さ、思いやり" },
      { style: "H", text: "柔軟さ、楽しさ" },
      { style: "A", text: "正確さ、筋が通っていること" },
    ],
  },
  {
    id: "n06",
    phase: "normal",
    prompt: "言われてうれしい言葉",
    statements: [
      { style: "H", text: "「一緒にいると楽しい」" },
      { style: "A", text: "「冷静で、間違いがない」" },
      { style: "D", text: "「頼りになる、結果を出す人だ」" },
      { style: "S", text: "「優しい、いつも助けてくれる」" },
    ],
  },
  {
    id: "n07",
    phase: "normal",
    prompt: "休日の過ごし方の傾向",
    statements: [
      { style: "S", text: "家族や友人のために時間を使う" },
      { style: "A", text: "興味のあることをじっくり調べたり、作り込んだりする" },
      { style: "H", text: "友人と予定を合わせて、流れで楽しむ" },
      { style: "D", text: "目標を決めて、トレーニングや作業を進める" },
    ],
  },
  {
    id: "n08",
    phase: "normal",
    prompt: "自分の弱点だと思うこと",
    statements: [
      { style: "A", text: "慎重すぎて決断が遅れる" },
      { style: "D", text: "強引で、人の話を聞かないことがある" },
      { style: "S", text: "断れずに抱え込みすぎる" },
      { style: "H", text: "流されやすく、芯がないと言われる" },
    ],
  },
  {
    id: "n09",
    phase: "normal",
    prompt: "チームで成果を出すために一番必要だと思うこと",
    statements: [
      { style: "H", text: "風通しがよく、自由に意見が言えること" },
      { style: "D", text: "明確なゴールと、それを決める人" },
      { style: "A", text: "役割分担と手順がはっきりしていること" },
      { style: "S", text: "お互いを信頼し、支え合う関係" },
    ],
  },
  {
    id: "n10",
    phase: "normal",
    prompt: "周りからよく言われること",
    statements: [
      { style: "D", text: "行動が早い、リーダーっぽい" },
      { style: "H", text: "ノリがいい、付き合いやすい" },
      { style: "A", text: "しっかりしている、几帳面" },
      { style: "S", text: "面倒見がいい、親身" },
    ],
  },
  // ---------------- pressure ----------------
  {
    id: "p01",
    phase: "pressure",
    prompt: "締め切り直前で、間に合いそうにないとき",
    statements: [
      { style: "A", text: "残り時間でできることを冷静に洗い出し、優先順位を付ける" },
      { style: "D", text: "自分が全部巻き取ってでも、力ずくで終わらせる" },
      { style: "S", text: "周りに迷惑をかけないよう、黙って自分の時間を削る" },
      { style: "H", text: "周りに相談し、手を借りられるところを探す" },
    ],
  },
  {
    id: "p02",
    phase: "pressure",
    prompt: "強く批判されたとき",
    statements: [
      { style: "S", text: "相手の気持ちを考え、まず謝る" },
      { style: "H", text: "その場は受け流し、後で雰囲気を取り戻そうとする" },
      { style: "D", text: "言い返して、自分の正しさを主張する" },
      { style: "A", text: "感情を抑え、どこが事実でどこが誤解かを整理する" },
    ],
  },
  {
    id: "p03",
    phase: "pressure",
    prompt: "計画が崩れたとき",
    statements: [
      { style: "D", text: "とにかく動いて、別の道をこじ開ける" },
      { style: "S", text: "みんなが不安にならないよう、支えることを優先する" },
      { style: "A", text: "原因を突き止めて、計画を立て直す" },
      { style: "H", text: "状況に合わせてやり方を切り替える" },
    ],
  },
  {
    id: "p04",
    phase: "pressure",
    prompt: "対立が起きたとき",
    statements: [
      { style: "H", text: "間に入って、落としどころを探す" },
      { style: "A", text: "距離を置き、冷静になるまで様子を見る" },
      { style: "S", text: "自分が折れることで収めようとする" },
      { style: "D", text: "白黒つけるために、はっきり意見をぶつける" },
    ],
  },
  {
    id: "p05",
    phase: "pressure",
    prompt: "追い詰められたときに出やすい行動",
    statements: [
      { style: "S", text: "無理をしてでも周りの期待に応えようとする" },
      { style: "D", text: "イライラして口調がきつくなる" },
      { style: "H", text: "現実から目をそらして、とりあえず場をやり過ごす" },
      { style: "A", text: "細かいことが気になり、動けなくなる" },
    ],
  },
  {
    id: "p06",
    phase: "pressure",
    prompt: "失敗したとき",
    statements: [
      { style: "A", text: "何が悪かったのかを徹底的に分析する" },
      { style: "H", text: "気持ちを切り替え、次に行く" },
      { style: "D", text: "悔しさをバネに、すぐ挽回しようとする" },
      { style: "S", text: "迷惑をかけた人に申し訳なく、しばらく引きずる" },
    ],
  },
  {
    id: "p07",
    phase: "pressure",
    prompt: "周りが混乱しているとき",
    statements: [
      { style: "D", text: "指示を出して、強引にでもまとめる" },
      { style: "A", text: "事実を整理し、情報を共有する" },
      { style: "H", text: "明るく振る舞って、空気を和らげる" },
      { style: "S", text: "一人ひとりの様子を見て声をかける" },
    ],
  },
  {
    id: "p08",
    phase: "pressure",
    prompt: "自分のキャパを超えたとき",
    statements: [
      { style: "H", text: "誰かに愚痴を聞いてもらって、気持ちを立て直す" },
      { style: "S", text: "誰にも言えず、限界まで抱え込む" },
      { style: "A", text: "一度立ち止まり、全部をリストにして整理する" },
      { style: "D", text: "周りに仕事を振って、自分は重要なことに集中する" },
    ],
  },
  {
    id: "p09",
    phase: "pressure",
    prompt: "プレッシャー下で、周りに言われがちなこと",
    statements: [
      { style: "A", text: "「考えすぎ」「固い」" },
      { style: "D", text: "「怖い」「せっかち」" },
      { style: "S", text: "「無理しすぎ」「抱え込みすぎ」" },
      { style: "H", text: "「軽い」「本気なのか分からない」" },
    ],
  },
  {
    id: "p10",
    phase: "pressure",
    prompt: "緊張する場面の直前",
    statements: [
      { style: "D", text: "「やるしかない」と気合いを入れる" },
      { style: "S", text: "周りの人が緊張していないか気にかける" },
      { style: "H", text: "誰かと雑談して気を紛らわす" },
      { style: "A", text: "想定問答や準備を何度も確認する" },
    ],
  },
];

export const QUESTIONS_BY_PHASE: Record<Phase, Question[]> = {
  normal: QUESTIONS.filter((q) => q.phase === "normal"),
  pressure: QUESTIONS.filter((q) => q.phase === "pressure"),
};
