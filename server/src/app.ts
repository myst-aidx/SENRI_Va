import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import fortuneRoutes from './routes/fortuneRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import chatRoutes from './routes/chatRoutes';
import userPreferencesRoutes from './routes/userPreferencesRoutes';
import fortuneHistoryRoutes from './routes/fortuneHistoryRoutes';
import adminRoutes from './routes/admin';
import surveyRoutes from './routes/surveyRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000; // Added port definition

// ミドルウェアの設定
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/fortune', fortuneRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/preferences', userPreferencesRoutes);
app.use('/api/history', fortuneHistoryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/survey', surveyRoutes);

// エラーハンドリングミドルウェアの適用（必ず他のミドルウェアの後に配置）
app.use(errorHandler);

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/senri_db';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

export default app;