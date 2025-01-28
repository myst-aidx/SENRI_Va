import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Home,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  Star,
  Heart,
  TrendingUp,
  MessageCircle,
  Tag,
  MapPin,
  DollarSign,
  AlertCircle,
  FileText,
  BarChart2,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  X
} from 'lucide-react';

// 顧客プロファイルの型定義
interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  address: string;
  firstVisit: string;
  lastVisit: string;
  totalVisits: number;
  totalSpent: number;
  averageSpent: number;
  favoriteService: string;
  tags: string[];
  notes: string;
  zodiacSign: string;
  bloodType: string;
  preferences: {
    communicationStyle: string;
    interests: string[];
    concerns: string[];
  };
  consultationHistory: ConsultationRecord[];
  upcomingAppointments: Appointment[];
  customerJourney: {
    stage: 'new' | 'regular' | 'loyal' | 'inactive';
    lastInteraction: string;
    nextAction: string;
  };
  insights: {
    title: string;
    description: string;
    type: 'positive' | 'negative' | 'neutral';
  }[];
}

// 占い相談記録の型定義
interface ConsultationRecord {
  id: string;
  date: string;
  service: string;
  duration: number;
  cost: number;
  mainTopics: string[];
  insights: string;
  clientRecommendations: string;
  followUpRequired: boolean;
  followUpNotes: string;
  customerFeedback: {
    rating: number;
    comment: string;
  };
  cards?: {
    position: string;
    card: string;
    interpretation: string;
    isReversed?: boolean;
    additionalNotes?: string;
  }[];
  numerology?: {
    numbers: Record<string, number>;
    interpretation: string;
    lifePathNumber?: number;
    destinyNumber?: number;
    soulUrgeNumber?: number;
    personalityNumber?: number;
  };
  astrology?: {
    aspects: string[];
    interpretation: string;
    sunSign?: string;
    moonSign?: string;
    ascendant?: string;
    significantPlanets?: {
      planet: string;
      sign: string;
      house: number;
      interpretation: string;
    }[];
  };
  fourPillars?: {
    year: {
      stem: string;
      branch: string;
      element: string;
    };
    month: {
      stem: string;
      branch: string;
      element: string;
    };
    day: {
      stem: string;
      branch: string;
      element: string;
    };
    hour: {
      stem: string;
      branch: string;
      element: string;
    };
    interpretation: string;
    luckyElements: string[];
    challengeElements: string[];
  };
  palmistry?: {
    lifeLineAnalysis: string;
    heartLineAnalysis: string;
    headLineAnalysis: string;
    fateLineAnalysis: string;
    specialMarks: string[];
    overallInterpretation: string;
  };
  clientState: {
    emotionalState: string;
    mainConcerns: string[];
    physicalObservations?: string[];
    energyReading?: string;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
    rituals?: string[];
    crystals?: string[];
    elements?: string[];
  };
  followUp: {
    required: boolean;
    suggestedDate?: string;
    focus: string[];
    preparationNeeded?: string[];
  };
  notes: {
    private: string[];
    patterns: string[];
    insights: string[];
    warnings?: string[];
  };
}

// 予約の型定義
interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  duration: number;
  cost: number;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'online' | 'offline';
  notes: string;
}

// モックデータ
const mockCustomerProfile: CustomerProfile = {
  id: 'C001',
  name: '山田花子',
  email: 'hanako@example.com',
  phone: '090-1234-5678',
  birthDate: '1985-07-15',
  gender: '女性',
  address: '東京都渋谷区',
  firstVisit: '2023-10-01',
  lastVisit: '2024-02-14',
  totalVisits: 8,
  totalSpent: 98000,
  averageSpent: 12250,
  favoriteService: 'タロット占い',
  tags: ['仕事相談', '恋愛相談', 'リピーター'],
  notes: '丁寧なカウンセリングを好む。直接的なアドバイスよりも、選択肢を提示する方が効果的。',
  zodiacSign: '蟹座',
  bloodType: 'A型',
  preferences: {
    communicationStyle: '共感的',
    interests: ['キャリア', '自己啓発', '人間関係'],
    concerns: ['職場での人間関係', '将来のキャリアパス']
  },
  consultationHistory: [
    {
      id: 'CS001',
      date: '2024-02-14',
      service: 'タロット占い',
      duration: 60,
      cost: 15000,
      mainTopics: ['キャリア', '人間関係', '自己実現'],
      insights: '現在の職場での人間関係に不安を感じているが、潜在的なリーダーシップの素質がある。内なる声に従う時期に来ている。',
      clientRecommendations: '新しいプロジェクトへの参加を検討することで、スキルアップとネットワーク構築の機会を得られる。',
      followUpRequired: true,
      followUpNotes: '3ヶ月後のキャリアの進展について確認が必要',
      customerFeedback: {
        rating: 5,
        comment: '具体的なアドバイスが参考になった。特に、内なる声を聴くというアドバイスが心に響いた。'
      },
      cards: [
        {
          position: '現状',
          card: '女帝',
          interpretation: '創造性とリーダーシップの素質が開花する時期',
          isReversed: false,
          additionalNotes: '特に創造的なプロジェクトでの活躍が期待される'
        },
        {
          position: '課題',
          card: '隠者',
          interpretation: '内なる声に耳を傾け、自己理解を深める必要性',
          isReversed: false,
          additionalNotes: '瞑想や自己分析の時間を設けることを推奨'
        },
        {
          position: '結果',
          card: '星',
          interpretation: '希望に満ちた未来への道筋が開ける',
          isReversed: false,
          additionalNotes: '特に4-5月に大きな転機が訪れる可能性'
        }
      ],
      clientState: {
        emotionalState: '不安と期待が入り混じった状態',
        mainConcerns: ['職場での評価', '将来のキャリアパス', 'ワークライフバランス'],
        physicalObservations: ['やや疲れた様子', '声のトーンは明るい'],
        energyReading: '前向きなエネルギーが感じられるが、不安要素も存在'
      },
      actionPlan: {
        immediate: [
          '毎朝10分の瞑想',
          '職場での小さな決断から始める主体性の発揮'
        ],
        shortTerm: [
          '新規プロジェクトへの参加検討',
          'チーム内でのコミュニケーション強化'
        ],
        longTerm: [
          'リーダーシップスキルの開発',
          'キャリアビジョンの明確化'
        ],
        rituals: [
          '満月時の浄化瞑想',
          '朝の感謝の習慣化'
        ],
        crystals: [
          'アメジスト（直感力の強化）',
          'シトリン（自信の向上）'
        ]
      },
      followUp: {
        required: true,
        suggestedDate: '2024-05-14',
        focus: [
          'キャリアの進展状況',
          '新規プロジェクトの成果',
          '精神面での変化'
        ],
        preparationNeeded: [
          '実践した施策のメモ',
          '気づきの日記'
        ]
      },
      notes: {
        private: [
          '直感的な判断力が強い',
          'リーダーシップの素質あり'
        ],
        patterns: [
          '決断を先送りにする傾向',
          '他者の評価を気にしすぎる'
        ],
        insights: [
          '内なる声を信じる必要性',
          '創造性を活かせる場面を求めている'
        ],
        warnings: [
          'バーンアウトに注意',
          '完璧主義的な傾向への注意'
        ]
      }
    },
    {
      id: 'CS002',
      date: '2024-03-01',
      service: '四柱推命',
      duration: 90,
      cost: 20000,
      mainTopics: ['人生の方向性', '適性', '時期の運勢'],
      insights: '木の気が強く、創造性と成長の可能性を秘めている。現在は変化の時期に入っており、新しい挑戦に適している。',
      clientRecommendations: '創造的な分野でのキャリア展開を検討。特に企画や戦略立案での活躍が期待できる。',
      followUpRequired: true,
      followUpNotes: '半年後の運勢の変化を確認',
      customerFeedback: {
        rating: 5,
        comment: '自分の特性について深い理解が得られた。キャリアの方向性が明確になった。'
      },
      fourPillars: {
        year: {
          stem: '甲',
          branch: '寅',
          element: '木'
        },
        month: {
          stem: '丙',
          branch: '午',
          element: '火'
        },
        day: {
          stem: '己',
          branch: '卯',
          element: '土'
        },
        hour: {
          stem: '辛',
          branch: '酉',
          element: '金'
        },
        interpretation: '木の気が強く、創造性と成長の可能性を秘めている。火の気が支援的に働き、情熱と行動力を後押しする。',
        luckyElements: ['木', '火'],
        challengeElements: ['金', '土']
      },
      clientState: {
        emotionalState: '前向きで意欲的',
        mainConcerns: ['キャリアの方向性', '適性の活かし方'],
        physicalObservations: ['姿勢が良い', '表情が明るい'],
        energyReading: '成長への意欲が強く感じられる'
      },
      actionPlan: {
        immediate: [
          '東の方位での活動を増やす',
          '緑色の小物を身につける'
        ],
        shortTerm: [
          'クリエイティブな趣味の開始',
          'チーム内でのリーダーシップ発揮'
        ],
        longTerm: [
          '起業や独立の検討',
          'クリエイティブ分野でのスキル開発'
        ]
      },
      followUp: {
        required: true,
        suggestedDate: '2024-09-01',
        focus: [
          '運勢の変化',
          'キャリアの進展',
          '人間関係の変化'
        ]
      },
      notes: {
        private: [
          '木の気が非常に強い',
          '創造性の発揮が鍵'
        ],
        patterns: [
          '新しいことへの挑戦を好む',
          '直感的な判断が的確'
        ],
        insights: [
          '2024年後半が大きな転機',
          'クリエイティブな仕事との相性が良い'
        ]
      }
    }
  ],
  upcomingAppointments: [
    {
      id: 'A001',
      date: '2024-03-15',
      time: '14:00',
      service: 'タロット占い',
      duration: 60,
      cost: 15000,
      status: 'scheduled',
      type: 'offline',
      notes: 'キャリアの進展について'
    }
  ],
  customerJourney: {
    stage: 'loyal',
    lastInteraction: '2024-02-14',
    nextAction: 'フォローアップセッションの提案'
  },
  insights: [
    {
      title: '高い継続率',
      description: '定期的な来店があり、サービスへの満足度が高い',
      type: 'positive'
    },
    {
      title: 'キャリアフォーカス',
      description: '仕事関連の相談が多く、特にリーダーシップに関する課題に関心',
      type: 'neutral'
    }
  ]
};

export default function CustomerProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'consultations' | 'appointments' | 'insights'>('overview');
  const [showAddConsultation, setShowAddConsultation] = useState(false);
  const [showAddAppointment, setShowAddAppointment] = useState(false);

  useEffect(() => {
    // TODO: API連携
    setProfile(mockCustomerProfile);
  }, []);

  const renderOverviewTab = () => {
    if (!profile) return null;

    return (
      <div className="space-y-6">
        {/* 基本情報 */}
        <div className="bg-purple-800/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">基本情報</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-purple-300">生年月日</p>
              <p>{profile.birthDate} ({profile.zodiacSign})</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">血液型</p>
              <p>{profile.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">電話番号</p>
              <p>{profile.phone}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">メールアドレス</p>
              <p>{profile.email}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">住所</p>
              <p>{profile.address}</p>
            </div>
          </div>
        </div>

        {/* 利用状況 */}
        <div className="bg-purple-800/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">利用状況</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-purple-300">初回来店</p>
              <p>{profile.firstVisit}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">最終来店</p>
              <p>{profile.lastVisit}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">来店回数</p>
              <p>{profile.totalVisits}回</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">お気に入りサービス</p>
              <p>{profile.favoriteService}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">累計利用額</p>
              <p>¥{profile.totalSpent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">平均利用額</p>
              <p>¥{profile.averageSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* 嗜好と特徴 */}
        <div className="bg-purple-800/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">嗜好と特徴</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-purple-300">コミュニケーションスタイル</p>
              <p>{profile.preferences.communicationStyle}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">関心事項</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.preferences.interests.map(interest => (
                  <span key={interest} className="px-2 py-1 bg-purple-700/30 rounded-full text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-purple-300">主な相談内容</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {profile.preferences.concerns.map(concern => (
                  <span key={concern} className="px-2 py-1 bg-purple-700/30 rounded-full text-sm">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* メモ */}
        <div className="bg-purple-800/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">メモ</h3>
          <p>{profile.notes}</p>
        </div>
      </div>
    );
  };

  const renderConsultationsTab = () => {
    if (!profile) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">相談履歴</h3>
          <button
            onClick={() => setShowAddConsultation(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus size={20} />
            <span>新規相談記録</span>
          </button>
        </div>

        <div className="space-y-4">
          {profile.consultationHistory.map(consultation => (
            <div key={consultation.id} className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold">{consultation.service}</h4>
                  <p className="text-sm text-purple-300">{consultation.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">¥{consultation.cost.toLocaleString()}</p>
                  <p className="text-sm text-purple-300">{consultation.duration}分</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-purple-300 mb-1">主な相談内容</p>
                  <div className="flex flex-wrap gap-2">
                    {consultation.mainTopics.map(topic => (
                      <span key={topic} className="px-2 py-1 bg-purple-700/30 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">インサイト</p>
                  <p>{consultation.insights}</p>
                </div>

                <div>
                  <p className="text-sm text-purple-300 mb-1">アドバイス</p>
                  <p>{consultation.clientRecommendations}</p>
                </div>

                {consultation.cards && (
                  <div>
                    <p className="text-sm text-purple-300 mb-1">カードリーディング</p>
                    <div className="grid grid-cols-2 gap-4">
                      {consultation.cards.map(card => (
                        <div key={card.position} className="bg-purple-900/30 p-4 rounded-lg">
                          <p className="font-semibold">{card.position}: {card.card}</p>
                          <p className="text-sm mt-1">{card.interpretation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {consultation.customerFeedback && (
                  <div>
                    <p className="text-sm text-purple-300 mb-1">お客様フィードバック</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < consultation.customerFeedback.rating ? 'text-yellow-400' : 'text-purple-700'}
                            fill={i < consultation.customerFeedback.rating ? 'currentColor' : 'none'}
                          />
                        ))}
                      </div>
                      <p className="text-sm">{consultation.customerFeedback.comment}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppointmentsTab = () => {
    if (!profile) return null;

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">予約状況</h3>
          <button
            onClick={() => setShowAddAppointment(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            <Plus size={20} />
            <span>新規予約</span>
          </button>
        </div>

        <div className="space-y-4">
          {profile.upcomingAppointments.map(appointment => (
            <div key={appointment.id} className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{appointment.service}</h4>
                  <p className="text-sm text-purple-300">
                    {appointment.date} {appointment.time}
                  </p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.type === 'online' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'
                    }`}>
                      {appointment.type === 'online' ? 'オンライン' : '対面'}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      appointment.status === 'scheduled' ? 'bg-purple-500/20 text-purple-300' :
                      appointment.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {appointment.status === 'scheduled' ? '予約済' :
                       appointment.status === 'completed' ? '完了' : 'キャンセル'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">¥{appointment.cost.toLocaleString()}</p>
                  <p className="text-sm text-purple-300">{appointment.duration}分</p>
                </div>
              </div>
              {appointment.notes && (
                <div className="mt-4">
                  <p className="text-sm text-purple-300">メモ</p>
                  <p className="mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderInsightsTab = () => {
    if (!profile) return null;

    return (
      <div className="space-y-6">
        {/* カスタマージャーニー */}
        <div className="bg-purple-800/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">カスタマージャーニー</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-purple-300">現在のステージ</p>
              <p className="font-semibold mt-1">
                {profile.customerJourney.stage === 'new' ? '新規顧客' :
                 profile.customerJourney.stage === 'regular' ? '定期顧客' :
                 profile.customerJourney.stage === 'loyal' ? 'ロイヤル顧客' : '休眠顧客'}
              </p>
            </div>
            <div>
              <p className="text-sm text-purple-300">最終接点</p>
              <p className="mt-1">{profile.customerJourney.lastInteraction}</p>
            </div>
            <div>
              <p className="text-sm text-purple-300">次のアクション</p>
              <p className="mt-1">{profile.customerJourney.nextAction}</p>
            </div>
          </div>
        </div>

        {/* インサイト */}
        <div className="space-y-4">
          {profile.insights.map((insight, index) => (
            <div key={index} className="bg-purple-800/20 rounded-lg p-6">
              <div className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${
                  insight.type === 'positive' ? 'bg-green-500/20' :
                  insight.type === 'negative' ? 'bg-red-500/20' :
                  'bg-yellow-500/20'
                }`}>
                  {insight.type === 'positive' ? <TrendingUp className="text-green-400" /> :
                   insight.type === 'negative' ? <AlertCircle className="text-red-400" /> :
                   <Star className="text-yellow-400" />}
                </div>
                <div>
                  <h4 className="font-semibold">{insight.title}</h4>
                  <p className="text-sm text-purple-300 mt-1">{insight.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-200"></div>
        </div>
      </div>
    );
  }

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
          {/* ヘッダー */}
          <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-purple-700/50 rounded-full flex items-center justify-center">
                <User size={40} className="text-purple-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-purple-300" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone size={16} className="text-purple-300" />
                    <span>{profile.phone}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-purple-700/30 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* タブナビゲーション */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'overview' ? 'bg-purple-600' : 'bg-purple-800/30 hover:bg-purple-700/30'
              }`}
            >
              概要
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'consultations' ? 'bg-purple-600' : 'bg-purple-800/30 hover:bg-purple-700/30'
              }`}
            >
              相談履歴
            </button>
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'appointments' ? 'bg-purple-600' : 'bg-purple-800/30 hover:bg-purple-700/30'
              }`}
            >
              予約状況
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'insights' ? 'bg-purple-600' : 'bg-purple-800/30 hover:bg-purple-700/30'
              }`}
            >
              インサイト
            </button>
          </div>

          {/* タブコンテンツ */}
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'consultations' && renderConsultationsTab()}
          {activeTab === 'appointments' && renderAppointmentsTab()}
          {activeTab === 'insights' && renderInsightsTab()}
        </div>
      </main>
    </div>
  );
} 