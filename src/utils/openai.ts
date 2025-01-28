import OpenAI from 'openai';
import { astrologySigns, astrologyPlanets } from './astrologyData';
import { astrologyAspects, astrologyPoints, zodiacQualities, zodiacElements, planetRulers } from './astrologyAdditionalInfo';

const astrologyHouses = [
  { id: 1, name: '第1ハウス', meaning: '自己、 внешний вид、 начинания' },
  { id: 2, name: '第2ハウス', meaning: ' финансовый、 ценности、 имущество' },
  { id: 3, name: '第3ハウス', meaning: 'общение、 обучение、 братья и сестры' },
  { id: 4, name: '第4ハウス', meaning: 'семья、 дом、 корни' },
  { id: 5, name: '第5ハウス', meaning: 'творчество、 дети、 развлечения' },
  { id: 6, name: '第6ハウス', meaning: 'здоровье、 работа、 рутина' },
  { id: 7, name: '第7ハウス', meaning: 'партнерство、 брак、 отношения' },
  { id: 8, name: '第8ハウス', meaning: 'трансформация、 кризисы、 наследство' },
  { id: 9, name: '第9ハウス', meaning: 'высшее образование、 путешествия、 философия' },
  { id: 10, name: '第10ハウス', meaning: 'карьера、 статус、 достижения' },
  { id: 11, name: '第11ハウス', meaning: 'друзья、 сообщество、 надежды' },
  { id: 12, name: '第12ハウス', meaning: 'подсознание、 тайны、 духовность' }
];

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

const getOpenAIResponse = async (
  message: string,
  conversationHistory: { role: 'user' | 'model'; content: string }[],
  currentTime: Date
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // またはその他の適切なモデル
      messages: conversationHistory.map(msg =>
        msg.role === 'model'
          ? { role: 'assistant' as const, content: msg.content, name: 'assistant' as const }
          : { role: 'user' as const, content: msg.content }
      ).concat({ role: 'user', content: `あなたは占星術の知識を持つ占い師として振る舞ってください。一般的な回答は避けて、占星術の視点から回答してください。\n\nユーザーの質問：${message}\n\n現在の日時：${currentTime.toLocaleDateString()}。\n\n追加の占星術情報：\n【ハウス】${JSON.stringify(astrologyHouses)}\n【星座】${JSON.stringify(astrologySigns)}\n【惑星】${JSON.stringify(astrologyPlanets)}\n【アスペクト】${JSON.stringify(astrologyAspects)}\n【感受点】${JSON.stringify(astrologyPoints)}\n【黄道十二宮の区分】${JSON.stringify(zodiacQualities)}\n${JSON.stringify(zodiacElements)}\n【惑星の支配】${JSON.stringify(planetRulers)}` }),
    });
    return completion.choices[0].message.content || '';
  } catch (error) {
    console.error('OpenAI API エラー:', error);
    return '申し訳ありません。OpenAIとの通信でエラーが発生しました。';
  }
};

type FortuneType = 
  | 'mbti' 
  | 'tarot' 
  | 'astrology' 
  | 'numerology' 
  | 'palm' 
  | 'dream' 
  | 'animal' 
  | 'fourpillars'
  | 'fengshui'
  | 'sixstars'
  | 'sanmei';  // 算命学を追加

export async function generateResponse(
  fortuneType: FortuneType,
  context: {
    type?: string;
    reading?: any;
    additionalInfo?: any;
  },
  question: string
) {
  try {
    let systemPrompt = '';
    
    switch (fortuneType) {
      case 'mbti':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、MBTI性格診断の専門家の立場でユーザーと対話してください。${context.type}タイプについて、専門的な知識に基づいて詳しく解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;
      
      case 'tarot':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、タロット占いの専門家の立場でユーザーと対話してください。
引かれたカードの意味と、ユーザーの状況に応じた解釈を提供してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;
      
      case 'astrology':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、占星術の専門家の立場でユーザーと対話してください。
ホロスコープの解釈と、ユーザーの運勢について詳しく説明してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;
      
      case 'numerology':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、数秘術の専門家の立場でユーザーと対話してください。
数字の持つ意味と、ユーザーの人生における影響について解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'palm':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、手相占いの専門家の立場でユーザーと対話してください。
手相の特徴と、その人生への影響について詳しく解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'dream':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、夢占いの専門家の立場でユーザーと対話してください。
夢の象徴的な意味と、現実生活への示唆について解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'animal':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、動物占いの専門家の立場でユーザーと対話してください。
動物の特性と、その人の性格や運勢への影響について解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'fourpillars':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、四柱推命の専門家の立場でユーザーと対話してください。
生年月日時から導き出される運命の要素について詳しく解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'fengshui':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、風水の専門家の立場でユーザーと対話してください。
空間の気の流れと、運気への影響について詳しく解説してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;

      case 'sixstars':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、六星占術の専門家の立場でユーザーと対話してください。
本命星の特性と、年運・月運・日運について詳しく解説してください。陰陽五行の考えに基づいた解釈を提供してください。
回答は必ず日本語で、かつ親しみやすい口調でお願いします。また、回答の最後に「SENRI」という署名を入れてください。`;
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `コンテキスト情報: ${JSON.stringify(context)}
質問: ${question}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0]?.message?.content || "申し訳ありません。回答を生成できませんでした。";
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('AIからの回答の取得に失敗しました。');
  }
}

export async function generateNextQuestions(
  fortuneType: FortuneType,
  context: {
    type?: string;
    reading?: any;
    additionalInfo?: any;
  },
  currentQuestion: string,
  answer: string
) {
  try {
    let systemPrompt = '';
    
    switch (fortuneType) {
      case 'mbti':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、MBTI性格診断の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、次に聞くと良い質問を3つ提案してください。`;
        break;
      
      case 'tarot':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、タロット占いの専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、カードの解釈についてより深く理解するための質問を3つ提案してください。`;
        break;
      
      case 'astrology':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、占星術の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、ホロスコープの解釈についてより深く理解するための質問を3つ提案してください。`;
        break;
      
      case 'numerology':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、数秘術の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、数字の意味についてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'palm':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、手相占いの専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、手相の特徴についてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'dream':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、夢占いの専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、夢の意味についてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'animal':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、動物占いの専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、動物の特性についてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'fourpillars':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、四柱推命の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、運命の要素についてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'fengshui':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、風水の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、空間の気の流れについてより深く理解するための質問を3つ提案してください。`;
        break;

      case 'sixstars':
        systemPrompt = `あなたはAIアシスタント「SENRI」として、六星占術の専門家の立場でユーザーと対話してください。ユーザーの質問と、その回答を踏まえて、本命星や運勢についてより深く理解するための質問を3つ提案してください。`;
        break;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}
回答は以下のJSON形式で返してください：
{
  "questions": [
    {"text": "質問1のテキスト", "label": "質問1の短いラベル"},
    {"text": "質問2のテキスト", "label": "質問2の短いラベル"},
    {"text": "質問3のテキスト", "label": "質問3の短いラベル"}
  ]
}`
        },
        {
          role: "user",
          content: `コンテキスト情報: ${JSON.stringify(context)}
前回の質問: ${currentQuestion}
回答: ${answer}

このやり取りを踏まえて、次に聞くと良い質問を3つ提案してください。`
        }
      ],
      temperature: 0.8,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('回答が空です');

    const parsed = JSON.parse(content);
    return parsed.questions;
  } catch (error) {
    console.error('OpenAI API error:', error);
    // エラー時はデフォルトの質問を返す
    return [
      {
        text: "もう少し詳しく教えていただけますか？",
        label: "詳しく"
      },
      {
        text: "具体的な例を挙げて説明していただけますか？",
        label: "具体例"
      },
      {
        text: "この結果を日常生活でどのように活かせますか？",
        label: "活用方法"
      }
    ];
  }
}

export default openai;
export { getOpenAIResponse };
