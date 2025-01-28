import mongoose, { Schema, Document } from 'mongoose';
import { MessageRole } from '../types/chat';

interface IMessage {
    role: MessageRole;
    content: string;
    timestamp: Date;
    context?: {
        fortuneType?: string;
        fortuneId?: string;
        mood?: string;
        intent?: string;
    };
}

interface IMetadata {
    startTime: Date;
    endTime?: Date;
    userFeedback?: string;
}

export interface IChatHistory extends Document {
    userId: string;
    messages: IMessage[];
    metadata: IMetadata;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
    role: {
        type: String,
        enum: Object.values(MessageRole),
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    context: {
        fortuneType: String,
        fortuneId: String,
        mood: String,
        intent: String
    }
});

const chatHistorySchema = new Schema<IChatHistory>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    messages: [messageSchema],
    metadata: {
        startTime: Date,
        endTime: Date,
        userFeedback: String
    }
}, {
    timestamps: true
});

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema); 