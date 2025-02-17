import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from 'dotenv';

config();

const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY;

if (!GOOGLE_AI_API_KEY) {
  throw new Error('Missing Google AI API key');
}

const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

/**
 * テキストの感情分析を行う
 */
export async function analyzeSentiment(text: string): Promise<'positive' | 'neutral' | 'negative'> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      以下のテキストの感情分析を行い、'positive'、'neutral'、'negative'のいずれかで答えてください。
      回答は感情の種類のみを返してください。

      テキスト：
      ${text}
    `;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim().toLowerCase();

    if (response.includes('positive')) return 'positive';
    if (response.includes('negative')) return 'negative';
    return 'neutral';
  } catch (error) {
    console.error('Sentiment analysis failed:', error);
    return 'neutral';
  }
}

/**
 * 占い結果を生成する
 */
export async function generateFortune(question: string, fortuneType: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      あなたは占い師として以下の質問に答えてください。
      占いの種類は「${fortuneType}」です。
      回答は具体的で、希望が持てるようなものにしてください。
      ただし、過度に楽観的な内容は避けてください。

      質問：
      ${question}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Fortune generation failed:', error);
    return '申し訳ありません。現在、占いの結果を生成できません。しばらく時間をおいて再度お試しください。';
  }
}

/**
 * チャットの応答を生成する
 */
export async function generateChatResponse(message: string, context?: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
      あなたは親身なアドバイザーとして以下のメッセージに応答してください。
      回答は共感的で、具体的なアドバイスを含むようにしてください。

      ${context ? `これまでの文脈：\n${context}\n` : ''}
      
      ユーザーのメッセージ：
      ${message}
    `;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Chat response generation failed:', error);
    return '申し訳ありません。現在、応答を生成できません。しばらく時間をおいて再度お試しください。';
  }
} 