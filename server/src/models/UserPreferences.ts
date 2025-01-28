import mongoose, { Schema, Document } from 'mongoose';

interface IFortunePreferences {
    type?: 'tarot' | 'astrology' | 'numerology';
    autoSave?: boolean;
    showDetails?: boolean;
}

interface IAIChatPreferences {
    autoComplete?: boolean;
    suggestQuestions?: boolean;
    saveHistory?: boolean;
}

interface IDisplayPreferences {
    fontSize?: 'small' | 'medium' | 'large';
    colorScheme?: 'light' | 'dark' | 'auto';
    animationEnabled?: boolean;
}

interface IPrivacySettings {
    dataSharing?: boolean;
    activityTracking?: boolean;
    marketingEmails?: boolean;
}

export interface IUserPreferences extends Document {
    userId: string;
    theme: 'light' | 'dark';
    language: 'ja' | 'en';
    notifications: boolean;
    fortune: IFortunePreferences;
    aiChat: IAIChatPreferences;
    display: IDisplayPreferences;
    privacy: IPrivacySettings;
    createdAt: Date;
    updatedAt: Date;
}

const userPreferencesSchema = new Schema<IUserPreferences>({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'dark'
    },
    language: {
        type: String,
        enum: ['ja', 'en'],
        default: 'ja'
    },
    notifications: {
        type: Boolean,
        default: true
    },
    fortune: {
        type: {
            type: String,
            enum: ['tarot', 'astrology', 'numerology']
        },
        autoSave: {
            type: Boolean,
            default: true
        },
        showDetails: {
            type: Boolean,
            default: true
        }
    },
    aiChat: {
        autoComplete: {
            type: Boolean,
            default: true
        },
        suggestQuestions: {
            type: Boolean,
            default: true
        },
        saveHistory: {
            type: Boolean,
            default: true
        }
    },
    display: {
        fontSize: {
            type: String,
            enum: ['small', 'medium', 'large'],
            default: 'medium'
        },
        colorScheme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'auto'
        },
        animationEnabled: {
            type: Boolean,
            default: true
        }
    },
    privacy: {
        dataSharing: {
            type: Boolean,
            default: false
        },
        activityTracking: {
            type: Boolean,
            default: false
        },
        marketingEmails: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
});

// インデックスの設定
userPreferencesSchema.index({ userId: 1 }, { unique: true });

export const UserPreferences = mongoose.model<IUserPreferences>('UserPreferences', userPreferencesSchema); 