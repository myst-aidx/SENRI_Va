import { GoogleGenerativeAI, SchemaType, Content, Part } from '@google/generative-ai';
import { AIResponse, FortuneType } from '../../types';
import { FortuneError } from '../../types';
import { ChatMessage } from '../../types/chat';

// 環境変数の検証
function validateEnvironmentVariables() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new FortuneError(
      'Gemini APIキーが設定されていません。環境変数VITE_GEMINI_API_KEYを設定してください。',
      'CONFIGURATION_ERROR'
    );
  }
  return apiKey;
}

// 定数の定義
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = "gemini-2.0-flash-exp";
const TEMPERATURE = Number(import.meta.env.VITE_AI_TEMPERATURE) || 0.7;
const MAX_TOKENS = Number(import.meta.env.VITE_AI_MAX_TOKENS) || 1000;

// 姓名判断用のJSONスキーマ
const seimeiSchema = {
  type: SchemaType.OBJECT,
  properties: {
    analysis: {
      type: SchemaType.OBJECT,
      properties: {
        basic: {
          type: SchemaType.OBJECT,
          properties: {
            fiveGrids: {
              type: SchemaType.OBJECT,
              properties: {
                heaven: {
                  type: SchemaType.OBJECT,
                  properties: {
                    value: { type: SchemaType.NUMBER },
                    meaning: { type: SchemaType.STRING },
                    element: { type: SchemaType.STRING }
                  }
                },
                person: {
                  type: SchemaType.OBJECT,
                  properties: {
                    value: { type: SchemaType.NUMBER },
                    meaning: { type: SchemaType.STRING },
                    element: { type: SchemaType.STRING }
                  }
                },
                earth: {
                  type: SchemaType.OBJECT,
                  properties: {
                    value: { type: SchemaType.NUMBER },
                    meaning: { type: SchemaType.STRING },
                    element: { type: SchemaType.STRING }
                  }
                }
              }
            },
            soundVibration: {
              type: SchemaType.ARRAY,
              items: { type: SchemaType.NUMBER }
            }
          }
        },
        annualForecast: {
          type: SchemaType.OBJECT,
          properties: {
            "2024": { type: SchemaType.STRING }
          }
        }
      }
    },
    compatibility: {
      type: SchemaType.OBJECT,
      properties: {
        career: {
          type: SchemaType.ARRAY,
          items: { type: SchemaType.STRING }
        }
      }
    },
    luckyItems: {
      type: SchemaType.OBJECT,
      properties: {
        color: { type: SchemaType.STRING },
        number: { type: SchemaType.NUMBER },
        direction: { type: SchemaType.STRING }
      }
    }
  }
};

interface FortunePromptConfig {
  type: FortuneType;
  context?: string;
  format?: string;
  additionalInstructions?: string[];
}

const DEFAULT_SYSTEM_PROMPT = `
あなたは占い師として、以下の点に注意して占い結果を生成してください：

1. 具体的で実用的なアドバイスを提供
2. ポジティブな要素とチャレンジの両方をバランスよく含める
3. 相談者の自己決定を促す表現を使用
4. 科学的な裏付けのある心理学的アプローチを取り入れる
5. 結果は必ず構造化されたJSONフォーマットで返す

出力フォーマット：
{
  "fortune": {
    "summary": "全体的な運勢の要約",
    "aspects": {
      "general": "総合運",
      "love": "恋愛運",
      "work": "仕事運",
      "health": "健康運",
      "money": "金運"
    },
    "advice": ["具体的なアドバイス1", "アドバイス2", "アドバイス3"],
    "luckyItems": {
      "color": "ラッキーカラー",
      "number": "ラッキーナンバー",
      "direction": "ラッキーな方角"
    }
  }
}`;

interface CachedResponse {
  content: string;
  error?: Error;
}

const messageCache = new Map<string, string>();

const generateCacheKey = (systemPrompt: string, userInput: string, history: any[]) => {
  return `${systemPrompt}:${userInput}:${JSON.stringify(history)}`;
};

// Gemini API の生成モデルを取得するための関数
function getGenerativeModel() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  return genAI.getGenerativeModel({ model: MODEL });
}

/**
 * Gemini APIを使用してAIレスポンスを生成する
 */
export async function getGeminiResponse(
  systemPrompt: string,
  userPrompt: string,
  history: ChatMessage[] = []
): Promise<AIResponse> {
  try {
    const apiKey = validateEnvironmentVariables();
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: {
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_TOKENS,
        responseMimeType: "application/json",
        responseSchema: seimeiSchema
      }
    });

    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }] as Part[]
      })) as Content[],
      generationConfig: {
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_TOKENS
      }
    });

    const result = await chat.sendMessage(
      `${systemPrompt}\n\n${userPrompt}`
    );
    const response = await result.response;
    const text = response.text();

    return {
      content: text
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new FortuneError(
      'AI応答の生成に失敗しました',
      'AI_ERROR'
    );
  }
}

/**
 * Gemini Vision APIを使用して画像を含むAIレスポンスを生成する
 */
export async function getGeminiVisionResponse(
  systemPrompt: string,
  userPrompt: string,
  imageData: string
): Promise<AIResponse> {
  try {
    validateEnvironmentVariables();

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

    const result = await model.generateContent([
      `${DEFAULT_SYSTEM_PROMPT}\n\n${systemPrompt}`,
      userPrompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new FortuneError('Empty response from Gemini Vision API', 'AI_ERROR');
    }

    try {
      const jsonResponse = JSON.parse(text);
      return { content: JSON.stringify(jsonResponse, null, 2) };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return { 
        content: text,
        error: new FortuneError('Invalid JSON response from AI', 'AI_ERROR')
      };
    }
  } catch (error) {
    console.error('Error in getGeminiVisionResponse:', error);
    return { 
      content: '', 
      error: error instanceof FortuneError 
        ? error 
        : new FortuneError(
            error instanceof Error ? error.message : 'Unknown error occurred',
            'AI_ERROR'
          )
    };
  }
}

/**
 * 占いの種類に応じたプロンプトを生成する
 */
export function generateFortunePrompt(config: FortunePromptConfig): string {
  const { type, context = '', format = '', additionalInstructions = [] } = config;

  const baseInstructions = [
    '具体的で実用的なアドバイスを提供してください。',
    'ポジティブな要素とチャレンジの両方をバランスよく含めてください。',
    '相談者の自己決定を促す表現を使用してください。',
    '科学的な裏付けのある心理学的アプローチを取り入れてください。',
    ...additionalInstructions
  ];

  return `
占いの種類: ${type}
${context ? `コンテキスト: ${context}\n` : ''}
${format ? `出力フォーマット: ${format}\n` : ''}

指示事項:
${baseInstructions.map(instruction => `- ${instruction}`).join('\n')}
`;
}

export const getGeminiResponseCached = async (
  systemPrompt: string,
  userInput: string,
  history: any[]
): Promise<CachedResponse> => {
  try {
    // キャッシュキーを生成
    const cacheKey = generateCacheKey(systemPrompt, userInput, history);
    
    // キャッシュにヒットした場合はキャッシュから返す
    if (messageCache.has(cacheKey)) {
      return { content: messageCache.get(cacheKey)! };
    }

    // 新しいレスポンスを取得
    const aiResponse = await getGeminiResponse(systemPrompt, userInput, history);

    // エラーチェックと型変換
    if (aiResponse.error) {
      return {
        content: '',
        error: aiResponse.error instanceof Error 
          ? aiResponse.error 
          : new Error(String(aiResponse.error))
      };
    }

    // レスポンスをキャッシュに保存
    messageCache.set(cacheKey, aiResponse.content);

    // キャッシュサイズを制限（最大100件）
    if (messageCache.size > 100) {
      const firstKey = messageCache.keys().next().value;
      messageCache.delete(firstKey);
    }

    return { content: aiResponse.content };
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return { 
      content: '',
      error: error instanceof Error ? error : new Error('Unknown error occurred')
    };
  }
};

// キャッシュをクリアする関数
export const clearMessageCache = () => {
  messageCache.clear();
}; 