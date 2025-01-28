import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Home,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  TrendingUp,
  Users,
  MessageCircle,
  Calendar,
  Image,
  Share2,
  BarChart2,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Globe,
  Heart,
  MessageSquare,
  Repeat2,
  BookOpen,
  X
} from 'lucide-react';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'twitter' | 'facebook' | 'youtube';
  content: string;
  images?: string[];
  scheduledDate?: string;
  status: 'draft' | 'scheduled' | 'published';
  publishedDate?: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views?: number;
  };
  tags: string[];
  category: string;
  analytics: {
    impressions: number;
    reach: number;
    engagement_rate: number;
    clicks?: number;
  };
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  targetPlatforms: string[];
  status: 'idea' | 'in_progress' | 'completed';
  dueDate?: string;
  notes: string;
}

interface SocialAnalytics {
  platform: string;
  followers: number;
  engagement_rate: number;
  posts_count: number;
  best_posting_times: string[];
  top_performing_categories: string[];
  audience_demographics: {
    age_groups: Record<string, number>;
    gender: Record<string, number>;
    locations: Record<string, number>;
  };
}

// モックデータ
const mockPosts: SocialPost[] = [
  {
    id: '1',
    platform: 'instagram',
    content: '今日の運勢をタロットで占ってみましょう！🌟\n#タロット占い #占い #スピリチュアル',
    images: ['/mock/tarot-post.jpg'],
    status: 'published',
    publishedDate: '2024-02-14T10:00:00',
    engagement: {
      likes: 156,
      comments: 23,
      shares: 12
    },
    tags: ['タロット占い', '占い', 'スピリチュアル'],
    category: '占い解説',
    analytics: {
      impressions: 2500,
      reach: 2000,
      engagement_rate: 7.8
    }
  }
];

const mockIdeas: ContentIdea[] = [
  {
    id: '1',
    title: '月間運勢特集',
    description: '各星座の月間運勢を詳しく解説する連続投稿',
    category: '運勢',
    tags: ['占星術', '運勢', '月間占い'],
    targetPlatforms: ['instagram', 'twitter'],
    status: 'idea',
    dueDate: '2024-03-01',
    notes: '12星座×4週の内容を準備する'
  }
];

const mockAnalytics: SocialAnalytics = {
  platform: 'instagram',
  followers: 1500,
  engagement_rate: 5.2,
  posts_count: 120,
  best_posting_times: ['10:00', '18:00', '21:00'],
  top_performing_categories: ['タロット', '占星術', '運勢'],
  audience_demographics: {
    age_groups: {
      '18-24': 25,
      '25-34': 45,
      '35-44': 20,
      '45+': 10
    },
    gender: {
      '女性': 75,
      '男性': 25
    },
    locations: {
      '東京': 40,
      '大阪': 20,
      '名古屋': 15,
      'その他': 25
    }
  }
};

export default function SocialMarketing() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<SocialPost[]>(mockPosts);
  const [ideas, setIdeas] = useState<ContentIdea[]>(mockIdeas);
  const [analytics, setAnalytics] = useState<SocialAnalytics>(mockAnalytics);
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [showAddIdeaModal, setShowAddIdeaModal] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'year'>('week');

  // 投稿のスケジュール
  const schedulePost = async (post: SocialPost) => {
    try {
      // TODO: API連携
      const updatedPosts = posts.map(p =>
        p.id === post.id ? { ...p, status: 'scheduled' as const } : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to schedule post:', error);
    }
  };

  // 投稿の公開
  const publishPost = async (post: SocialPost) => {
    try {
      // TODO: API連携
      const updatedPosts = posts.map(p =>
        p.id === post.id ? { ...p, status: 'published' as const, publishedDate: new Date().toISOString() } : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error('Failed to publish post:', error);
    }
  };

  // アイデアのステータス更新
  const updateIdeaStatus = (ideaId: string, status: ContentIdea['status']) => {
    const updatedIdeas = ideas.map(idea =>
      idea.id === ideaId ? { ...idea, status } : idea
    );
    setIdeas(updatedIdeas);
  };

  // プラットフォームごとのアイコンを取得
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="text-pink-400" />;
      case 'twitter':
        return <Twitter className="text-blue-400" />;
      case 'facebook':
        return <Facebook className="text-blue-600" />;
      case 'youtube':
        return <Youtube className="text-red-500" />;
      default:
        return <Globe className="text-purple-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/business')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <Home size={24} />
            <span>ホーム</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">SNSマーケティング</h1>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAnalyticsModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
              >
                <BarChart2 size={20} />
                <span>分析</span>
              </button>
              <button
                onClick={() => setShowAddPostModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus size={20} />
                <span>新規投稿</span>
              </button>
            </div>
          </div>

          {/* プラットフォーム選択 */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {['instagram', 'twitter', 'facebook', 'youtube'].map(platform => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`p-4 rounded-lg bg-purple-800/30 hover:bg-purple-700/30 transition-colors ${
                  selectedPlatform === platform ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  {getPlatformIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </div>
              </button>
            ))}
          </div>

          {/* コンテンツ管理セクション */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 投稿管理 */}
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">投稿管理</h2>
              <div className="space-y-4">
                {posts.map(post => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-900/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-2">
                        {getPlatformIcon(post.platform)}
                        <span className={`px-2 py-1 rounded text-sm ${
                          post.status === 'published' ? 'bg-green-500' :
                          post.status === 'scheduled' ? 'bg-blue-500' :
                          'bg-gray-500'
                        }`}>
                          {post.status === 'published' ? '公開済' :
                           post.status === 'scheduled' ? '予約済' :
                           '下書き'}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedPost(post)}
                          className="p-2 hover:bg-purple-700/30 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-purple-700/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm">{post.content}</p>
                    {post.images && post.images.length > 0 && (
                      <div className="mt-2 flex space-x-2">
                        {post.images.map((image, index) => (
                          <div
                            key={index}
                            className="w-16 h-16 bg-purple-700/30 rounded"
                          />
                        ))}
                      </div>
                    )}
                    <div className="mt-2 flex items-center space-x-4 text-sm text-purple-300">
                      <div className="flex items-center space-x-1">
                        <Heart size={14} />
                        <span>{post.engagement.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MessageSquare size={14} />
                        <span>{post.engagement.comments}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Repeat2 size={14} />
                        <span>{post.engagement.shares}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* コンテンツアイデア */}
            <div className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">コンテンツアイデア</h2>
                <button
                  onClick={() => setShowAddIdeaModal(true)}
                  className="flex items-center space-x-2 px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <Plus size={16} />
                  <span>アイデアを追加</span>
                </button>
              </div>
              <div className="space-y-4">
                {ideas.map(idea => (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-purple-900/30 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{idea.title}</h3>
                        <p className="text-sm text-purple-300 mt-1">
                          {idea.description}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 hover:bg-purple-700/30 rounded"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="p-2 hover:bg-purple-700/30 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {idea.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-purple-700/30 rounded-full text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm text-purple-300">
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{idea.dueDate ? new Date(idea.dueDate).toLocaleDateString() : '期限なし'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BookOpen size={14} />
                        <span>{idea.category}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* 分析モーダル */}
          {showAnalyticsModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">SNS分析</h2>
                    <button
                      onClick={() => setShowAnalyticsModal(false)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* 期間選択 */}
                  <div className="flex space-x-4 mb-6">
                    {['week', 'month', 'year'].map((range) => (
                      <button
                        key={range}
                        onClick={() => setDateRange(range as any)}
                        className={`px-4 py-2 rounded-lg ${
                          dateRange === range
                            ? 'bg-purple-600'
                            : 'bg-purple-800/30 hover:bg-purple-700/30'
                        }`}
                      >
                        {range === 'week' ? '週間' :
                         range === 'month' ? '月間' : '年間'}
                      </button>
                    ))}
                  </div>

                  {/* 主要指標 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-sm text-purple-300 mb-1">フォロワー数</h3>
                      <p className="text-2xl font-bold">{analytics.followers.toLocaleString()}</p>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-sm text-purple-300 mb-1">エンゲージメント率</h3>
                      <p className="text-2xl font-bold">{analytics.engagement_rate}%</p>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-sm text-purple-300 mb-1">投稿数</h3>
                      <p className="text-2xl font-bold">{analytics.posts_count}</p>
                    </div>
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-sm text-purple-300 mb-1">最適投稿時間</h3>
                      <p className="text-lg font-bold">{analytics.best_posting_times.join(', ')}</p>
                    </div>
                  </div>

                  {/* 詳細分析 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 年齢層分布 */}
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">年齢層分布</h3>
                      <div className="space-y-2">
                        {Object.entries(analytics.audience_demographics.age_groups).map(([age, percentage]) => (
                          <div key={age} className="flex items-center space-x-2">
                            <span className="w-20">{age}</span>
                            <div className="flex-1 bg-purple-900/50 rounded-full h-4">
                              <div
                                className="bg-purple-500 rounded-full h-4"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-12 text-right">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 地域分布 */}
                    <div className="bg-purple-800/30 rounded-lg p-4">
                      <h3 className="text-lg font-semibold mb-4">地域分布</h3>
                      <div className="space-y-2">
                        {Object.entries(analytics.audience_demographics.locations).map(([location, percentage]) => (
                          <div key={location} className="flex items-center space-x-2">
                            <span className="w-20">{location}</span>
                            <div className="flex-1 bg-purple-900/50 rounded-full h-4">
                              <div
                                className="bg-purple-500 rounded-full h-4"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-12 text-right">{percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* 新規投稿モーダル */}
          {showAddPostModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">新規投稿作成</h2>
                    <button
                      onClick={() => setShowAddPostModal(false)}
                      className="text-purple-300 hover:text-purple-100"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <form className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        プラットフォーム
                      </label>
                      <div className="flex space-x-4">
                        {['instagram', 'twitter', 'facebook', 'youtube'].map(platform => (
                          <button
                            key={platform}
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
                          >
                            {getPlatformIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        投稿内容
                      </label>
                      <textarea
                        className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg h-32"
                        placeholder="投稿内容を入力してください"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        画像
                      </label>
                      <div className="flex items-center space-x-4">
                        <button
                          type="button"
                          className="flex items-center justify-center w-24 h-24 bg-purple-800/30 rounded-lg hover:bg-purple-700/30"
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        ハッシュタグ
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                        placeholder="#タグ1 #タグ2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        投稿予約
                      </label>
                      <div className="flex space-x-4">
                        <input
                          type="date"
                          className="px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                        />
                        <input
                          type="time"
                          className="px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowAddPostModal(false)}
                        className="px-4 py-2 text-purple-300 hover:text-purple-100"
                      >
                        キャンセル
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        投稿を作成
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 
