import { db, TABLES } from '../config/supabase';
import { FortuneHistory, User } from '../types/database';
import { AppError } from '../types/errors';
import { ErrorType } from '../types/errors';
import { analyzeSentiment } from '../utils/ai';

export class FortuneService {
  /**
   * 占いの実行と結果の保存
   */
  async getFortune(userId: string, question: string, fortuneType: string): Promise<FortuneHistory> {
    try {
      // ユーザーの存在確認
      const user = await db.getById<User>(TABLES.USERS, userId);
      if (!user) {
        throw new AppError({
          statusCode: 404,
          message: 'User not found',
          type: ErrorType.NOT_FOUND
        });
      }

      // AIによる占い結果の生成
      const answer = await this.generateFortuneAnswer(question, fortuneType);
      
      // 感情分析
      const sentiment = await analyzeSentiment(answer);

      // 占い結果の保存
      const fortune = await db.create<FortuneHistory>(TABLES.FORTUNE_HISTORY, {
        user_id: userId,
        fortune_type: fortuneType,
        question,
        answer,
        sentiment,
        accuracy_rating: null,
        user_feedback: null
      });

      return fortune;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Fortune telling failed',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * 占い履歴の取得
   */
  async getFortuneHistory(userId: string): Promise<FortuneHistory[]> {
    try {
      const history = await db.query<FortuneHistory>(TABLES.FORTUNE_HISTORY, {
        user_id: userId
      });

      return history;
    } catch (error) {
      throw new AppError({
        statusCode: 500,
        message: 'Failed to fetch fortune history',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * 占い結果のフィードバック登録
   */
  async provideFeedback(fortuneId: string, userId: string, rating: number, feedback?: string): Promise<FortuneHistory> {
    try {
      const fortune = await db.getById<FortuneHistory>(TABLES.FORTUNE_HISTORY, fortuneId);
      
      if (!fortune || fortune.user_id !== userId) {
        throw new AppError({
          statusCode: 404,
          message: 'Fortune not found',
          type: ErrorType.NOT_FOUND
        });
      }

      const updatedFortune = await db.update<FortuneHistory>(TABLES.FORTUNE_HISTORY, fortuneId, {
        accuracy_rating: rating,
        user_feedback: feedback
      });

      return updatedFortune;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Failed to save feedback',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * 占い結果の削除
   */
  async deleteFortune(fortuneId: string, userId: string): Promise<void> {
    try {
      const fortune = await db.getById<FortuneHistory>(TABLES.FORTUNE_HISTORY, fortuneId);
      
      if (!fortune || fortune.user_id !== userId) {
        throw new AppError({
          statusCode: 404,
          message: 'Fortune not found',
          type: ErrorType.NOT_FOUND
        });
      }

      await db.delete(TABLES.FORTUNE_HISTORY, fortuneId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Failed to delete fortune',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * AIによる占い結果の生成
   * @private
   */
  private async generateFortuneAnswer(question: string, fortuneType: string): Promise<string> {
    // ここにAIを使用した占い結果の生成ロジックを実装
    // 現在は仮の実装
    return `Your fortune for "${question}" (${fortuneType}): This is a placeholder answer.`;
  }
} 