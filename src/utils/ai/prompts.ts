import { FortuneType, PromptParams, PromptResult } from '../../types';

/**
 * 占い種類に応じたプロンプトを生成する
 */
export function generatePrompt(type: FortuneType, params: PromptParams): PromptResult {
  switch (type) {
    case 'numerology':
      return generateNumerologyPrompt(params);
    default:
      throw new Error(`Unsupported fortune type: ${type}`);
  }
}

/**
 * 数秘術のプロンプトを生成する
 */
function generateNumerologyPrompt(params: PromptParams): PromptResult {
  const { destinyNumber, nameNumber, meanings } = params;

  if (!destinyNumber || !meanings) {
    throw new Error('Required parameters are missing');
  }

  const destinyMeaning = meanings[destinyNumber] || '意味が定義されていません';
  const nameMeaning = nameNumber && meanings[nameNumber] ? meanings[nameNumber] : '';

  const system = `
あなたは数秘術の専門家です。生年月日から導き出される運命数と、名前から導き出される表現数を基に、
その人の性格、才能、使命、人生の課題などを詳しく解釈し、実践的なアドバイスを提供してください。

解釈のポイント：
1. 運命数と表現数の基本的な意味
2. 両方の数字の組み合わせが示す相乗効果や課題
3. 具体的な活かし方や注意点
4. 仕事、恋愛、対人関係などの分野別アドバイス

回答は以下の構成で提供してください：

**全体的な傾向と意味**
[運命数の基本的な意味と全体的な傾向を説明]

**ポジティブな特徴**
* [箇条書きで3-5個のポジティブな特徴を列挙]

**分野別の具体的なアドバイス**
* [仕事、恋愛、対人関係などの分野別アドバイスを箇条書きで]

**実践的な行動プラン**
* [具体的な行動プランを箇条書きで]

**注意点と可能性**
* [注意点と可能性を箇条書きで]
`;

  const user = `
運命数: ${destinyNumber}
${destinyMeaning}

${nameNumber ? `表現数: ${nameNumber}\n${nameMeaning}` : ''}

上記の数秘術の情報を基に、詳しい解釈と具体的なアドバイスを提供してください。
必ず指定された構成に従って回答してください。
`;

  return { system, user };
}