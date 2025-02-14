import mongoose, { Document, Schema } from 'mongoose';

export interface ISurveyResponse extends Document {
  userId?: string;
  name: string;
  email: string;
  experience: string;
  activityType: string[];
  fortuneTypes: string[];
  challenges: string[];
  deviceUsage: string;
  marketingChannels: string[];
  expectedFeatures: string[];
  importantFactors: string[];
  feedback?: string;
  submittedAt: Date;
}

const surveyResponseSchema = new Schema<ISurveyResponse>({
  userId: {
    type: String,
    ref: 'User'
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  experience: {
    type: String,
    required: true
  },
  activityType: [{
    type: String,
    required: true
  }],
  fortuneTypes: [{
    type: String,
    required: true
  }],
  challenges: [{
    type: String,
    required: true
  }],
  deviceUsage: {
    type: String,
    required: true
  },
  marketingChannels: [{
    type: String
  }],
  expectedFeatures: [{
    type: String,
    required: true
  }],
  importantFactors: [{
    type: String,
    required: true
  }],
  feedback: String,
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// インデックスの設定
surveyResponseSchema.index({ submittedAt: -1 });
surveyResponseSchema.index({ email: 1 });

export const SurveyResponse = mongoose.model<ISurveyResponse>('SurveyResponse', surveyResponseSchema); 