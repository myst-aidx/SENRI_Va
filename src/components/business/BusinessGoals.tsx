import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Home,
  Target,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Plus,
  Edit2,
  Trash2,
  ArrowRight,
  BarChart2,
  BookOpen,
  Award,
  Heart,
  X
} from 'lucide-react';

interface Goal {
  id: string;
  category: 'financial' | 'customer' | 'skill' | 'personal';
  title: string;
  description: string;
  targetDate: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  milestones: Milestone[];
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  priority: 'high' | 'medium' | 'low';
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Milestone {
  id: string;
  title: string;
  targetDate: string;
  completed: boolean;
  notes: string;
}

interface GoalTemplate {
  title: string;
  description: string;
  unit?: string;
  suggestedValue?: number;
  suggestedMilestones: string[];
}

// 目標のテンプレート
const goalTemplates: Record<string, GoalTemplate[]> = {
  financial: [
    {
      title: '月間売上目標',
      description: '安定した収入を確保するための月間売上目標を設定します',
      unit: '円',
      suggestedValue: 300000,
      suggestedMilestones: [
        '予約システムの活用開始',
        'リピーター割引の導入',
        '新規顧客紹介プログラムの開始'
      ]
    },
    {
      title: '新規顧客獲得数',
      description: 'ビジネスの成長のための新規顧客獲得目標',
      unit: '人',
      suggestedValue: 10,
      suggestedMilestones: [
        'SNSでの認知度向上',
        'オンライン予約の導入',
        '顧客紹介プログラムの開始'
      ]
    }
  ],
  customer: [
    {
      title: '顧客満足度の向上',
      description: 'サービス品質向上による顧客満足度の改善',
      unit: '%',
      suggestedValue: 90,
      suggestedMilestones: [
        'カウンセリング技術の向上',
        'フォローアップの仕組み作り',
        '顧客フィードバックの収集と分析'
      ]
    }
  ],
  skill: [
    {
      title: '新しい占術の習得',
      description: 'サービスの幅を広げるための新しい占術の学習',
      suggestedMilestones: [
        '基礎理論の学習完了',
        '実践練習の開始',
        '認定資格の取得'
      ]
    }
  ],
  personal: [
    {
      title: 'ワークライフバランスの改善',
      description: '持続可能なビジネス運営のための生活バランスの改善',
      suggestedMilestones: [
        '週間スケジュールの最適化',
        '休暇日の確保',
        'セルフケア習慣の確立'
      ]
    }
  ]
};

// モックデータ
const mockGoals: Goal[] = [
  {
    id: '1',
    category: 'financial',
    title: '月間売上30万円達成',
    description: '安定した収入基盤を確立するための月間売上目標',
    targetDate: '2024-03-31',
    targetValue: 300000,
    currentValue: 150000,
    unit: '円',
    milestones: [
      {
        id: 'm1',
        title: '予約システムの活用開始',
        targetDate: '2024-02-15',
        completed: true,
        notes: '予約の効率化に成功'
      },
      {
        id: 'm2',
        title: 'リピーター割引の導入',
        targetDate: '2024-02-28',
        completed: false,
        notes: '割引率を検討中'
      }
    ],
    status: 'in_progress',
    priority: 'high',
    notes: '順調に進行中。広告施策の検討が必要。',
    createdAt: '2024-01-01',
    updatedAt: '2024-02-01'
  }
];

export default function BusinessGoals() {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showTutorial, setShowTutorial] = useState(true);

  // 目標の進捗率を計算
  const calculateProgress = (goal: Goal) => {
    if (goal.targetValue && goal.currentValue) {
      return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
    }
    const completedMilestones = goal.milestones.filter(m => m.completed).length;
    return (completedMilestones / goal.milestones.length) * 100;
  };

  // 目標のステータスカラーを取得
  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'delayed':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  // 優先度のラベルとカラーを取得
  const getPriorityInfo = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high':
        return { label: '高', color: 'text-red-400' };
      case 'medium':
        return { label: '中', color: 'text-yellow-400' };
      case 'low':
        return { label: '低', color: 'text-green-400' };
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
            <h1 className="text-3xl font-bold">ビジネス目標管理</h1>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus size={20} />
              <span>新しい目標を設定</span>
            </button>
          </div>

          {/* チュートリアル */}
          {showTutorial && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-800/30 rounded-lg p-6 mb-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="mt-1">
                    <BookOpen size={24} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">目標設定のヒント</h3>
                    <ul className="space-y-2 text-purple-200">
                      <li className="flex items-center space-x-2">
                        <Target size={16} />
                        <span>具体的で測定可能な目標を設定しましょう</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>達成までの期限を明確にしましょう</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle2 size={16} />
                        <span>小さなマイルストーンに分けて進捗を管理しましょう</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Award size={16} />
                        <span>目標テンプレートを活用して効率的に設定できます</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <X size={24} />
                </button>
              </div>
            </motion.div>
          )}

          {/* 目標カテゴリー */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: DollarSign, label: '財務目標', category: 'financial', color: 'from-green-500/20 to-emerald-600/20' },
              { icon: Users, label: '顧客目標', category: 'customer', color: 'from-blue-500/20 to-indigo-600/20' },
              { icon: Star, label: 'スキル目標', category: 'skill', color: 'from-yellow-500/20 to-orange-600/20' },
              { icon: Heart, label: '個人目標', category: 'personal', color: 'from-pink-500/20 to-rose-600/20' }
            ].map(({ icon: Icon, label, category, color }) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`p-6 rounded-lg bg-gradient-to-br ${color} hover:bg-opacity-75 transition-all ${
                  selectedCategory === category ? 'ring-2 ring-purple-400' : ''
                }`}
              >
                <Icon size={32} className="mb-2" />
                <h3 className="text-lg font-semibold">{label}</h3>
                <p className="text-sm text-purple-300">
                  {goals.filter(g => g.category === category).length}個の目標
                </p>
              </button>
            ))}
          </div>

          {/* 目標リスト */}
          <div className="space-y-4">
            {goals.map(goal => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-purple-800/30 rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(goal.status)}`}>
                        {goal.status === 'completed' ? '達成' :
                         goal.status === 'in_progress' ? '進行中' :
                         goal.status === 'delayed' ? '遅延' : '未開始'}
                      </span>
                      <span className={`text-sm ${getPriorityInfo(goal.priority).color}`}>
                        優先度: {getPriorityInfo(goal.priority).label}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">{goal.title}</h3>
                    <p className="text-purple-300 mb-4">{goal.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedGoal(goal)}
                      className="p-2 hover:bg-purple-700/30 rounded"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => {/* 削除確認モーダルを表示 */}}
                      className="p-2 hover:bg-purple-700/30 rounded"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* 進捗バー */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-purple-300">進捗状況</span>
                    <span className="text-sm font-semibold">{Math.round(calculateProgress(goal))}%</span>
                  </div>
                  <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${calculateProgress(goal)}%` }}
                    />
                  </div>
                </div>

                {/* マイルストーン */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold mb-2">マイルストーン</h4>
                  <div className="space-y-2">
                    {goal.milestones.map(milestone => (
                      <div
                        key={milestone.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 ${
                            milestone.completed
                              ? 'bg-purple-500 border-purple-500'
                              : 'border-purple-500'
                          }`}
                        />
                        <span className={milestone.completed ? 'line-through' : ''}>
                          {milestone.title}
                        </span>
                        <span className="text-purple-400">
                          ({new Date(milestone.targetDate).toLocaleDateString()})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 目標値と現在値 */}
                {goal.targetValue && goal.currentValue && (
                  <div className="mt-4 flex items-center space-x-4">
                    <div>
                      <span className="text-sm text-purple-300">現在値</span>
                      <p className="text-lg font-semibold">
                        {goal.currentValue.toLocaleString()} {goal.unit}
                      </p>
                    </div>
                    <ArrowRight size={20} className="text-purple-300" />
                    <div>
                      <span className="text-sm text-purple-300">目標値</span>
                      <p className="text-lg font-semibold">
                        {goal.targetValue.toLocaleString()} {goal.unit}
                      </p>
                    </div>
                  </div>
                )}

                {/* 期限 */}
                <div className="mt-4 flex items-center space-x-2 text-sm text-purple-300">
                  <Calendar size={16} />
                  <span>期限: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* 目標テンプレート選択モーダル */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">目標テンプレートを選択</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(goalTemplates).map(([category, templates]) => (
                  <div key={category}>
                    <h3 className="text-lg font-semibold mb-4">
                      {category === 'financial' ? '財務目標' :
                       category === 'customer' ? '顧客目標' :
                       category === 'skill' ? 'スキル目標' : '個人目標'}
                    </h3>
                    <div className="space-y-4">
                      {templates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setShowTemplateModal(false);
                            setShowAddModal(true);
                            // テンプレートを使用して新しい目標を作成
                          }}
                          className="w-full p-4 bg-purple-800/30 rounded-lg hover:bg-purple-800/50 transition-colors text-left"
                        >
                          <h4 className="font-semibold mb-2">{template.title}</h4>
                          <p className="text-sm text-purple-300 mb-2">
                            {template.description}
                          </p>
                          {template.suggestedValue && (
                            <p className="text-sm">
                              推奨目標値: {template.suggestedValue.toLocaleString()} {template.unit}
                            </p>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setShowAddModal(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  テンプレートを使用せずに作成
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* 目標追加/編集モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-purple-900 rounded-lg shadow-xl max-w-4xl w-full"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {selectedGoal ? '目標の編集' : '新しい目標の設定'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSelectedGoal(null);
                  }}
                  className="text-purple-300 hover:text-purple-100"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      カテゴリー
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                      defaultValue={selectedGoal?.category}
                    >
                      <option value="financial">財務目標</option>
                      <option value="customer">顧客目標</option>
                      <option value="skill">スキル目標</option>
                      <option value="personal">個人目標</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      優先度
                    </label>
                    <select
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                      defaultValue={selectedGoal?.priority}
                    >
                      <option value="high">高</option>
                      <option value="medium">中</option>
                      <option value="low">低</option>
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      目標タイトル
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                      placeholder="具体的な目標を入力してください"
                      defaultValue={selectedGoal?.title}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      目標の説明
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg h-32"
                      placeholder="目標の詳細な説明を入力してください"
                      defaultValue={selectedGoal?.description}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      目標値
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        className="flex-1 px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                        placeholder="数値目標を入力"
                        defaultValue={selectedGoal?.targetValue}
                      />
                      <input
                        type="text"
                        className="w-20 px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                        placeholder="単位"
                        defaultValue={selectedGoal?.unit}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      期限
                    </label>
                    <input
                      type="date"
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                      defaultValue={selectedGoal?.targetDate}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      マイルストーン
                    </label>
                    <div className="space-y-2">
                      {selectedGoal?.milestones.map((milestone, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                            defaultValue={milestone.title}
                          />
                          <input
                            type="date"
                            className="w-40 px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg"
                            defaultValue={milestone.targetDate}
                          />
                          <button
                            type="button"
                            className="p-2 hover:bg-purple-700/30 rounded"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        className="flex items-center space-x-2 text-purple-300 hover:text-purple-100"
                      >
                        <Plus size={20} />
                        <span>マイルストーンを追加</span>
                      </button>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      メモ
                    </label>
                    <textarea
                      className="w-full px-3 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg h-32"
                      placeholder="補足情報や参考事項を入力してください"
                      defaultValue={selectedGoal?.notes}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedGoal(null);
                    }}
                    className="px-4 py-2 text-purple-300 hover:text-purple-100"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    {selectedGoal ? '更新' : '作成'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 
