import OpenAI from 'openai';

// 動物の定義
export const ANIMALS = {
  LION: {
    name: 'ライオン',
    traits: '自信家でリーダーシップを取りたがる。大胆で行動力があるが、威風堂々としたプライドの高さも特徴。',
    strengths: ['リーダーシップ', '決断力', '行動力'],
    weaknesses: ['頑固さ', 'プライドの高さ', '独断的'],
    career: '経営者、管理職、起業家として力を発揮します。',
    relationships: '部下や後輩の育成が得意で、強いカリスマ性を持ちます。'
  },
  TIGER: {
    name: 'トラ',
    traits: '勝負強く情熱的。挑戦的な行動を好む。自由奔放な一方で周囲をぐいぐい引っ張るパワーもある。',
    strengths: ['情熱', '行動力', '決断力'],
    weaknesses: ['衝動的', '気が短い', '独善的'],
    career: 'スポーツ選手、営業職、クリエイターとして活躍できます。',
    relationships: '情熱的な関係を築き、周囲を活気づけます。'
  },
  CHEETAH: {
    name: 'チーター',
    traits: 'スピードや行動力が売りで、やると決めたらすぐ動くタイプ。効率重視で結果を出すのが得意。',
    strengths: ['スピード', '効率性', '実行力'],
    weaknesses: ['せっかち', '飽きっぽさ', '慎重さの欠如'],
    career: 'プロジェクトマネージャー、コンサルタント、アナリストとして活躍できます。',
    relationships: '目標達成のための協力関係を重視します。'
  },
  BLACK_PANTHER: {
    name: '黒ヒョウ',
    traits: 'クールでスタイリッシュな印象を持ち、自分の美意識を大切にする。プライドが高く、スマートに振る舞いたいタイプ。',
    strengths: ['美的センス', '洗練さ', '知性'],
    weaknesses: ['完璧主義', '他人への厳しさ', '孤高'],
    career: 'デザイナー、アーティスト、ファッション関連の仕事が適性的です。',
    relationships: '質の高い関係性を求め、表面的な付き合いは避けます。'
  },
  WOLF: {
    name: 'オオカミ',
    traits: '個性的・独創的。群れるよりも一匹狼のように自分の世界観を大切にする。好きなことに没頭しやすい。',
    strengths: ['独創性', '集中力', '直感力'],
    weaknesses: ['協調性の欠如', '孤立', '頑固さ'],
    career: '研究者、作家、専門職として才能を発揮できます。',
    relationships: '深い絆を重視し、表面的な関係は避けます。'
  },
  KOALA: {
    name: 'コアラ',
    traits: 'マイペースで穏やかな性格。安心できる環境を好み安定を求める。物事をじっくり観察してから行動する慎重派。',
    strengths: ['安定性', '慎重さ', '観察力'],
    weaknesses: ['消極性', '変化への抵抗', '優柔不断'],
    career: '事務職、カウンセラー、教育者として適性があります。',
    relationships: '安定した信頼関係を大切にします。'
  },
  MONKEY: {
    name: '猿',
    traits: '好奇心旺盛で明るく社交的。周囲に元気を与えるムードメーカー。飽きっぽい面もあるが、環境に適応する柔軟性がある。',
    strengths: ['社交性', '適応力', '明るさ'],
    weaknesses: ['落ち着きのなさ', '集中力不足', '軽率さ'],
    career: '営業職、エンターテイナー、接客業で活躍できます。',
    relationships: '多くの人と良好な関係を築きます。'
  },
  ELEPHANT: {
    name: 'ゾウ',
    traits: '温厚で安定志向。ゆったりとした落ち着きを持ち、信頼感が厚い。大きな目標をコツコツと達成する力を持っている。',
    strengths: ['忍耐力', '安定性', '信頼性'],
    weaknesses: ['保守的', '融通の利かなさ', '慎重すぎる'],
    career: '公務員、金融関係、管理職として力を発揮します。',
    relationships: '長期的な信頼関係を重視します。'
  },
  PEGASUS: {
    name: 'ペガサス',
    traits: 'ロマンチストで自由を好み、常に新しい刺激を求める。発想力が豊かで、人と違う視点で物事を捉えるクリエイティブタイプ。',
    strengths: ['創造性', '先見性', '独自性'],
    weaknesses: ['現実感の欠如', '計画性の欠如', '気分屋'],
    career: 'アーティスト、クリエイター、起業家として才能を発揮できます。',
    relationships: '自由な関係性を好み、束縛を嫌います。'
  },
  SHEEP: {
    name: 'ひつじ',
    traits: '協調性が高く、周囲を和ませる。穏やかで優しく、気配り上手。集団の中で自分の居場所を作り、平和に過ごすことを好む。',
    strengths: ['協調性', '優しさ', '気配り'],
    weaknesses: ['優柔不断', '依存的', '主体性の欠如'],
    career: '介護職、サービス業、チームワークを活かせる職種が向いています。',
    relationships: '調和のとれた関係を築きます。'
  },
  RACCOON: {
    name: 'たぬき',
    traits: '社交性、柔軟性、愛嬌があるとされる。環境に合わせて自分を変えられる。',
    strengths: ['適応力', '社交性', '柔軟性'],
    weaknesses: ['優柔不断', '八方美人', '自己主張の弱さ'],
    career: '営業職、接客業、コーディネーターとして活躍できます。',
    relationships: '誰とでも仲良く付き合えます。'
  },
  DEER: {
    name: '鹿',
    traits: '細やかで繊細な感覚を持ち、優しい雰囲気。気を遣いすぎて疲れてしまうこともあるが、場の空気を読み取るのが得意。',
    strengths: ['繊細さ', '気配り', '共感力'],
    weaknesses: ['神経質', '過度の心配性', '自己主張の弱さ'],
    career: 'カウンセラー、デザイナー、芸術関連の仕事が向いています。',
    relationships: '相手の気持ちに寄り添える関係を築きます。'
  }
} as const;

// カラータイプの定義
export const COLORS = {
  RED: {
    name: '赤',
    traits: '情熱的で活動的、リーダーシップがある',
    element: '火'
  },
  BLUE: {
    name: '青',
    traits: '知的で冷静、論理的な判断ができる',
    element: '水'
  },
  YELLOW: {
    name: '黄',
    traits: '明るく社交的、コミュニケーション力が高い',
    element: '光'
  },
  GREEN: {
    name: '緑',
    traits: '自然体で安定感がある、バランス感覚に優れている',
    element: '木'
  },
  PURPLE: {
    name: '紫',
    traits: '神秘的で直感力が強い、芸術的センスがある',
    element: '霊'
  },
  BROWN: {
    name: '茶',
    traits: '堅実で実直、地に足がついている',
    element: '土'
  }
} as const;

// 生年月日から動物を計算
export function calculateAnimal(year: number, month: number, day: number): keyof typeof ANIMALS {
  const total = year + month + day;
  const animalIndex = total % 12;
  
  const animalMap: Record<number, keyof typeof ANIMALS> = {
    0: 'LION',
    1: 'TIGER',
    2: 'CHEETAH',
    3: 'BLACK_PANTHER',
    4: 'WOLF',
    5: 'KOALA',
    6: 'MONKEY',
    7: 'ELEPHANT',
    8: 'PEGASUS',
    9: 'SHEEP',
    10: 'RACCOON',
    11: 'DEER'
  };

  return animalMap[animalIndex];
}

// 生年月日からカラーを計算
export function calculateColor(year: number, month: number, day: number): keyof typeof COLORS {
  const total = year + month + day;
  const colorIndex = total % 6;
  
  const colorMap: Record<number, keyof typeof COLORS> = {
    0: 'RED',
    1: 'BLUE',
    2: 'YELLOW',
    3: 'GREEN',
    4: 'PURPLE',
    5: 'BROWN'
  };

  return colorMap[colorIndex];
}

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// AI解釈の生成
export async function generateAnimalReading(
  birthYear: number,
  birthMonth: number,
  birthDay: number
) {
  const animal = calculateAnimal(birthYear, birthMonth, birthDay);
  const color = calculateColor(birthYear, birthMonth, birthDay);
  
  const animalData = ANIMALS[animal];
  const colorData = COLORS[color];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `あなたは動物占いの専門家です。以下の情報を元に、詳細な性格分析と運勢を解説してください：

動物: ${animalData.name}
基本性格: ${animalData.traits}
長所: ${animalData.strengths.join('、')}
短所: ${animalData.weaknesses.join('、')}
カラー: ${colorData.name}
カラー特性: ${colorData.traits}
元素: ${colorData.element}

以下の形式でJSONを生成してください：
{
  "personalityAnalysis": "動物とカラーの組み合わせによる詳細な性格分析",
  "strengths": "この組み合わせならではの強み",
  "potentials": "発展の可能性と才能",
  "relationships": "対人関係での特徴と相性",
  "career": "適性のある職業や活躍できる場面",
  "advice": ["具体的なアドバイスを3つ程度"]
}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('APIからの応答が空です');

    const result = JSON.parse(content);
    
    return {
      animal: animalData.name,
      color: colorData.name,
      baseTraits: animalData.traits,
      colorTraits: colorData.traits,
      element: colorData.element,
      strengths: animalData.strengths,
      weaknesses: animalData.weaknesses,
      personalityAnalysis: result.personalityAnalysis,
      potentials: result.potentials,
      relationships: result.relationships,
      career: result.career,
      advice: result.advice
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('動物占いの解析に失敗しました');
  }
} 