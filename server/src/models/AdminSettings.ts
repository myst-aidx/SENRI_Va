import mongoose, { Document, Schema } from 'mongoose';

export interface IAdminSettings extends Document {
  emailNotifications: boolean;
  securityAlerts: boolean;
  testUserAutoApproval: boolean;
  maxTestUsers: number;
  testPeriodDays: number;
}

const adminSettingsSchema = new Schema<IAdminSettings>({
  emailNotifications: {
    type: Boolean,
    default: true
  },
  securityAlerts: {
    type: Boolean,
    default: true
  },
  testUserAutoApproval: {
    type: Boolean,
    default: false
  },
  maxTestUsers: {
    type: Number,
    default: 100
  },
  testPeriodDays: {
    type: Number,
    default: 30
  }
});

// シングルトンとして扱うため、_idを'default'に固定
adminSettingsSchema.pre('save', function(next) {
  if (!this._id) {
    this._id = 'default';
  }
  next();
});

export const AdminSettings = mongoose.model<IAdminSettings>('AdminSettings', adminSettingsSchema); 