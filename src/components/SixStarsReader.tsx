/* SixStarsReader.tsx - 六星占術 本番実装単一ファイル版 */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, FileText, Info, AlertCircle, Star } from 'lucide-react';
import OpenAI from "openai";
import { calculateUnmeisuu, calculateRisshunDate, isBeforeRisshun as checkBeforeRisshun } from "../utils/rokuseiData";
import LoadingSpinner from './LoadingSpinner';
import FortuneChat from './FortuneChat';

/* ◆ 運命数テーブル: 1900年～1902年のみ例示（実際は1900～2100年の全データをここへ埋め込む） */
const unmeisuuTable: Record<string, Record<string, number>> = {
  "1900": {
    "1": 55, "2": 12, "3": 23, "4": 45, "5": 34, "6": 9, "7": 17, "8": 58, "9": 27, "10": 38, "11": 49, "12": 1
  },
  "1901": {
    "1": 56, "2": 13, "3": 24, "4": 46, "5": 35, "6": 10, "7": 18, "8": 59, "9": 28, "10": 39, "11": 50, "12": 2
  },
  "1902": {
    "1": 57, "2": 14, "3": 25, "4": 47, "5": 36, "6": 11, "7": 19, "8": 60, "9": 29, "10": 40, "11": 51, "12": 3
  }
  /* ...ここに1903～2100年の全データを連続で埋め込む... */
};

/* ◆ 厳密な立春用テーブル: 1900～1902年のみ例示（実際は1900～2100年全データを埋め込む） */
const setsubunTable: Record<string, string> = {
  "1900": "1900-02-04",
  "1901": "1901-02-04",
  "1902": "1902-02-04"
  /* ...ここに1903～2100年までを埋め込む... */
};

/* 干支配列（子=0,丑=1,...亥=11） */
const JUUNISHI = ["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"];

/* 12年周期の運気リスト */
const LUCK_STAGES = [
  "種子","緑生","立花","健弱","達成","乱気",
  "再会","財成","安定","陰影","停止","減退"
];

/* ---------------------------------------------------------------- */
/* ▼ 立春日を求める: setsubunTable から該当年の日時を取得 */
function getRisshunDate(year: number): Date {
  const key = String(year);
  const val = setsubunTable[key];
  if (!val) return new Date(year, 1, 4);
  return new Date(val);
}
/* 指定日がその年の立春より前かどうか判定 */
function isBeforeRisshun(year: number, month: number, day: number): boolean {
  const target = new Date(year, month - 1, day);
  const risshun = getRisshunDate(year);
  return target.getTime() < risshun.getTime();
}
/* ---------------------------------------------------------------- */

/* ---------------------------------------------------------------- */
/* ▼ 運命数テーブルから取得 */
function getUnmeisuu(year: number, month: number): number {
  const ykey = String(year);
  const mkey = String(month);
  if (!unmeisuuTable[ykey] || unmeisuuTable[ykey][mkey] == null) {
    throw new Error(`unmeisuuTableに[${year}年${month}月]のデータがありません。`);
  }
  return unmeisuuTable[ykey][mkey];
}
/* 星数 = (運命数 - 1) + 日, 61以上なら-60 */
function calcHoshisu(unmeisuu: number, day: number): number {
  let val = (unmeisuu - 1) + day;
  if (val >= 61) val -= 60;
  return val;
}
/* 星数→星人 */
function getHoshiJin(h: number): string {
  if (1 <= h && h <= 10)  return "土星人";
  if (11 <= h && h <= 20) return "金星人";
  if (21 <= h && h <= 30) return "火星人";
  if (31 <= h && h <= 40) return "天王星人";
  if (41 <= h && h <= 50) return "木星人";
  if (51 <= h && h <= 60) return "水星人";
  return "判定不能";
}
/* 干支(厳密立春) */
function getExactEto(year: number, month: number, day: number): string {
  let etoYear = year;
  if (checkBeforeRisshun(year, month, day)) etoYear = year - 1;
  const diff = etoYear - 1900;
  const idx = ((diff % 12) + 12) % 12;
  return JUUNISHI[idx];
}
/* 干支→＋/− */
function getInyoByEto(e: string): "+" | "-" {
  const plus = ["子","寅","辰","午","申","戌"];
  return plus.includes(e) ? "+" : "-";
}
/* 六星占術プロファイル: 生年月日→(星人,干支±,運命数,星数,...) */
function getRokuseiProfile(bYear: number, bMonth: number, bDay: number) {
  const unmeisuu = calculateUnmeisuu(bYear, bMonth);
  const hoshisu = calcHoshisu(unmeisuu, bDay);
  const hoshijin = getHoshiJin(hoshisu);
  const eto = getExactEto(bYear, bMonth, bDay);
  const inyou = getInyoByEto(eto);
  return {
    unmeisuu,
    hoshisu,
    eto,
    inyou,
    hoshijin,
    label: `${hoshijin}（${inyou}）`
  };
}
/* 立春基準年 */
function getBirthBaseYear(y: number, m: number, d: number): number {
  return checkBeforeRisshun(y, m, d) ? y - 1 : y;
}
/* 年運ステージ */
function getNenunStage(bYear: number, bMonth: number, bDay: number, tYear: number) {
  const baseYear = getBirthBaseYear(bYear, bMonth, bDay);
  const diff = tYear - baseYear;
  const idx = ((diff % 12) + 12) % 12;
  const stageName = LUCK_STAGES[idx];
  const daisakkai = (idx === 9 || idx === 10 || idx === 11);
  return { stageIndex: idx, stageName, isDaisakkai: daisakkai };
}
/* 月運ステージ(簡易モデル) */
function getGekunStage(bYear: number, bMonth: number, bDay: number, tYear: number, tMonth: number) {
  const yearStage = getNenunStage(bYear, bMonth, bDay, tYear);
  const baseIdx = yearStage.stageIndex;
  const shift = tMonth - 1;
  const idx = ((baseIdx + shift) % 12 + 12) % 12;
  const stageName = LUCK_STAGES[idx];
  const daisakkai = (idx === 9 || idx === 10 || idx === 11);
  return { stageIndex: idx, stageName, isDaisakkai: daisakkai };
}
/* ---------------------------------------------------------------- */

/* ◆ アドバイス用の型 */
interface RokuseiAdvice {
  description: string;
  yearFortune: string;
  monthFortune: string;
  relationships: string;
  career: string;
}
interface RokuseiResult {
  starLabel: string;
  unmeisuu: number;
  hoshisu: number;
  eto: string;
  inyou: string;
  yearStageName: string;
  isYearDaisakkai: boolean;
  monthStageName: string;
  isMonthDaisakkai: boolean;
  advice: RokuseiAdvice;
}

/* ◆ メインコンポーネント */
export default function SixStarsReader() {
  const navigate = useNavigate();
  const [birthYear, setBirthYear] = useState<string>("");
  const [birthMonth, setBirthMonth] = useState<string>("");
  const [birthDay, setBirthDay] = useState<string>("");
  const [result, setResult] = useState<RokuseiResult | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  async function generateRokuseiAdvice(params: {
    starLabel: string;
    eto: string;
    inyou: string;
    yearStageName: string;
    monthStageName: string;
  }): Promise<RokuseiAdvice> {
    const systemPrompt = `あなたは六星占術の専門家です。以下の情報を踏まえ、正確な解説をJSON形式で返してください。
{
  "description": "...",
  "yearFortune": "...",
  "monthFortune": "...",
  "relationships": "...",
  "career": "..."
}`;
    const userPrompt = `星人: ${params.starLabel}
干支: ${params.eto}（${params.inyou}）
今年の年運: ${params.yearStageName}
今月の月運: ${params.monthStageName}
これらに基づき、六星占術の視点で分析とアドバイスをお願いします。`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("LLM応答が空です");

    let obj: RokuseiAdvice;
    try {
      obj = JSON.parse(content);
    } catch {
      throw new Error("JSONパースエラー");
    }
    if (
      obj.description === undefined ||
      obj.yearFortune === undefined ||
      obj.monthFortune === undefined ||
      obj.relationships === undefined ||
      obj.career === undefined
    ) {
      throw new Error("必要項目が不足しています");
    }
    return obj;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const y = parseInt(birthYear, 10);
      const m = parseInt(birthMonth, 10);
      const d = parseInt(birthDay, 10);
      if (isNaN(y) || isNaN(m) || isNaN(d)) {
        alert("正しい生年月日を入力してください。");
        return;
      }
      if (y < 1900 || y > 2100) {
        alert("1900～2100年の範囲で入力してください。");
        return;
      }
      if (m < 1 || m > 12) {
        alert("月は1～12です。");
        return;
      }
      if (d < 1 || d > 31) {
        alert("日にちは1～31です。");
        return;
      }
      const profile = getRokuseiProfile(y, m, d);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const nenun = getNenunStage(y, m, d, currentYear);
      const gekun = getGekunStage(y, m, d, currentYear, currentMonth);

      const advice = await generateRokuseiAdvice({
        starLabel: profile.label,
        eto: profile.eto,
        inyou: profile.inyou,
        yearStageName: nenun.stageName,
        monthStageName: gekun.stageName
      });

      const resObj: RokuseiResult = {
        starLabel: profile.label,
        unmeisuu: profile.unmeisuu,
        hoshisu: profile.hoshisu,
        eto: profile.eto,
        inyou: profile.inyou,
        yearStageName: nenun.stageName,
        isYearDaisakkai: nenun.isDaisakkai,
        monthStageName: gekun.stageName,
        isMonthDaisakkai: gekun.isDaisakkai,
        advice
      };
      setResult(resObj);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/fortune")}
            className="flex items-center text-purple-300 hover:text-purple-200 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span>戻る</span>
          </button>
          <h1 className="text-2xl font-bold text-purple-200">六星占術</h1>
          <div className="w-20" /> {/* スペーサー */}
        </div>

        {!result ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6 shadow-lg"
          >
            {/* 説明セクション */}
            <div className="bg-purple-800/20 rounded-lg p-6 mb-8">
              <div className="flex items-start space-x-4">
                <Info className="w-6 h-6 text-purple-300 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lg mb-2 text-purple-100">
                    六星占術は、生年月日から導き出される星人と干支を基に、
                    運命の流れを読み解く占術です。
                  </p>
                  <p className="text-purple-300">
                    あなたの星人と運気の流れを知ることで、
                    人生の転機や適切な行動のタイミングを把握できます。
                  </p>
                </div>
              </div>
            </div>

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-purple-200 mb-2">年</label>
                  <select
                    value={birthYear}
                    onChange={(e) => setBirthYear(e.target.value)}
                    className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                    required
                    disabled={isLoading}
                  >
                    <option value="">年を選択</option>
                    {Array.from({ length: 201 }, (_, i) => 1900 + i).map((year) => (
                      <option key={year} value={String(year)}>{year}年</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">月</label>
                  <select
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(e.target.value)}
                    className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                    required
                    disabled={isLoading}
                  >
                    <option value="">月を選択</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                      <option key={month} value={month}>{month}月</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-purple-200 mb-2">日</label>
                  <select
                    value={birthDay}
                    onChange={(e) => setBirthDay(e.target.value)}
                    className="w-full px-4 py-2 bg-purple-800/50 border border-purple-700/50 rounded-lg text-purple-100"
                    required
                    disabled={isLoading}
                  >
                    <option value="">日を選択</option>
                    {Array.from(
                      { length: getDaysInMonth(Number(birthYear), Number(birthMonth)) },
                      (_, i) => i + 1
                    ).map((day) => (
                      <option key={day} value={day}>{day}日</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    px-8 py-3 rounded-lg font-medium text-white
                    ${isLoading
                      ? 'bg-purple-700/50 cursor-not-allowed'
                      : 'bg-purple-600 hover:bg-purple-500 transition-colors'
                    }
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoadingSpinner size={24} message="六星占術で運命を読み解いています..." />
                      <span className="ml-2">鑑定中...</span>
                    </div>
                  ) : (
                    "鑑定する"
                  )}
                </button>
              </div>
            </form>

            {/* 基礎知識セクション */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-12"
            >
              <h2 className="text-xl font-semibold text-purple-200 mb-6">六星占術の基礎知識</h2>
              <div className="grid gap-4">
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="font-medium text-purple-200 mb-2">星人</h3>
                  <p className="text-purple-300">
                    生年月日から算出される運命数と星数により、6つの星人（水星人、木星人、火星人、金星人、土星人、天王星人）のいずれかに分類されます。
                  </p>
                </div>
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="font-medium text-purple-200 mb-2">運命数</h3>
                  <p className="text-purple-300">
                    生まれた年月から導き出される数値で、その人の基本的な運気を表します。
                  </p>
                </div>
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="font-medium text-purple-200 mb-2">干支の陰陽</h3>
                  <p className="text-purple-300">
                    干支には陽（＋）と陰（−）があり、これにより運気の性質が変化します。
                  </p>
                </div>
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="font-medium text-purple-200 mb-2">大殺界</h3>
                  <p className="text-purple-300">
                    12年周期の運気の中で、特に慎重に行動すべき3年間の期間を指します。
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* 結果表示 */}
            <div className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-purple-200 mb-6">鑑定結果</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* 基本プロファイル */}
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-purple-200 mb-4">基本プロファイル</h3>
                  <div className="space-y-2">
                    <p className="text-purple-100">星人: {result.starLabel}</p>
                    <p className="text-purple-100">干支: {result.eto}</p>
                    <p className="text-purple-100">運命数: {result.unmeisuu}</p>
                    <p className="text-purple-100">星数: {result.hoshisu}</p>
                  </div>
                </div>

                {/* 運勢サイクル */}
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-purple-200 mb-4">運勢サイクル</h3>
                  <div className="space-y-2">
                    <p className="text-purple-100">
                      年運: {result.yearStageName}
                      {result.isYearDaisakkai && (
                        <span className="ml-2 text-yellow-300">※大殺界</span>
                      )}
                    </p>
                    <p className="text-purple-100">
                      月運: {result.monthStageName}
                      {result.isMonthDaisakkai && (
                        <span className="ml-2 text-yellow-300">※大殺界</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 詳細な解説 */}
              <div className="space-y-6">
                <div className="bg-purple-800/20 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-purple-200 mb-4">本命星と運命の流れ</h3>
                  <p className="text-purple-100 whitespace-pre-wrap">{result.advice.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-800/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-200 mb-4">年運の展開</h3>
                    <p className="text-purple-100 whitespace-pre-wrap">{result.advice.yearFortune}</p>
                  </div>

                  <div className="bg-purple-800/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-200 mb-4">月運の流れ</h3>
                    <p className="text-purple-100 whitespace-pre-wrap">{result.advice.monthFortune}</p>
                  </div>

                  <div className="bg-purple-800/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-200 mb-4">対人関係の運勢</h3>
                    <p className="text-purple-100 whitespace-pre-wrap">{result.advice.relationships}</p>
                  </div>

                  <div className="bg-purple-800/20 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-purple-200 mb-4">仕事とキャリアの運勢</h3>
                    <p className="text-purple-100 whitespace-pre-wrap">{result.advice.career}</p>
                  </div>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex justify-center mt-8 space-x-4">
                <button
                  onClick={() => setShowChat(true)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
                >
                  SENRIに質問する
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
                >
                  新しい鑑定へ
                </button>
              </div>
            </div>

            {/* チャットUI */}
            {showChat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-purple-900/30 border border-purple-700/50 rounded-lg p-6"
              >
                <FortuneChat
                  fortuneType="sixstars"
                  context={{
                    type: "sixstars",
                    reading: result.advice.description,
                    additionalInfo: {
                      starLabel: result.starLabel,
                      eto: result.eto,
                      yearStage: result.yearStageName,
                      monthStage: result.monthStageName,
                      isYearDaisakkai: result.isYearDaisakkai,
                      isMonthDaisakkai: result.isMonthDaisakkai
                    }
                  }}
                  initialMessage="六星占術について、気になることを質問してください。"
                  initialSuggestions={[
                    { text: "私の星人の特徴について詳しく教えて", label: "星人" },
                    { text: "今年の運勢についてもっと詳しく", label: "年運" },
                    { text: "今月の運勢の過ごし方", label: "月運" },
                    { text: "大殺界期の乗り越え方", label: "大殺界" }
                  ]}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* 月の日数を取得する関数 */
function getDaysInMonth(year: number, month: number): number {
  if (!year || !month) return 31;
  return new Date(year, month, 0).getDate();
}
