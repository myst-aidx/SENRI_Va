import { NumerologyParams, NumerologyReading, NumerologyError, ERROR_CODES } from '../types';
import { getGeminiResponse } from './ai/gemini';
import { generatePrompt } from './ai/prompts';

// 数秘術の意味定義
export const NUMEROLOGY_MEANINGS: Record<number, string> = {
  1: '独立心が強く、リーダーシップがある数。創造性と独創性に優れています。',
  2: '協調性があり、外交的な数。直感力と感受性が豊かです。',
  3: '表現力が豊かで、芸術的な才能がある数。社交的で楽観的です。',
  4: '実務能力が高く、確実性を重視する数。忍耐強く、着実です。',
  5: '自由を愛し、冒険心がある数。適応力と変化を好みます。',
  6: '責任感が強く、面倒見の良い数。調和と愛情を大切にします。',
  7: '分析力に優れ、探究心がある数。精神性と知性が高いです。',
  8: '組織力があり、物事を成し遂げる力がある数。現実的で効率的です。',
  9: '博愛精神があり、奉仕の精神に富む数。理想を追求します。'
};

// 英語の文字と数値のマッピング
const englishNameMap: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

// 日本語の文字と数値のマッピング
const japaneseNameMap: Record<string, number> = {
  あ: 1, い: 2, う: 3, え: 4, お: 5,
  か: 1, き: 2, く: 3, け: 4, こ: 5,
  さ: 1, し: 2, す: 3, せ: 4, そ: 5,
  た: 1, ち: 2, つ: 3, て: 4, と: 5,
  な: 1, に: 2, ぬ: 3, ね: 4, の: 5,
  は: 1, ひ: 2, ふ: 3, へ: 4, ほ: 5,
  ま: 1, み: 2, む: 3, め: 4, も: 5,
  や: 1, ゆ: 3, よ: 5,
  ら: 1, り: 2, る: 3, れ: 4, ろ: 5,
  わ: 1, を: 6, ん: 9,
  // カタカナも同様に追加
  ア: 1, イ: 2, ウ: 3, エ: 4, オ: 5,
  カ: 1, キ: 2, ク: 3, ケ: 4, コ: 5
  // ... 他のカタカナも同様に追加
};

// 誕生日のバリデーション
function validateBirthDate(birthDate: string): void {
  if (!birthDate) {
    throw new NumerologyError('生年月日を入力してください', ERROR_CODES.INVALID_BIRTHDATE);
  }

  const date = new Date(birthDate);
  if (isNaN(date.getTime())) {
    throw new NumerologyError('有効な生年月日を入力してください', ERROR_CODES.INVALID_BIRTHDATE);
  }

  if (date > new Date()) {
    throw new NumerologyError('未来の日付は入力できません', ERROR_CODES.INVALID_BIRTHDATE);
  }
}

// 名前のバリデーション
function validateName(name: string): void {
  if (name.length > 50) {
    throw new NumerologyError('名前は50文字以内で入力してください', ERROR_CODES.INVALID_NAME);
  }

  const validCharRegex = /^[a-zA-Zぁ-んァ-ン一-龯\s]*$/;
  if (!validCharRegex.test(name)) {
    throw new NumerologyError('名前に使用できない文字が含まれています', ERROR_CODES.INVALID_NAME);
  }
}

// 名前から数秘術の数値を計算
export function calculateNameNumber(name: string): number {
  if (!name) return 0;
  
  validateName(name);
  
  const normalizedName = name.toLowerCase();
  let sum = 0;

  for (const char of normalizedName) {
    if (englishNameMap[char]) {
      sum += englishNameMap[char];
    } else if (japaneseNameMap[char]) {
      sum += japaneseNameMap[char];
    }
  }

  // 数字を1桁になるまで足し合わせる
  while (sum > 9) {
    sum = String(sum).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
}

// 誕生日から運命数を計算
export function calculateDestinyNumber(birthDate: string): number {
  validateBirthDate(birthDate);
  
  const dateStr = birthDate.replace(/\D/g, '');
  let sum = dateStr.split('').reduce((acc, digit) => acc + parseInt(digit), 0);

  // 数字を1桁になるまで足し合わせる
  while (sum > 9) {
    sum = String(sum).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
}

// ポジティブな特徴を取得
function getPositiveTraits(destinyNumber: number): string[] {
  const traitsMap: Record<number, string[]> = {
    1: [
      'リーダーシップがある',
      '独創性に優れている',
      '創造力が豊か',
      '決断力がある',
      '目標達成への意志が強い'
    ],
    2: [
      '協調性がある',
      '直感力が鋭い',
      '思いやりがある',
      '繊細な感受性',
      '平和を重んじる'
    ],
    3: [
      '表現力が豊か',
      '芸術的センスがある',
      '社交的',
      '楽観的',
      'コミュニケーション能力が高い'
    ],
    4: [
      '実務能力が高い',
      '確実性を重視する',
      '忍耐強い',
      '着実',
      '責任感がある'
    ],
    5: [
      '自由を愛する',
      '冒険心がある',
      '適応力がある',
      '変化を好む',
      '好奇心旺盛'
    ],
    6: [
      '責任感が強い',
      '面倒見が良い',
      '調和を大切にする',
      '愛情深い',
      'バランス感覚がある'
    ],
    7: [
      '分析力に優れている',
      '探究心がある',
      '精神性が高い',
      '知性がある',
      '洞察力がある'
    ],
    8: [
      '組織力がある',
      '効率的',
      '現実的',
      '目標達成力がある',
      'リーダーシップがある'
    ],
    9: [
      '博愛精神がある',
      '奉仕の精神がある',
      '理想を追求する',
      '寛容',
      '包容力がある'
    ]
  };
  return traitsMap[destinyNumber] || [];
}

// AIの応答から情報を抽出する
function parseAIResponse(response: string, destinyNumber: number): {
  description: string;
  detailedDescription: string;
  positiveTraits: string[];
  challenges: string[];
  compatibleNumbers: number[];
  luckyItems: string[];
} {
  // 全体的な傾向と意味を抽出
  const descriptionMatch = response.match(/\*\*全体的な傾向と意味\*\*\n\n([\s\S]*?)(?=\n\*\*)/);
  const description = descriptionMatch ? descriptionMatch[1].trim() : '';

  // 詳細な説明を作成
  const detailedDescription = response.replace(/\*\*/g, '').trim();

  // ポジティブな特徴を抽出
  let positiveTraits: string[] = [];
  const traitsMatch = response.match(/\*\*ポジティブな特徴\*\*\n\n([\s\S]*?)(?=\n\*\*)/);
  if (traitsMatch) {
    const traits = traitsMatch[1].split('\n').filter(line => line.trim().startsWith('*'));
    positiveTraits = traits.map(trait => trait.replace('*', '').trim());
  }
  // AIからの抽出が失敗した場合は事前定義された特徴を使用
  if (positiveTraits.length === 0) {
    positiveTraits = getPositiveTraits(destinyNumber);
  }

  // 課題を抽出
  const challenges: string[] = [];
  const challengesMatch = response.match(/\*\*注意点と可能性\*\*\n\n([\s\S]*?)$/);
  if (challengesMatch) {
    const challengeLines = challengesMatch[1].split('\n').filter(line => line.trim().startsWith('*'));
    challenges.push(...challengeLines.map(line => line.replace('*', '').trim()));
  }

  // 相性の良い数字を抽出（運命数に基づいて設定）
  const compatibleNumbers = getCompatibleNumbers(destinyNumber);

  // ラッキーアイテムを設定（運命数に基づいて設定）
  const luckyItems = getLuckyItems(destinyNumber);

  return {
    description,
    detailedDescription,
    positiveTraits,
    challenges,
    compatibleNumbers,
    luckyItems
  };
}

// 相性の良い数字を取得
function getCompatibleNumbers(destinyNumber: number): number[] {
  const compatibilityMap: Record<number, number[]> = {
    1: [3, 5, 9],
    2: [4, 6, 8],
    3: [1, 6, 9],
    4: [2, 7, 8],
    5: [1, 7, 9],
    6: [2, 3, 9],
    7: [4, 5, 8],
    8: [2, 4, 7],
    9: [1, 3, 5, 6]
  };
  return compatibilityMap[destinyNumber] || [];
}

// ラッキーアイテムを取得
function getLuckyItems(destinyNumber: number): string[] {
  const luckyItemsMap: Record<number, string[]> = {
    1: ['赤い服', '東向きの家具', 'ダイヤモンド'],
    2: ['白い服', '銀のアクセサリー', '月のモチーフ'],
    3: ['黄色い小物', '三角形のアイテム', '東向きの窓'],
    4: ['緑の植物', '四角形のアイテム', '南東向きの家具'],
    5: ['水色の小物', '星のモチーフ', '中央に置くアイテム'],
    6: ['ピンクの服', 'ハート型のアイテム', '西向きの家具'],
    7: ['紫の小物', '七芒星のモチーフ', '西向きの窓'],
    8: ['黒い服', '八角形のアイテム', '北向きの家具'],
    9: ['金色のアクセサリー', '円形のアイテム', '南向きの家具']
  };
  return luckyItemsMap[destinyNumber] || [];
}

// 数秘術の結果を生成
export async function generateNumerologyReading(params: NumerologyParams): Promise<NumerologyReading> {
  try {
    const destinyNumber = calculateDestinyNumber(params.birthDate);
    const nameNumber = params.name ? calculateNameNumber(params.name) : undefined;

    // AIを使用して解釈を生成
    const { system, user } = generatePrompt('numerology', {
      type: 'numerology',
      destinyNumber,
      nameNumber,
      meanings: NUMEROLOGY_MEANINGS,
      birthDate: params.birthDate,
      name: params.name
    });

    const aiResponse = await getGeminiResponse(system, user);
    if (aiResponse.error) {
      throw new NumerologyError('AIによる解釈の生成に失敗しました', ERROR_CODES.AI_ERROR);
    }

    // AIの応答から情報を抽出
    const {
      description,
      detailedDescription,
      positiveTraits,
      challenges,
      compatibleNumbers,
      luckyItems
    } = parseAIResponse(aiResponse.content, destinyNumber);

    return {
      type: 'numerology',
      reading: aiResponse.content,
      timestamp: new Date().toISOString(),
      birthDate: params.birthDate,
      name: params.name,
      destinyNumber,
      nameNumber,
      description,
      detailedDescription,
      positiveTraits,
      challenges,
      compatibleNumbers,
      luckyItems
    };
  } catch (error) {
    if (error instanceof NumerologyError) {
      throw error;
    }
    throw new NumerologyError(
      'エラーが発生しました',
      ERROR_CODES.UNKNOWN_ERROR
    );
  }
} 