import { Request, Response } from 'express';
import { ChatHistory } from '../models/ChatHistory';
import { FortuneHistory } from '../models/FortuneHistory';
import { UserPreferences } from '../models/UserPreferences';
import { generateGeminiResponse } from '../utils/ai/gemini';
import { ErrorType, AppError, ValidationError } from '../types/errors';
import { ErrorMessages } from '../constants/errorMessages';
import { Message, MessageRole } from '../types/chat';
import { createLogger } from '../utils/logger';

const logger = createLogger('ChatController');

export class ChatController {
  // チャットセッションの開始
  static async startSession(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      
      const session = new ChatHistory({
        userId,
        messages: [{
          role: MessageRole.SYSTEM,
          content: '占い師AIアシスタントとして、ユーザーの相談に乗り、的確なアドバイスを提供します。',
          timestamp: new Date()
        }],
        metadata: {
          startTime: new Date()
        }
      });

      await session.save();
      
      res.status(201).json({
        success: true,
        userId: session.userId
      });
    } catch (error) {
      console.error('Error starting chat session:', error);
      res.status(500).json({
        success: false,
        message: 'チャットセッションの開始に失敗しました'
      });
    }
  }

  // チャット履歴の取得
  async getChatHistory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const chatHistory = await ChatHistory.findOne({ userId });

      if (!chatHistory) {
        return res.json({ messages: [] });
      }

      res.json({
        messages: chatHistory.messages.map(m => ({
          role: m.role as MessageRole,
          content: m.content
        }))
      });
    } catch (error) {
      logger.error('チャット履歴の取得に失敗しました', { error });
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // メッセージの送信
  async sendMessage(req: Request, res: Response) {
    try {
      const { message } = req.body;
      const userId = req.user.id;

      if (!message) {
        throw new ValidationError(
          ErrorMessages[ErrorType.VALIDATION].ja,
          ['メッセージが入力されていません']
        );
      }

      let chatHistory = await ChatHistory.findOne({ userId });
      
      if (!chatHistory) {
        chatHistory = new ChatHistory({
          userId,
          messages: [{
            role: MessageRole.SYSTEM,
            content: '占い師AIアシスタントとして、ユーザーの相談に乗り、的確なアドバイスを提供します。',
            timestamp: new Date()
          }]
        });
      }

      // ユーザーメッセージを追加
      chatHistory.messages.push({
        role: MessageRole.USER,
        content: message,
        timestamp: new Date()
      });

      // AIの応答を生成
      const aiResponse = await generateGeminiResponse(message, chatHistory.messages);

      // AI応答を追加
      chatHistory.messages.push({
        role: MessageRole.ASSISTANT,
        content: aiResponse,
        timestamp: new Date()
      });

      await chatHistory.save();

      res.json({
        success: true,
        message: aiResponse
      });
    } catch (error) {
      logger.error('メッセージの送信に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // セッションの終了
  static async endSession(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const session = await ChatHistory.findById(sessionId);

      if (!session) {
        throw new AppError({
          statusCode: 404,
          message: ErrorMessages[ErrorType.NOT_FOUND].ja,
          type: ErrorType.NOT_FOUND
        });
      }

      session.metadata.endTime = new Date();
      await session.save();

      res.json({
        success: true,
        message: 'セッションを終了しました'
      });
    } catch (error) {
      logger.error('セッションの終了に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // フィードバックの送信
  static async sendFeedback(req: Request, res: Response) {
    try {
      const { sessionId } = req.params;
      const { feedback } = req.body;

      if (!feedback) {
        throw new ValidationError(
          ErrorMessages[ErrorType.VALIDATION].ja,
          ['フィードバックが入力されていません']
        );
      }

      const session = await ChatHistory.findById(sessionId);

      if (!session) {
        throw new AppError({
          statusCode: 404,
          message: ErrorMessages[ErrorType.NOT_FOUND].ja,
          type: ErrorType.NOT_FOUND
        });
      }

      session.metadata.userFeedback = feedback;
      await session.save();

      res.json({
        success: true,
        message: 'フィードバックを送信しました'
      });
    } catch (error) {
      logger.error('フィードバックの送信に失敗しました', { error });
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // セッション履歴の取得
  static async getSessionHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { limit = 10, offset = 0 } = req.query;
      
      const sessions = await ChatHistory.find({ userId })
        .sort({ createdAt: -1 })
        .skip(Number(offset))
        .limit(Number(limit));

      const total = await ChatHistory.countDocuments({ userId });

      res.status(200).json({
        success: true,
        sessions,
        total
      });
    } catch (error) {
      logger.error('セッション履歴の取得に失敗しました', { error });
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }

  // チャット履歴のクリア
  async clearHistory(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      await ChatHistory.findOneAndUpdate(
        { userId },
        {
          $set: {
            messages: [{
              role: MessageRole.SYSTEM,
              content: '占い師AIアシスタントとして、ユーザーの相談に乗り、的確なアドバイスを提供します。',
              timestamp: new Date()
            }]
          }
        },
        { upsert: true }
      );

      res.json({ message: 'チャット履歴をクリアしました' });
    } catch (error) {
      logger.error('チャット履歴のクリアに失敗しました', { error });
      throw new AppError({
        statusCode: 500,
        message: ErrorMessages[ErrorType.SERVER].ja,
        type: ErrorType.SERVER
      });
    }
  }
} 