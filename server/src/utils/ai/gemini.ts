import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { Message, MessageRole } from '../../types/chat';
import { createLogger } from '../logger';

const logger = createLogger('GeminiAPI');

// Gemini APIの設定
const API_KEY = process.env.GEMINI_API_KEY || 'your_gemini_api_key';

const genAI = new GoogleGenerativeAI(API_KEY);
// 最新モデルに更新
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.0-flash-thinking-exp-01-21",
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ],
});

// チャット履歴をGemini APIの形式に変換
const convertMessagesToGeminiFormat = (messages: Message[]) => {
    return messages.map(message => ({
        role: message.role === MessageRole.USER ? 'user' : 'model',
        parts: [{ text: message.content }]
    }));
};

// Gemini APIを使用して応答を生成
export const generateGeminiResponse = async (
    message: string,
    chatHistory: Message[]
): Promise<string> => {
    try {
        const chat = model.startChat({
            history: convertMessagesToGeminiFormat(chatHistory),
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
                topP: 0.8,
                topK: 40
            }
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        logger.info('Generated response from Gemini API', {
            input: message,
            output: text
        });

        return text;
    } catch (error) {
        logger.error('Error generating response from Gemini API', { error });
        throw error;
    }
};

/**
 * 画像付きのプロンプトに対してレスポンスを生成する
 * @param prompt プロンプト
 * @param imageUrl 画像URL
 * @returns 生成されたレスポンス
 */
export async function generateGeminiVisionResponse(
  prompt: string,
  imageUrl: string
): Promise<string> {
  try {
    if (!API_KEY) {
      throw new Error('Gemini APIキーが設定されていません');
    }

    // 最新のモデルを使用して更新
    const visionModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });
    
    // 画像データの取得
    const imageResponse = await fetch(imageUrl);
    const imageData = await imageResponse.arrayBuffer();
    
    // 画像MIMEタイプの判定
    const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

    // プロンプトと画像データの準備
    const result = await visionModel.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageData).toString('base64'),
          mimeType
        }
      }
    ]);

    const response = result.response;
    
    if (!response.text()) {
      throw new Error('空のレスポンスが返されました');
    }

    return response.text();
  } catch (error) {
    console.error('Gemini Vision API error:', error);
    throw error;
  }
}

export async function generateResponse(
  message: string,
  history: Message[]
): Promise<string> {
  try {
    const responseModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash-thinking-exp-01-21" });

    const chat = responseModel.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.content }]
      }))
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    logger.error('AI応答の生成に失敗しました', { error });
    throw error;
  }
} 