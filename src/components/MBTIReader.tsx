import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { z } from 'zod';
import { saveMBTIResult } from '../utils/mbtiStorage';
import { MBTIResultSchema } from '../types/mbti';
import LoadingSpinner from './LoadingSpinner';

type Dimension = 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
type Question = {
  id: number;
  dimension: keyof typeof dimensionMap;
  text: string;
  options: Option[];
};

type Option = {
  text: string;
  value: number; // -2 to 2
};

const dimensionMap = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P']
} as const;

// 完全な質問リスト
const questions: Question[] = [
  // 外向(E) - 内向(I)
  {
    id: 1,
    dimension: 'EI',
    text: '新しい環境ではどのように振る舞いますか？',
    options: [
      { text: '積極的に人と関わり、会話を楽しむ', value: 2 },
      { text: '様子を見ながら、慎重に行動する', value: -2 }
    ]
  },
  {
    id: 2,
    dimension: 'EI',
    text: 'エネルギーの充電方法は？',
    options: [
      { text: '友人と会って話をする', value: 2 },
      { text: '一人で静かに過ごす', value: -2 }
    ]
  },
  {
    id: 3,
    dimension: 'EI',
    text: 'グループ活動での役割は？',
    options: [
      { text: '積極的に意見を出し、議論をリードする', value: 2 },
      { text: '他の人の意見を聞き、じっくり考える', value: -2 }
    ]
  },
  {
    id: 4,
    dimension: 'EI',
    text: '休日の過ごし方として理想的なのは？',
    options: [
      { text: '友人とアクティビティを楽しむ', value: 2 },
      { text: '家でゆっくり好きなことをする', value: -2 }
    ]
  },
  {
    id: 5,
    dimension: 'EI',
    text: '問題に直面したとき、どうする？',
    options: [
      { text: '誰かに相談して解決策を探る', value: 2 },
      { text: '一人で考えて解決策を見つける', value: -2 }
    ]
  },
  // 感覚(S) - 直感(N)
  {
    id: 6,
    dimension: 'SN',
    text: '物事を理解する際に重視するのは？',
    options: [
      { text: '具体的な事実やデータ', value: 2 },
      { text: '直感や可能性', value: -2 }
    ]
  },
  {
    id: 7,
    dimension: 'SN',
    text: '仕事や学習で重視するのは？',
    options: [
      { text: '実践的で具体的な経験', value: 2 },
      { text: '理論的な理解と概念', value: -2 }
    ]
  },
  {
    id: 8,
    dimension: 'SN',
    text: '未来についてどう考える？',
    options: [
      { text: '現実的な計画を立てる', value: 2 },
      { text: '様々な可能性を想像する', value: -2 }
    ]
  },
  {
    id: 9,
    dimension: 'SN',
    text: '新しいプロジェクトを始めるとき？',
    options: [
      { text: '既存の方法を活用する', value: 2 },
      { text: '新しいアプローチを試みる', value: -2 }
    ]
  },
  {
    id: 10,
    dimension: 'SN',
    text: '物事を説明するとき？',
    options: [
      { text: '具体的な例を挙げて説明', value: 2 },
      { text: '全体的な概念から説明', value: -2 }
    ]
  },
  // 思考(T) - 感情(F)
  {
    id: 11,
    dimension: 'TF',
    text: '決定を下す際の基準は？',
    options: [
      { text: '論理的な分析と客観的事実', value: 2 },
      { text: '個人的な価値観と感情', value: -2 }
    ]
  },
  {
    id: 12,
    dimension: 'TF',
    text: '他人との対立が起きたとき？',
    options: [
      { text: '公平性と論理を重視', value: 2 },
      { text: '調和と感情に配慮', value: -2 }
    ]
  },
  {
    id: 13,
    dimension: 'TF',
    text: 'フィードバックを与えるとき？',
    options: [
      { text: '率直に事実を指摘する', value: 2 },
      { text: '相手の気持ちに配慮する', value: -2 }
    ]
  },
  {
    id: 14,
    dimension: 'TF',
    text: '成功を評価する基準は？',
    options: [
      { text: '目標達成度と効率', value: 2 },
      { text: '人々への影響と満足度', value: -2 }
    ]
  },
  {
    id: 15,
    dimension: 'TF',
    text: '問題解決のアプローチは？',
    options: [
      { text: '客観的な分析と解決', value: 2 },
      { text: '関係者の感情を考慮', value: -2 }
    ]
  },
  // 判断(J) - 知覚(P)
  {
    id: 16,
    dimension: 'JP',
    text: '日常生活の過ごし方は？',
    options: [
      { text: '計画を立てて行動する', value: 2 },
      { text: '状況に応じて柔軟に対応', value: -2 }
    ]
  },
  {
    id: 17,
    dimension: 'JP',
    text: '締め切りへの対応は？',
    options: [
      { text: '早めに完了させる', value: 2 },
      { text: '期限直前まで調整する', value: -2 }
    ]
  },
  {
    id: 18,
    dimension: 'JP',
    text: '仕事場の環境は？',
    options: [
      { text: '整理整頓された状態を保つ', value: 2 },
      { text: '創造的な混沌を受け入れる', value: -2 }
    ]
  },
  {
    id: 19,
    dimension: 'JP',
    text: '予定の立て方は？',
    options: [
      { text: '詳細な計画を立てる', value: 2 },
      { text: '大まかな方針だけ決める', value: -2 }
    ]
  },
  {
    id: 20,
    dimension: 'JP',
    text: '変更への対応は？',
    options: [
      { text: '事前に準備して対応', value: 2 },
      { text: '臨機応変に対応', value: -2 }
    ]
  }
];

// タイプ説明データ
const typeDescriptions = {
  INTJ: {
    name: '建築家',
    description: '想像力豊かで戦略的な思考を持つ革新者。論理的で目標達成に向けて計画的に行動します。',
    detailedDescription: 'INTJタイプは、複雑な問題を解決することに長けた戦略家です。独創的なアイデアと論理的な分析力を組み合わせ、効率的なソリューションを生み出します。常に知識を追求し、自己改善を心がけます。リーダーシップを発揮する際は、明確なビジョンと実行計画を示し、チームを目標達成に導きます。ただし、感情面での配慮が必要な場面では意識的な努力が求められます。',
    strengths: ['戦略的思考', '独創的な問題解決', '高い分析力', '長期的なビジョン'],
    weaknesses: ['感情表現が苦手', '完璧主義', '人間関係の構築に時間がかかる'],
    compatibleTypes: ['ENTP', 'ENTJ', 'ENFP', 'INFJ'],
    careers: ['研究者', 'エンジニア', '戦略コンサルタント', 'アーキテクト']
  },
  INTP: {
    name: '論理学者',
    description: '革新的なアイデアを持つ発明家タイプ。論理的な分析と理論的な探求を好みます。',
    detailedDescription: 'INTPタイプは、知的好奇心が強く、複雑な理論や概念を理解することに長けています。物事の本質を理解しようとする探究心が強く、独創的な解決策を見出すことができます。しかし、理論に没頭するあまり、実践面や人間関係の構築がおろそかになることがあります。柔軟な思考と適応力を活かし、チームでの協力を意識的に心がけることで、より効果的に能力を発揮できます。',
    strengths: ['論理的思考', '創造性', '客観的分析', '概念的理解'],
    weaknesses: ['実践的な実行力が弱い', '社交性が低い', '細部への注意が散漫'],
    compatibleTypes: ['ENTJ', 'ESTJ', 'ENFJ', 'INFJ'],
    careers: ['プログラマー', '数学者', '哲学者', 'システムアナリスト']
  },
  ENTJ: {
    name: '指揮官',
    description: 'カリスマ的なリーダーシップを持つ決断力のある実行者。効率と成果を重視します。',
    detailedDescription: 'ENTJタイプは、生まれながらのリーダーとして、組織やプロジェクトを効率的に導く能力を持っています。戦略的な思考と決断力を組み合わせ、目標達成に向けて周囲を動かすことができます。しかし、時として感情面への配慮が不足し、周囲との軋轢を生むことがあります。リーダーシップの発揮と同時に、チームメンバーの感情や意見にも耳を傾けることで、より効果的な組織運営が可能になります。',
    strengths: ['リーダーシップ', '戦略的思考', '決断力', '目標達成力'],
    weaknesses: ['感情への配慮不足', '過度な支配的傾向', '忍耐力の不足'],
    compatibleTypes: ['INTP', 'ENTP', 'INFJ', 'INTJ'],
    careers: ['経営者', 'プロジェクトマネージャー', '政治家', '起業家']
  },
  ENTP: {
    name: '討論者',
    description: '知的好奇心旺盛で革新的なアイデアを生み出す発明家タイプ。議論を楽しみます。',
    detailedDescription: 'ENTPタイプは、新しいアイデアを生み出し、それを周囲と共有することを得意とします。知的な議論を通じて、問題の本質を探り、革新的な解決策を見出すことができます。しかし、興味の移り変わりが早く、プロジェクトの完遂に課題を感じることがあります。アイデアの実現に向けて、計画性と持続性を意識的に高めることで、より大きな成果を上げることができます。',
    strengths: ['創造性', '適応力', '分析力', 'コミュニケーション力'],
    weaknesses: ['気が散りやすい', '規律性の欠如', '感情への配慮不足'],
    compatibleTypes: ['INTJ', 'INFJ', 'ENTJ', 'ENFJ'],
    careers: ['起業家', '発明家', 'マーケター', 'コンサルタント']
  },
  INFJ: {
    name: '提唱者',
    description: '静かな理想主義者で、深い洞察力と創造性を持ちます。他者の成長をサポートします。',
    detailedDescription: 'INFJタイプは、人々の感情や動機を深く理解し、その成長を支援することに喜びを見出します。直感的な洞察力と共感力を組み合わせ、他者の可能性を引き出すことができます。しかし、理想を追求するあまり、現実との折り合いに苦心することがあります。自身の理想と現実のバランスを取りながら、周囲への影響力を発揮することで、より効果的な支援が可能になります。',
    strengths: ['洞察力', '創造性', '献身的', '誠実さ'],
    weaknesses: ['完璧主義', '批判に敏感', '燃え尽き症候群になりやすい'],
    compatibleTypes: ['ENFP', 'ENTP', 'INTJ', 'INFP'],
    careers: ['カウンセラー', '作家', '教師', 'セラピスト']
  },
  INFP: {
    name: '仲介者',
    description: '理想主義的で共感力が高く、創造的な夢想家タイプ。深い感情と価値観を持ちます。',
    detailedDescription: 'INFPタイプは、豊かな想像力と深い感情を持ち、人々の内面的な成長を支援することに長けています。独自の価値観と創造性を活かし、他者との調和を図りながら、理想の実現に向けて努力します。しかし、現実世界での実践や決断に時間がかかることがあります。理想と現実のバランスを意識し、具体的な行動計画を立てることで、より効果的に目標を達成できます。',
    strengths: ['創造性', '共感力', '適応力', '理想主義'],
    weaknesses: ['現実との折り合いが難しい', '優柔不断', '批判に敏感'],
    compatibleTypes: ['ENFJ', 'ENTJ', 'INFJ', 'INTJ'],
    careers: ['作家', 'アーティスト', 'カウンセラー', '心理学者']
  },
  ENFJ: {
    name: '主人公',
    description: 'カリスマ的な指導者で、他者の成長と調和を重視します。理想を追求する情熱家です。',
    detailedDescription: 'ENFJタイプは、人々を導き、その成長を支援することに情熱を注ぎます。カリスマ性と共感力を組み合わせ、チームの調和を保ちながら、目標達成に向けて導くことができます。しかし、他者への配慮が過度になり、自身のニーズを後回しにすることがあります。自己と他者のバランスを意識し、適切な境界線を設けることで、より持続的なリーダーシップを発揮できます。',
    strengths: ['リーダーシップ', '共感力', 'コミュニケーション力', '組織力'],
    weaknesses: ['過度な人pleaser', '批判に敏感', '自己犠牲的'],
    compatibleTypes: ['INFP', 'ISFP', 'INTP', 'INTJ'],
    careers: ['教師', 'カウンセラー', 'トレーナー', 'マネージャー']
  },
  ENFP: {
    name: '広報運動家',
    description: '熱心で創造的な自由人。可能性を探求し、他者との関係を大切にします。',
    detailedDescription: 'ENFPタイプは、新しい可能性を見出し、それを周囲と共有することに喜びを感じます。創造性と共感力を組み合わせ、革新的なアイデアを生み出しながら、人々との関係を深めることができます。しかし、興味の移り変わりが早く、プロジェクトの完遂に課題を感じることがあります。優先順位を明確にし、計画的に行動することで、より大きな成果を上げることができます。',
    strengths: ['創造性', '熱意', '適応力', 'コミュニケーション力'],
    weaknesses: ['集中力が続かない', '優柔不断', '現実的な計画が苦手'],
    compatibleTypes: ['INTJ', 'INFJ', 'ENTJ', 'ENTP'],
    careers: ['ジャーナリスト', 'アーティスト', 'コンサルタント', '起業家']
  },
  ISTJ: {
    name: '管理者',
    description: '実践的で事実に基づいた判断を行う責任感のある実行者。秩序と伝統を重んじます。',
    detailedDescription: 'ISTJタイプは、確立された方法と手順に従って、効率的に業務を遂行することに長けています。正確性と信頼性を重視し、責任感を持って目標達成に取り組みます。しかし、新しい方法や変化への適応に時間がかかることがあります。柔軟性を意識的に高め、新しい視点も取り入れることで、より効果的な問題解決が可能になります。',
    strengths: ['組織力', '信頼性', '実践的', '注意深さ'],
    weaknesses: ['柔軟性の不足', '変化への抵抗', '感情表現が苦手'],
    compatibleTypes: ['ESFP', 'ESTP', 'ISFJ', 'INFJ'],
    careers: ['会計士', '管理職', '警察官', '軍人']
  },
  ISFJ: {
    name: '擁護者',
    description: '献身的で思いやりのある保護者タイプ。詳細に注意を払い、他者をサポートします。',
    detailedDescription: 'ISFJタイプは、他者のニーズに敏感で、実践的なサポートを提供することに長けています。細部への注意力と思いやりの心を組み合わせ、安定した環境を作り出すことができます。しかし、自己主張が苦手で、過度な負担を抱え込むことがあります。適切な境界線を設定し、自身のニーズも大切にすることで、より効果的なサポートが可能になります。',
    strengths: ['信頼性', '実践的', '思いやり', '忍耐力'],
    weaknesses: ['変化への抵抗', '自己主張の弱さ', 'NO と言えない'],
    compatibleTypes: ['ESFP', 'ESTP', 'ISTJ', 'INFJ'],
    careers: ['看護師', '教師', '管理職', 'カスタマーサービス']
  },
  ESTJ: {
    name: '幹部',
    description: '実践的で事実に基づいた判断を行う管理者タイプ。効率と伝統を重視します。',
    detailedDescription: 'ESTJタイプは、明確な目標と手順に基づいて、組織を効率的に運営することに長けています。実践的なリーダーシップと組織力を組み合わせ、確実な結果を出すことができます。しかし、感情面への配慮が不足し、柔軟性に欠けることがあります。他者の感情や新しい視点にも耳を傾けることで、より効果的な組織運営が可能になります。',
    strengths: ['組織力', 'リーダーシップ', '実践的', '信頼性'],
    weaknesses: ['柔軟性の不足', '感情への配慮不足', '独断的'],
    compatibleTypes: ['ISTP', 'ISFP', 'ISTJ', 'ISFJ'],
    careers: ['管理職', '軍人', '警察官', '法律家']
  },
  ESFJ: {
    name: '領事官',
    description: '思いやりのある社交的な管理者。調和と協力を重視し、他者をサポートします。',
    detailedDescription: 'ESFJタイプは、人々の調和と幸福を重視し、実践的なサポートを提供することに長けています。社交性と組織力を組み合わせ、チームの結束を高めることができます。しかし、批判や対立を避けすぎる傾向があり、必要な変化を躊躇することがあります。建設的な対話を心がけ、適切な変革も受け入れることで、より効果的な支援が可能になります。',
    strengths: ['思いやり', '実践的', '組織力', '協調性'],
    weaknesses: ['批判に敏感', '変化への抵抗', '承認欲求が強い'],
    compatibleTypes: ['ISFP', 'ISTP', 'ENFP', 'ENTP'],
    careers: ['教師', '看護師', 'カウンセラー', 'マネージャー']
  },
  ISTP: {
    name: '巧師',
    description: '物事の仕組みを理解し、実践的なソリューションを見つける探究者タイプ。',
    detailedDescription: 'ISTPタイプは、物事の仕組みを理解し、実践的な問題解決を行うことに長けています。技術的な洞察力と適応力を組み合わせ、効率的なソリューションを見出すことができます。しかし、長期的な計画や感情面での交流に課題を感じることがあります。計画性と対人関係のスキルを意識的に高めることで、より効果的な問題解決が可能になります。',
    strengths: ['技術力', '適応力', '問題解決力', '実践的'],
    weaknesses: ['感情表現が苦手', '長期的計画が苦手', '約束を守るのが苦手'],
    compatibleTypes: ['ESTJ', 'ENTJ', 'ISFJ', 'INFJ'],
    careers: ['エンジニア', '職人', 'プログラマー', '建築家']
  },
  ISFP: {
    name: '冒険家',
    description: '芸術的で感性豊かな探究者。自由と美を追求し、独自の表現方法を持ちます。',
    detailedDescription: 'ISFPタイプは、芸術的な感性と実践的なスキルを組み合わせ、独創的な表現を行うことに長けています。自由な精神と適応力を活かし、新しい体験から学びを得ることができます。しかし、長期的な計画や自己主張に課題を感じることがあります。目標設定と自己表現のスキルを意識的に高めることで、より効果的な創造活動が可能になります。',
    strengths: ['創造性', '適応力', '思いやり', '実践的'],
    weaknesses: ['長期的計画が苦手', '自己主張の弱さ', '批判に敏感'],
    compatibleTypes: ['ENFJ', 'ESFJ', 'ISFJ', 'INFJ'],
    careers: ['アーティスト', 'デザイナー', '音楽家', 'セラピスト']
  },
  ESTP: {
    name: '起業家',
    description: '行動力があり、リスクを恐れない冒険者タイプ。現実的な問題解決を得意とします。',
    detailedDescription: 'ESTPタイプは、即座の行動と実践的な問題解決を得意とします。適応力と決断力を組み合わせ、効率的にリスクを管理しながら目標を達成することができます。しかし、長期的な計画や感情面での配慮に課題を感じることがあります。戦略的思考と対人関係のスキルを意識的に高めることで、より持続的な成功が可能になります。',
    strengths: ['行動力', '適応力', '問題解決力', '実践的'],
    weaknesses: ['長期的計画が苦手', '細部への注意不足', '忍耐力の不足'],
    compatibleTypes: ['ISFJ', 'ISTJ', 'ESFJ', 'ENFJ'],
    careers: ['起業家', 'セールス', 'スポーツ選手', '警察官']
  },
  ESFP: {
    name: 'エンターテイナー',
    description: '自由奔放で人生を楽しむ演技者タイプ。社交的で、現在を生きることを大切にします。',
    detailedDescription: 'ESFPタイプは、人々を楽しませ、現在の瞬間を最大限に活かすことに長けています。社交性と創造性を組み合わせ、周囲に活力を与えることができます。しかし、長期的な計画や深い分析に課題を感じることがあります。目標設定と実行力を意識的に高めることで、より持続的な成功が可能になります。',
    strengths: ['社交性', '適応力', '実践的', '創造性'],
    weaknesses: ['長期的計画が苦手', '集中力が続かない', '深い分析が苦手'],
    compatibleTypes: ['ISFJ', 'ISTJ', 'ESFJ', 'ENFJ'],
    careers: ['エンターテイナー', '営業', 'イベントプランナー', 'カウンセラー']
  }
} as const;

export default function MBTIReader() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(0));
  const [result, setResult] = useState<z.infer<typeof MBTIResultSchema> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // MBTIタイプを計算
  const calculateMBTI = useCallback(() => {
    setIsLoading(true);
    try {
      // 各次元のスコアを集計
      const scores = questions.reduce((acc, q, index) => {
        const dimension = q.dimension;
        acc[dimension] = (acc[dimension] || 0) + answers[index];
        return acc;
      }, {} as Record<keyof typeof dimensionMap, number>);

      // スコアに基づいてタイプを決定
      const type = (Object.entries(dimensionMap) as [keyof typeof dimensionMap, [Dimension, Dimension]][])
        .map(([dimension, [positive, negative]]) => 
          scores[dimension] >= 0 ? positive : negative
        )
        .join('') as keyof typeof typeDescriptions;

      const typeData = typeDescriptions[type];
      
      // 結果オブジェクトを作成
      const resultData = MBTIResultSchema.parse({
        type,
        name: typeData.name,
        description: typeData.description,
        detailedDescription: typeData.detailedDescription,
        strengths: typeData.strengths,
        weaknesses: typeData.weaknesses,
        compatibleTypes: typeData.compatibleTypes,
        careers: typeData.careers,
        scores,
        timestamp: new Date().toISOString()
      });

      setResult(resultData);
      saveMBTIResult(resultData);
      navigate('/fortune/mbti/result');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました');
      }
    } finally {
      setIsLoading(false);
    }
  }, [answers, navigate]);

  // 最後の質問に答えた後、結果を計算
  useEffect(() => {
    if (currentStep === questions.length) {
      calculateMBTI();
    }
  }, [currentStep, calculateMBTI]);

  if (isLoading) {
    return <LoadingSpinner message="MBTI性格診断を分析しています..." />;
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            再試行
          </button>
          <button
            onClick={() => navigate('/fortune')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded"
          >
            占い選択に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-8">
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-center mt-2 text-sm text-gray-300">
          {currentStep + 1} / {questions.length}
        </p>
      </div>

      {currentStep < questions.length && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <h3 className="text-xl font-medium text-gray-100">
                {questions[currentStep].text}
              </h3>
              <div className="space-y-4">
                {questions[currentStep].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newAnswers = [...answers];
                      newAnswers[currentStep] = option.value;
                      setAnswers(newAnswers);
                      if (currentStep < questions.length - 1) {
                        setCurrentStep(prev => prev + 1);
                      } else {
                        calculateMBTI();
                      }
                    }}
                    className={`w-full p-4 text-left rounded-lg border transition-all duration-200 hover:bg-purple-900 hover:border-purple-500 ${
                      answers[currentStep] === option.value
                        ? 'border-purple-500 bg-purple-900 text-white'
                        : 'border-gray-600 text-gray-300'
                    }`}
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="mt-8 flex justify-center gap-4">
        <button
          onClick={() => navigate('/fortune')}
          className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
        >
          占い選択に戻る
        </button>
      </div>
    </div>
  );
} 