// 運命数計算のためのユーティリティ関数

/**
 * 運命数を計算するためのベース値
 * これは60年周期で繰り返される
 */
const BASE_UNMEISUU = {
  "1": [55, 56, 57, 58, 59, 60, 1, 2, 3, 4, 5, 6],  // 1月
  "2": [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23], // 2月
  "3": [23, 24, 25, 26, 27, 28, 29, 30, 21, 22, 23, 24], // 3月
  "4": [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56], // 4月
  "5": [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45], // 5月
  "6": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],  // 6月
  "7": [17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], // 7月
  "8": [58, 59, 60, 1, 2, 3, 4, 5, 6, 7, 8, 9],         // 8月
  "9": [27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], // 9月
  "10": [38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49], // 10月
  "11": [49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60], // 11月
  "12": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]          // 12月
};

/**
 * 運命数を計算する
 * @param year 年
 * @param month 月
 * @returns 運命数
 */
export function calculateUnmeisuu(year: number, month: number): number {
  if (year < 1900 || year > 2100) {
    throw new Error("年は1900年から2100年の間で指定してください");
  }
  if (month < 1 || month > 12) {
    throw new Error("月は1から12の間で指定してください");
  }

  // 1900年からの経過年数を計算し、60年周期でのインデックスを取得
  const baseYear = 1900;
  const cycleIndex = ((year - baseYear) % 60);
  
  // 月のデータを取得
  const monthData = BASE_UNMEISUU[month.toString()];
  if (!monthData) {
    throw new Error("不正な月が指定されました");
  }

  // 60年周期でのインデックスから該当する運命数を返す
  return monthData[cycleIndex % 12];
}

/**
 * 立春日を計算する
 * 注: この実装は簡易的なもので、実際の立春日とは若干のずれがある可能性があります
 * より正確な実装が必要な場合は、天文学的な計算や正確なデータテーブルを使用してください
 */
export function calculateRisshunDate(year: number): Date {
  if (year < 1900 || year > 2100) {
    throw new Error("年は1900年から2100年の間で指定してください");
  }

  // 基本的に2月4日前後
  // より正確な計算が必要な場合は、天文学的な計算を実装する必要があります
  return new Date(year, 1, 4); // 2月4日を返す
}

/**
 * 指定された日付が立春より前かどうかを判定
 */
export function isBeforeRisshun(year: number, month: number, day: number): boolean {
  const targetDate = new Date(year, month - 1, day);
  const risshunDate = calculateRisshunDate(year);
  return targetDate.getTime() < risshunDate.getTime();
} 