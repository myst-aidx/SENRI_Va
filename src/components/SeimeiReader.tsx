import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, FileText, Info, AlertCircle, Star } from 'lucide-react';
import { calculateSeimei } from '../utils/seimei';
import LoadingSpinner from './LoadingSpinner';

interface NameInput {
  familyName: string;
  givenName: string;
  familyNameKana: string;
  givenNameKana: string;
}

export default function SeimeiReader() {
  const navigate = useNavigate();
  const [name, setName] = useState<NameInput>({
    familyName: '',
    givenName: '',
    familyNameKana: '',
    givenNameKana: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 入力値の検証
      if (!name.familyName || !name.givenName || !name.familyNameKana || !name.givenNameKana) {
        throw new Error('すべての項目を入力してください。');
      }

      // カタカナの検証
      const kanaRegex = /^[\u30A0-\u30FF]+$/;
      if (!kanaRegex.test(name.familyNameKana) || !kanaRegex.test(name.givenNameKana)) {
        throw new Error('フリガナはカタカナで入力してください。');
      }

      // 姓名判断の計算
      const result = await calculateSeimei(name);

      // 結果ページに遷移
      navigate('/fortune/seimei/result', { state: { name, result } });
    } catch (err) {
      setError(err instanceof Error ? err.message : '鑑定中にエラーが発生しました。');
      console.error('Error in seimei calculation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-900 to-purple-900 text-purple-100">
      <nav className="p-4 bg-purple-900/50">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate('/fortune')}
            className="flex items-center space-x-2 text-purple-200 hover:text-purple-100"
          >
            <ChevronLeft size={24} />
            <span>戻る</span>
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-4 mb-8">
              <FileText className="w-12 h-12 text-purple-300" />
              <h1 className="text-3xl font-bold">姓名判断</h1>
            </div>

            <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4 mb-6">
                <Info className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg mb-2">
                    姓名判断は、漢字の持つ画数とエネルギーから、その名前が持つ運勢や可能性を読み解く伝統的な占術です。
                  </p>
                  <p className="text-purple-300">
                    姓名に込められた運命の力を解き明かし、人生の指針となるメッセージを導き出します。
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* 漢字入力部分 */}
                <div className="bg-purple-900/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">漢字で入力してください</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" htmlFor="familyName">姓（例：山田）</label>
                      <input
                        type="text"
                        id="familyName"
                        name="familyName"
                        value={name.familyName}
                        onChange={(e) => setName(prev => ({ ...prev, familyName: e.target.value }))}
                        placeholder="姓"
                        className="w-full px-4 py-3 bg-purple-900/20 border-2 border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" htmlFor="givenName">名（例：太郎）</label>
                      <input
                        type="text"
                        id="givenName"
                        name="givenName"
                        value={name.givenName}
                        onChange={(e) => setName(prev => ({ ...prev, givenName: e.target.value }))}
                        placeholder="名"
                        className="w-full px-4 py-3 bg-purple-900/20 border-2 border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* フリガナ入力部分 */}
                <div className="bg-purple-900/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium mb-4">フリガナ</h3>
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" htmlFor="familyNameKana">姓（例：ヤマダ）</label>
                      <input
                        type="text"
                        id="familyNameKana"
                        name="familyNameKana"
                        value={name.familyNameKana}
                        onChange={(e) => setName(prev => ({ ...prev, familyNameKana: e.target.value }))}
                        placeholder="セイ"
                        className="w-full px-4 py-3 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium mb-2" htmlFor="givenNameKana">名（例：タロウ）</label>
                      <input
                        type="text"
                        id="givenNameKana"
                        name="givenNameKana"
                        value={name.givenNameKana}
                        onChange={(e) => setName(prev => ({ ...prev, givenNameKana: e.target.value }))}
                        placeholder="メイ"
                        className="w-full px-4 py-3 bg-purple-900/20 border border-purple-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400">{error}</p>
                  </div>
                )}

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <LoadingSpinner size={20} message="姓名判断で運命を読み解いています..." />
                        <span className="ml-2">鑑定中...</span>
                      </div>
                    ) : (
                      <>
                        <Star className="w-5 h-5" />
                        <span>鑑定する</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 姓名判断の基礎知識 */}
            <div className="bg-purple-800/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">姓名判断の基礎知識</h2>
              <div className="grid gap-4">
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">天格（てんかく）</h3>
                  <p className="text-purple-300">姓の総画数。先天的な運勢や家系からの影響を表します。</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">人格（じんかく）</h3>
                  <p className="text-purple-300">姓の最後の文字と名の最初の文字の画数の和。対人関係や社会性を表します。</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">地格（ちかく）</h3>
                  <p className="text-purple-300">名の総画数。後天的な運勢や努力で得られる運を表します。</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">外格（がいかく）</h3>
                  <p className="text-purple-300">総画数から人格を引いた数。社会的評価や環境からの影響を表します。</p>
                </div>
                <div className="bg-purple-900/30 rounded-lg p-4">
                  <h3 className="font-medium mb-2">総格（そうかく）</h3>
                  <p className="text-purple-300">姓名の総画数。人生全体の運勢や最終的な到達点を表します。</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 