import { Document, Schema, model } from 'mongoose';

export interface ISurvey extends Document {
  submittedAt: Date;
  responses: Record<string, any>;
}

const surveySchema = new Schema<ISurvey>(
  {
    submittedAt: {
      type: Date,
      required: true
    },
    responses: {
      type: Schema.Types.Mixed,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Survey = model<ISurvey>('Survey', surveySchema); 