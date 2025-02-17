import { db, TABLES } from '../config/supabase';
import { ChatHistory, User } from '../types/database';
import { AppError } from '../types/errors';
import { ErrorType } from '../types/errors';
import { analyzeSentiment } from '../utils/ai';

export class ChatService {
  /**
   * チャットメッセージの送信と応答の保存
   */
  async sendMessage(userId: string, message: string): Promise<ChatHistory> {
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

      // AIによる応答の生成
      const response = await this.generateResponse(message);
      
      // 感情分析
      const sentiment = await analyzeSentiment(response);

      // チャット履歴の保存
      const chat = await db.create<ChatHistory>(TABLES.CHAT_HISTORY, {
        user_id: userId,
        message,
        response,
        sentiment,
        context: null
      });

      return chat;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Failed to process chat message',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * チャット履歴の取得
   */
  async getChatHistory(userId: string): Promise<ChatHistory[]> {
    try {
      const history = await db.query<ChatHistory>(TABLES.CHAT_HISTORY, {
        user_id: userId
      });

      return history;
    } catch (error) {
      throw new AppError({
        statusCode: 500,
        message: 'Failed to fetch chat history',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * チャット履歴の削除
   */
  async deleteChat(chatId: string, userId: string): Promise<void> {
    try {
      const chat = await db.getById<ChatHistory>(TABLES.CHAT_HISTORY, chatId);
      
      if (!chat || chat.user_id !== userId) {
        throw new AppError({
          statusCode: 404,
          message: 'Chat not found',
          type: ErrorType.NOT_FOUND
        });
      }

      await db.delete(TABLES.CHAT_HISTORY, chatId);
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Failed to delete chat',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * チャット履歴の全件削除
   */
  async clearChatHistory(userId: string): Promise<void> {
    try {
      const { error } = await db.query<ChatHistory>(TABLES.CHAT_HISTORY, {
        user_id: userId
      });

      if (error) {
        throw new AppError({
          statusCode: 500,
          message: 'Failed to clear chat history',
          type: ErrorType.INTERNAL
        });
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError({
        statusCode: 500,
        message: 'Failed to clear chat history',
        type: ErrorType.INTERNAL
      });
    }
  }

  /**
   * AIによる応答の生成
   * @private
   */
  private async generateResponse(message: string): Promise<string> {
    // ここにAIを使用した応答生成ロジックを実装
    // 現在は仮の実装
    return `Response to "${message}": This is a placeholder response.`;
  }
} 