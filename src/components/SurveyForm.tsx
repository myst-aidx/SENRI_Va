import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, User, Mail, Star, Book, Computer, Heart } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface SurveyFormProps {
  onSubmit: (data: SurveyData) => Promise<void>;
}

export interface SurveyData {
  name: string;
  email: string;
  experience: string;
  activityType: string[];
  fortuneTypes: string[];
  learningStyle: string[];
  interestedTypes: string[];
  deviceUsage: string;
  onlineResistance: number;
  marketingChannels: string[];
  expectedFeatures: string[];
  importantFactors: string[];
  privacyConsent: boolean;
  termsConsent: boolean;
  basicInfoFeedback?: string;
  experienceFeedback?: string;
  serviceFeedback?: string;
  deviceFeedback?: string;
  marketingFeedback?: string;
  featuresFeedback?: string;
  feedback?: string;
  monthlyClients: string;
  priceRange: string;
  challenges: string[];
  interestLevel?: string[];
}

const EXPERIENCE_OPTIONS = [
  '既に占い師として活動している',
  'これから占い師として活動を始めたい',
  '占いを学んでいる途中',
  '占いに興味がある'
];

const ACTIVITY_STATUS = [
  '個人で占い師として活動している',
  '占いサロン・店舗に所属している',
  'オンラインで占い師として活動している',
  '占いを学習・準備中',
  'まだ具体的な活動はしていない'
];

const INTEREST_LEVEL = [
  '占い師として独立したい',
  '副業として占いを始めたい',
  'オンラインで占いビジネスを展開したい'
];

const FORTUNE_TYPES = [
  'MBTI（性格診断）',
  '六星占術',
  'タロット',
  '手相',
  '数秘術',
  '九星気学',
  '四柱推命',
  '算命学',
  '姓名判断',
  '動物占い',
  '夢占い',
  '風水',
  'ルーン',
  '霊感・チャネリング',
  '水晶占い',
  '素質論'
];

const LEARNING_INTEREST = [
  'オンラインで効率的に学びたい',
  'プロの占い師から実践的な指導を受けたい',
  'ビジネスとしての占いを学びたい'
];

const DEVICE_USAGE = [
  'スマートフォンが中心',
  'PCが中心',
  'スマートフォン・PC両方使用'
];

const MARKETING_CHANNELS = [
  'SNSを活用した集客',
  'オンライン予約・決済システムの導入',
  'リピーター獲得の仕組み作り',
  'ウェブサイトやブログの活用',
  'オンラインコミュニティの構築'
];

const BUSINESS_CHALLENGES = [
  '占いの学習方法がわからない',
  '実践の機会が少ない',
  '鑑定結果の作成に自信が持てない',
  '占いの種類が多すぎて何を学べばいいかわからない',
  'オンラインでの占いの仕方がわからない',
  '顧客の見つけ方がわからない',
  '価格設定の仕方がわからない',
  '占い師としての信頼を得る方法がわからない',
  '他の占い師との差別化が難しい',
  '占いの勉強と仕事の両立が難しい',
  '開業資金の準備が難しい',
  '占いビジネスの始め方がわからない'
];

const EXPECTED_FEATURES = [
  'AIによる占い結果作成支援',
  'オンライン予約・決済システム',
  '顧客管理システム',
  '占い結果の自動作成機能',
  'リピーター管理機能'
];

const IMPORTANT_FACTORS = [
  '売上向上への貢献',
  '業務効率の改善',
  '顧客満足度の向上',
  '集客効果',
  'コストパフォーマンス'
];

const MONTHLY_CLIENTS = [
  '0-5名',
  '6-10名',
  '11-20名',
  '21-30名',
  '31-50名',
  '51名以上'
];

const PRICE_RANGE = [
  '3,000円未満',
  '3,000-5,000円',
  '5,000-10,000円',
  '10,000-20,000円',
  '20,000円以上'
];

export default function SurveyForm({ onSubmit }: SurveyFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<SurveyData>({
    name: '',
    email: '',
    experience: '',
    activityType: [],
    fortuneTypes: [],
    learningStyle: [],
    interestedTypes: [],
    deviceUsage: '',
    onlineResistance: 3,
    marketingChannels: [],
    expectedFeatures: [],
    importantFactors: [],
    privacyConsent: false,
    termsConsent: false,
    basicInfoFeedback: '',
    experienceFeedback: '',
    serviceFeedback: '',
    deviceFeedback: '',
    marketingFeedback: '',
    featuresFeedback: '',
    feedback: '',
    monthlyClients: '',
    priceRange: '',
    challenges: [],
    interestLevel: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '送信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!formData.name && !!formData.email;
      case 2:
        return !!formData.experience && formData.activityType.length > 0;
      case 3:
        return formData.fortuneTypes.length > 0 && formData.challenges.length > 0;
      case 4:
        return !!formData.deviceUsage;
      case 5:
        return true;
      case 6:
        return formData.expectedFeatures.length > 0 && formData.importantFactors.length > 0;
      case 7:
        return formData.privacyConsent && formData.termsConsent;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      setError(null);
    } else {
      setError('必須項目を入力してください');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="アンケートを送信しています..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-100 mb-4">
            SENRI テストユーザー事前アンケート
          </h1>
          <p className="text-purple-200 mb-2">
            オンラインでの占いビジネスを支援するSENRIの開発に向けて、
            あなたの現状とニーズをお聞かせください。
          </p>
        </div>

        <div className="mb-8">
          <div className="h-2 bg-purple-900/50 rounded-full">
            <div
              className="h-full bg-purple-500 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 7) * 100}%` }}
            />
          </div>
          <p className="text-center mt-2 text-purple-300">
            ステップ {currentStep} / 7
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <User className="w-6 h-6 mr-2" />
                  基本情報
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    お名前 *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    メールアドレス *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    その他、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.basicInfoFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, basicInfoFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <Star className="w-6 h-6 mr-2" />
                  占いへの関わり方
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    占いの経験 *
                  </label>
                  <select
                    value={formData.experience}
                    onChange={e => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100"
                    required
                  >
                    <option value="">選択してください</option>
                    {EXPERIENCE_OPTIONS.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    現在の状況 *
                  </label>
                  <div className="space-y-2">
                    {ACTIVITY_STATUS.map(type => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.activityType.includes(type)}
                          onChange={e => {
                            const newTypes = e.target.checked
                              ? [...formData.activityType, type]
                              : formData.activityType.filter(t => t !== type);
                            setFormData(prev => ({ ...prev, activityType: newTypes }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    占いに対する興味 *
                  </label>
                  <div className="space-y-2">
                    {INTEREST_LEVEL.map(interest => (
                      <label key={interest} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.interestLevel?.includes(interest)}
                          onChange={e => {
                            const newInterests = e.target.checked
                              ? [...(formData.interestLevel || []), interest]
                              : (formData.interestLevel || []).filter(i => i !== interest);
                            setFormData(prev => ({ ...prev, interestLevel: newInterests }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    占いとの関わり方について、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.experienceFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, experienceFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="経験年数や具体的な活動内容など、自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <Book className="w-6 h-6 mr-2" />
                  提供サービスと課題
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    提供している占術 *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {FORTUNE_TYPES.map(type => (
                      <label key={type} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.fortuneTypes.includes(type)}
                          onChange={e => {
                            const newTypes = e.target.checked
                              ? [...formData.fortuneTypes, type]
                              : formData.fortuneTypes.filter(t => t !== type);
                            setFormData(prev => ({ ...prev, fortuneTypes: newTypes }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    現在抱えている課題 *
                  </label>
                  <div className="space-y-2">
                    {BUSINESS_CHALLENGES.map(challenge => (
                      <label key={challenge} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.challenges.includes(challenge)}
                          onChange={e => {
                            const newChallenges = e.target.checked
                              ? [...formData.challenges, challenge]
                              : formData.challenges.filter(c => c !== challenge);
                            setFormData(prev => ({ ...prev, challenges: newChallenges }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{challenge}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    占術や課題について、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.serviceFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, serviceFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="得意な占術や具体的な課題など、自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <Computer className="w-6 h-6 mr-2" />
                  デバイス使用状況
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    PC/スマホの使用頻度 *
                  </label>
                  <select
                    value={formData.deviceUsage}
                    onChange={e => setFormData(prev => ({ ...prev, deviceUsage: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">選択してください</option>
                    {DEVICE_USAGE.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    オンラインツールに対する抵抗感 *
                  </label>
                  <div className="flex items-center justify-between px-4">
                    <span className="text-purple-300">抵抗がある</span>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={formData.onlineResistance}
                      onChange={e => setFormData(prev => ({ ...prev, onlineResistance: Number(e.target.value) }))}
                      className="w-1/2 h-2 bg-purple-900/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-purple-300">抵抗がない</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    デバイスやオンラインツールについて、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.deviceFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, deviceFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="普段使用しているツールや気になる点など、自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100 flex items-center">
                  <Heart className="w-6 h-6 mr-2" />
                  集客・マーケティング
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    興味のある集客方法
                  </label>
                  <p className="text-sm text-purple-300 mb-4">
                    将来的に取り組んでみたい項目を選択してください
                  </p>
                  <div className="space-y-2">
                    {MARKETING_CHANNELS.map(channel => (
                      <label key={channel} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.marketingChannels.includes(channel)}
                          onChange={e => {
                            const newChannels = e.target.checked
                              ? [...formData.marketingChannels, channel]
                              : formData.marketingChannels.filter(c => c !== channel);
                            setFormData(prev => ({ ...prev, marketingChannels: newChannels }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    集客・マーケティングについて、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.marketingFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, marketingFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="具体的な集客方法や課題など、自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100">
                  期待する機能と重要視する点
                </h2>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    どんな機能に一番期待しているか *
                  </label>
                  <div className="space-y-2">
                    {EXPECTED_FEATURES.map(feature => (
                      <label key={feature} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.expectedFeatures.includes(feature)}
                          onChange={e => {
                            const newFeatures = e.target.checked
                              ? [...formData.expectedFeatures, feature]
                              : formData.expectedFeatures.filter(f => f !== feature);
                            setFormData(prev => ({ ...prev, expectedFeatures: newFeatures }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    本サービスが有料になった時に重要視すること *
                  </label>
                  <div className="space-y-2">
                    {IMPORTANT_FACTORS.map(factor => (
                      <label key={factor} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.importantFactors.includes(factor)}
                          onChange={e => {
                            const newFactors = e.target.checked
                              ? [...formData.importantFactors, factor]
                              : formData.importantFactors.filter(f => f !== factor);
                            setFormData(prev => ({ ...prev, importantFactors: newFactors }));
                          }}
                          className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20"
                        />
                        <span className="text-purple-200">{factor}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    機能や重要視する点について、補足事項がございましたらご記入ください
                  </label>
                  <textarea
                    value={formData.featuresFeedback}
                    onChange={e => setFormData(prev => ({ ...prev, featuresFeedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-24"
                    placeholder="具体的に欲しい機能や重視したい点など、自由にご記入ください"
                  />
                </div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-purple-100">
                  同意事項とフィードバック
                </h2>
                <div className="space-y-4">
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.privacyConsent}
                      onChange={e => setFormData(prev => ({ ...prev, privacyConsent: e.target.checked }))}
                      className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20 mt-1"
                    />
                    <span className="text-purple-200">
                      個人情報取り扱いに関する同意 *
                    </span>
                  </label>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.termsConsent}
                      onChange={e => setFormData(prev => ({ ...prev, termsConsent: e.target.checked }))}
                      className="form-checkbox text-purple-500 rounded border-purple-700/50 bg-purple-900/20 mt-1"
                    />
                    <span className="text-purple-200">
                      利用規約・守秘義務に関する同意 *
                    </span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    ご自由にご意見・ご要望をお聞かせください
                  </label>
                  <textarea
                    value={formData.feedback}
                    onChange={e => setFormData(prev => ({ ...prev, feedback: e.target.value }))}
                    className="w-full px-4 py-2 bg-purple-900/20 border border-purple-700/50 rounded-lg text-purple-100 focus:outline-none focus:ring-2 focus:ring-purple-500 h-32"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-400 bg-red-900/20 border border-red-500/50 rounded-lg p-3">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 bg-purple-800/50 text-purple-200 rounded-lg hover:bg-purple-700/50 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  戻る
                </button>
              )}
              {currentStep < 7 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors ml-auto"
                >
                  次へ
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors ml-auto"
                >
                  送信する
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
} 