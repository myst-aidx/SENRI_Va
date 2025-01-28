import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateDreamReading(dreamContent: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `あなたは夢占いの専門家です。ユーザーの夢の内容を解釈し、以下の形式でJSONを生成してください：
{
  "dreamTheme": "夢のテーマや主要な要素の解説",
  "symbolism": "夢に登場する象徴の意味や解釈",
  "reading": "夢の総合的な解釈とメッセージ",
  "currentSituation": "現在の状況との関連",
  "advice": ["具体的なアドバイスを箇条書きで3つ程度"]
}`
        },
        {
          role: "user",
          content: `以下の夢を解釈してください：\n${dreamContent}`
        }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('APIからの応答が空です');

    const result = JSON.parse(content);
    
    // 結果を整形して返す
    return {
      dreamTheme: result.dreamTheme,
      symbolism: result.symbolism,
      reading: `あなたの夢は以下のようなメッセージを含んでいます：\n\n現在の状況との関連：\n${result.currentSituation}\n\nアドバイス：\n${result.advice.map((adv: string, i: number) => `${i + 1}. ${adv}`).join('\n')}`,
    };

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('夢の解釈に失敗しました');
  }
} 