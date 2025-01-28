const mongoose = require('mongoose');

const fortuneHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: true,
        enum: ['horoscope', 'tarot', 'palm', 'numerology', 'dream', 'compatibility', 'general']
    },
    question: {
        type: String,
        required: true
    },
    result: {
        mainReading: {
            type: String,
            required: true
        },
        aspects: {
            love: String,
            career: String,
            health: String,
            money: String,
            general: String
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        keywords: [String],
        advice: {
            type: String,
            required: true
        },
        nextReadingRecommendation: String
    },
    userFeedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        accuracy: {
            type: Number,
            min: 0,
            max: 100
        },
        helpful: Boolean
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// インデックスの設定
fortuneHistorySchema.index({ date: -1 });
fortuneHistorySchema.index({ userId: 1, date: -1 });
fortuneHistorySchema.index({ type: 1, date: -1 });

const FortuneHistory = mongoose.model('FortuneHistory', fortuneHistorySchema);

module.exports = {
    FortuneHistory
};
