import { generateResponse } from './openai';

interface BirthInfo {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
}

// 十干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
// 十二支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
// 五行
const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;

// 年の干支を計算
const calculateYearPillar = (year: number) => {
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  };
};

// 月の干支を計算
const calculateMonthPillar = (year: number, month: number) => {
  const yearStemIndex = (year - 4) % 10;
  const monthStemIndex = (yearStemIndex * 2 + month) % 10;
  const monthBranchIndex = (month + 2) % 12;
  return {
    stem: HEAVENLY_STEMS[monthStemIndex],
    branch: EARTHLY_BRANCHES[monthBranchIndex]
  };
};

// 日の干支を計算
const calculateDayPillar = (year: number, month: number, day: number) => {
  // 簡略化した計算方法
  const stemIndex = (year * 5 + Math.floor(year / 4) + day - 7) % 10;
  const branchIndex = (day * 12) % 12;
  return {
    stem: HEAVENLY_STEMS[stemIndex],
    branch: EARTHLY_BRANCHES[branchIndex]
  };
};

// 時の干支を計算
const calculateHourPillar = (dayStemIndex: number, hour: number) => {
  const hourStemIndex = (dayStemIndex * 2 + Math.floor(hour / 2)) % 10;
  const hourBranchIndex = Math.floor(hour / 2) % 12;
  return {
    stem: HEAVENLY_STEMS[hourStemIndex],
    branch: EARTHLY_BRANCHES[hourBranchIndex]
  };
};

// 五行バランスを計算
const calculateElementBalance = (yearPillar: any, monthPillar: any, dayPillar: any, hourPillar: any) => {
  const balance = {
    wood: 0,
    fire: 0,
    earth: 0,
    metal: 0,
    water: 0
  };

  // 干支から五行を計算（簡略化した例）
  const stems = [yearPillar.stem, monthPillar.stem, dayPillar.stem, hourPillar.stem];
  const branches = [yearPillar.branch, monthPillar.branch, dayPillar.branch, hourPillar.branch];

  stems.forEach(stem => {
    const stemIndex = HEAVENLY_STEMS.indexOf(stem);
    const element = FIVE_ELEMENTS[Math.floor(stemIndex / 2)];
    switch (element) {
      case '木': balance.wood++; break;
      case '火': balance.fire++; break;
      case '土': balance.earth++; break;
      case '金': balance.metal++; break;
      case '水': balance.water++; break;
    }
  });

  branches.forEach(branch => {
    const branchIndex = EARTHLY_BRANCHES.indexOf(branch);
    const element = FIVE_ELEMENTS[Math.floor(branchIndex / 3)];
    switch (element) {
      case '木': balance.wood++; break;
      case '火': balance.fire++; break;
      case '土': balance.earth++; break;
      case '金': balance.metal++; break;
      case '水': balance.water++; break;
    }
  });

  return balance;
};

export const generateSanmeiReading = async (birthInfo: BirthInfo) => {
  const yearPillar = calculateYearPillar(birthInfo.year);
  const monthPillar = calculateMonthPillar(birthInfo.year, birthInfo.month);
  const dayPillar = calculateDayPillar(birthInfo.year, birthInfo.month, birthInfo.day);
  const hourPillar = calculateHourPillar(
    HEAVENLY_STEMS.indexOf(dayPillar.stem),
    birthInfo.hour
  );

  const elementBalance = calculateElementBalance(yearPillar, monthPillar, dayPillar, hourPillar);
  const dayMaster = dayPillar.stem;
  const mainElement = FIVE_ELEMENTS[Math.floor(HEAVENLY_STEMS.indexOf(dayMaster) / 2)];

  // AI解釈を生成
  const interpretation = await generateResponse('sanmei', {
    type: 'sanmei',
    reading: '',
    additionalInfo: {
      birthInfo,
      yearPillar,
      monthPillar,
      dayPillar,
      hourPillar,
      dayMaster,
      mainElement,
      elementBalance
    }
  }, '算命学の結果について質問してください');

  return {
    dayMaster,
    yearPillar,
    monthPillar,
    dayPillar,
    hourPillar,
    mainElement,
    elementBalance,
    interpretation
  };
}; 
