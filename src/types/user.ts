export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  TEST = 'test'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isAdmin: boolean;
  isTestUser: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  isPro: boolean;
  proExpiresAt?: Date;
  isSubscribed?: boolean;
  deviceInfo?: {
    type: string;
    os: string;
    browser: string;
  };
  preferences?: {
    displaySettings: {
      theme: 'light' | 'dark' | 'auto';
      language: 'ja' | 'en';
    };
    notificationSettings: {
      email: boolean;
    };
  };
}

export interface UserProfile extends User {
  fortuneTypes: string[];
  experience: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    website?: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  sessionWarning: boolean;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'canceled' | 'expired';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
}