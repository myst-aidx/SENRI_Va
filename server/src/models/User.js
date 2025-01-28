const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'メールアドレスは必須です'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'メールアドレスの形式が正しくありません'
        }
    },
    password: {
        type: String,
        required: [true, 'パスワードは必須です'],
        minlength: [8, 'パスワードは8文字以上である必要があります'],
        select: false
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    birthDate: {
        type: Date
    },
    birthTime: {
        type: String
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other']
    },
    zodiacSign: {
        type: String
    },
    profileImage: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'test'],
        default: process.env.NODE_ENV === 'test' ? 'test' : 'user'
    },
    isSubscribed: {
        type: Boolean,
        default: false
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'basic', 'premium', 'test'],
        default: 'free'
    },
    subscriptionEndDate: {
        type: Date
    },
    lastLoginAt: {
        type: Date
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

// パスワードのハッシュ化
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});

// パスワードの検証メソッド
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    }
    catch (error) {
        throw error;
    }
};

const User = mongoose.model('User', userSchema);

module.exports = {
    User
};
