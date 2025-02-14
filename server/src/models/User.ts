import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { UserRole } from '../types/user';
import { AppError, ErrorType } from '../types/errors';

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  name: string;
  birthDate?: Date;
  birthTime?: string;
  gender?: 'male' | 'female' | 'other';
  zodiacSign?: string;
  profileImage?: string;
  role: string;
  isSubscribed: boolean;
  subscriptionPlan?: string;
  subscriptionEndDate?: Date;
  lastLoginDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  isAdmin: boolean;
  subscriptionType?: string;
  lastLoginAt: Date | null;
  isTestUser: boolean;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  password: {
    type: String,
    required: true,
    select: false,
    validate: {
      validator: function(v: string) {
        return v.length >= 8;
      },
      message: 'Password must be at least 8 characters long'
    }
  },
  name: {
    type: String,
    required: true
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
    enum: [UserRole.ADMIN, UserRole.USER, UserRole.TEST],
    default: UserRole.USER
  },
  isSubscribed: {
    type: Boolean,
    default: false
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', null],
    default: null
  },
  subscriptionEndDate: {
    type: Date
  },
  lastLoginDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscriptionType: {
    type: String
  },
  lastLoginAt: {
    type: Date,
    default: null
  },
  isTestUser: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    // パスワードが選択されていない場合は、パスワードを含めて再度ユーザーを取得
    if (!this.password) {
      const user = await User.findById(this._id).select('+password');
      if (!user) {
        throw new AppError({
          statusCode: 500,
          message: 'User not found',
          type: ErrorType.INTERNAL
        });
      }
      return await bcrypt.compare(candidatePassword, user.password);
    }
    // パスワードが既に選択されている場合は、直接比較
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    if (!isMatch) {
      throw new AppError({
        statusCode: 401,
        message: 'Invalid password',
        type: ErrorType.AUTHENTICATION
      });
    }
    return true;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError({
      statusCode: 500,
      message: 'Error comparing passwords',
      type: ErrorType.INTERNAL
    });
  }
};

// パスワードのハッシュ化
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new AppError({
      statusCode: 500,
      message: 'Error hashing password',
      type: ErrorType.INTERNAL
    }));
  }
});

export const User = mongoose.model<IUser>('User', userSchema);
