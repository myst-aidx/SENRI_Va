import { getGeminiResponse } from './ai';

interface KyuseiStar {
  name: string;
  element: string;
  direction: string;
  characteristics: string[];
  yearlyFortune: {
    career: string;
    relationships: string;
    health: string;
    wealth: string;
    study: string;
  };
  monthlyFortune: {
    description: string;
    goodDays: number[];
    badDays: number[];
    luckyDirections: string[];
    luckyColors: string[];
  };
  compatibility: {
    good: string[];
    neutral: string[];
    challenging: string[];
    business: string[];
    romance: string[];
  };
  personality: {
    strengths: string[];
    weaknesses: string[];
    careers: string[];
    lifeGoal: string;
  };
  detailedDescription: string;
}

const kyuseiStars: { [key: string]: KyuseiStar } = {
  "1": {
    name: '一白水星',
    element: '水',
    direction: '北',
    characteristics: [
      '知性と創造性に優れています',
      '新しいアイデアを生み出す力があります',
      '柔軟な思考で問題解決ができます',
      '直感力が鋭く、先を読む力があります',
      '変化を好み、革新的な発想ができます'
    ],
    yearlyFortune: {
      career: '新しいプロジェクトや学びの機会が訪れる時期です。特に研究開発や企画立案での活躍が期待できます。',
      relationships: '知的な出会いが期待できます。共通の興味関心を持つ人との出会いが多くなります。',
      health: '精神面での充実が体調にも好影響を与えます。ただし、考えすぎて疲れることもあるので注意が必要です。',
      wealth: '知的活動や創造的な仕事からの収入が期待できます。投資は慎重に検討してから行動に移すことが重要です。',
      study: '新しい分野の学習や資格取得に適した時期です。特に専門的な知識の習得が円滑に進みます。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に水に関連する事柄での吉凶が顕著です。',
      goodDays: [1, 6, 11, 16, 21, 26],
      badDays: [4, 13, 22, 31],
      luckyDirections: ['北', '東', '南東'],
      luckyColors: ['白', '青', '黒']
    },
    compatibility: {
      good: ['六白金星', '八白土星'],
      neutral: ['二黒土星', '四緑木星'],
      challenging: ['五黄土星', '七赤金星'],
      business: ['六白金星', '八白土星', '四緑木星'],
      romance: ['八白土星', '三碧木星']
    },
    personality: {
      strengths: [
        '創造性',
        '知的好奇心',
        '適応力',
        '分析力',
        'コミュニケーション能力'
      ],
      weaknesses: [
        '優柔不断',
        '気分屋',
        '集中力の欠如',
        '感情の起伏'
      ],
      careers: [
        '研究者',
        'クリエイター',
        'コンサルタント',
        'IT技術者',
        '教育者'
      ],
      lifeGoal: '知識と知恵を活用して、社会に革新的な価値を創造すること'
    },
    detailedDescription: '一白水星は、九星気学において最も知的で創造的な星とされています。水の性質を持ち、北の方位を司ります。その特徴は、物事の本質を見抜く洞察力と、新しいものを生み出す創造性にあります。変化を好み、常に新しい可能性を追求する傾向があります。'
  },
  "2": {
    name: '二黒土星',
    element: '土',
    direction: '北',
    characteristics: [
      '包容力と安定感があります',
      '周囲への配慮が自然にできます',
      '着実に物事を進める力があります',
      '信頼される人柄です',
      '責任感が強いです'
    ],
    yearlyFortune: {
      career: '基礎固めと実績作りに適した時期です。長期的な視点での成長が期待できます。',
      relationships: '信頼関係を深める機会が増えます。安定した人間関係が築けます。',
      health: '規則正しい生活が健康維持のカギとなります。ストレス管理も重要です。',
      wealth: '堅実な投資や貯蓄が吉。不動産関連の活動も検討してみましょう。',
      study: '基礎的な学びや資格取得に適しています。着実な学習が実を結びます。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に土に関連する事柄での吉凶が顕著です。',
      goodDays: [2, 11, 20, 29],
      badDays: [5, 14, 23],
      luckyDirections: ['北', '西'],
      luckyColors: ['黒', '青']
    },
    compatibility: {
      good: ['八白土星', '三碧木星'],
      neutral: ['一白水星', '五黄土星'],
      challenging: ['六白金星', '九紫火星'],
      business: ['八白土星', '三碧木星', '五黄土星'],
      romance: ['八白土星', '三碧木星']
    },
    personality: {
      strengths: [
        '包容力',
        '安定感',
        '信頼性',
        '責任感',
        '配慮'
      ],
      weaknesses: [
        '保守的',
        '慎重すぎる',
        '変化を好まない',
        '融通が利かない'
      ],
      careers: [
        '公務員',
        '教育者',
        '医療従事者',
        '金融関係',
        '不動産業'
      ],
      lifeGoal: '安定と調和のある社会づくりに貢献すること'
    },
    detailedDescription: '二黒土星は、九星気学において安定と包容を象徴する星です。土の性質を持ち、北の方位を司ります。その特徴は、周囲への深い配慮と、着実に物事を進める力にあります。'
  },
  "3": {
    name: '三碧木星',
    element: '木',
    direction: '東',
    characteristics: [
      '成長と発展を象徴します',
      '積極的で行動力があります',
      '目標に向かって邁進する力があります',
      '新しいことに挑戦する勇気があります',
      'リーダーシップを発揮できます'
    ],
    yearlyFortune: {
      career: 'キャリアアップのチャンスが訪れます。新しい挑戦が実を結びます。',
      relationships: '新しい出会いが人生の転機となります。人脈が広がる時期です。',
      health: '活動的な生活が健康増進につながります。適度な運動を心がけましょう。',
      wealth: '積極的な投資や新規事業が吉。チャレンジ精神が収入増につながります。',
      study: '新しい分野の学習や資格取得に最適な時期です。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に木に関連する事柄での吉凶が顕著です。',
      goodDays: [3, 12, 21, 30],
      badDays: [6, 15, 24],
      luckyDirections: ['東', '南東'],
      luckyColors: ['緑', '青']
    },
    compatibility: {
      good: ['九紫火星', '二黒土星'],
      neutral: ['四緑木星', '六白金星'],
      challenging: ['七赤金星', '八白土星'],
      business: ['九紫火星', '二黒土星', '五黄土星'],
      romance: ['九紫火星', '二黒土星']
    },
    personality: {
      strengths: [
        '行動力',
        '積極性',
        '成長意欲',
        'リーダーシップ',
        '決断力'
      ],
      weaknesses: [
        '急進的',
        '衝動的',
        '独断的',
        '焦りやすい'
      ],
      careers: [
        '経営者',
        '起業家',
        '営業職',
        'コンサルタント',
        '教育者'
      ],
      lifeGoal: '常に成長し続け、社会の発展に貢献すること'
    },
    detailedDescription: '三碧木星は、九星気学において成長と発展を象徴する星です。木の性質を持ち、東の方位を司ります。その特徴は、強い行動力と成長意欲にあり、新しいことに積極的にチャレンジする力を持っています。'
  },
  "4": {
    name: '四緑木星',
    element: '木',
    direction: '東',
    characteristics: [
      '調和と実行力を持ち合わせています',
      'バランス感覚に優れています',
      '周囲との協調性があります',
      '物事を円滑に進める力があります',
      '公平な判断ができます'
    ],
    yearlyFortune: {
      career: 'チームワークが成功の鍵となります。協調性を活かした仕事で成果が出ます。',
      relationships: '良好な人間関係が運気を高めます。新しい出会いも期待できます。',
      health: 'メンタルとフィジカルのバランスが重要です。規則正しい生活を心がけましょう。',
      wealth: '堅実な投資や貯蓄が吉。共同事業からの収入も期待できます。',
      study: 'チームでの学習や研究が効果的です。知識の共有が重要になります。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に木に関連する事柄での吉凶が顕著です。',
      goodDays: [4, 13, 22, 31],
      badDays: [7, 16, 25],
      luckyDirections: ['東', '南東'],
      luckyColors: ['緑', '青']
    },
    compatibility: {
      good: ['九紫火星', '五黄土星'],
      neutral: ['三碧木星', '七赤金星'],
      challenging: ['一白水星', '二黒土星'],
      business: ['九紫火星', '五黄土星', '三碧木星'],
      romance: ['九紫火星', '五黄土星']
    },
    personality: {
      strengths: [
        '協調性',
        'バランス感覚',
        '実行力',
        '公平さ',
        'コミュニケーション力'
      ],
      weaknesses: [
        '優柔不断',
        '決断力不足',
        '他人への依存',
        '自己主張の弱さ'
      ],
      careers: [
        'マネージャー',
        'コーディネーター',
        '外交官',
        'カウンセラー',
        '教育者'
      ],
      lifeGoal: '調和のとれた社会の実現に貢献すること'
    },
    detailedDescription: '四緑木星は、九星気学において調和と実行を象徴する星です。木の性質を持ち、東の方位を司ります。その特徴は、優れたバランス感覚と協調性にあり、周囲との調和を保ちながら物事を進める力を持っています。'
  },
  "5": {
    name: '五黄土星',
    element: '土',
    direction: '中央',
    characteristics: [
      '中心的な役割を果たします',
      'リーダーシップがあります',
      '統率力と決断力があります',
      '周囲を導く力があります',
      '大局的な視点を持っています'
    ],
    yearlyFortune: {
      career: '責任ある立場での活躍が期待できます。組織のリーダーとしての役割が増えるでしょう。',
      relationships: '人望が集まり、信頼関係が深まります。多くの人との出会いがあります。',
      health: '適度な運動で心身のバランスを保ちましょう。ストレス管理が重要です。',
      wealth: 'リーダーシップを発揮することで、収入増加のチャンスがあります。',
      study: '組織運営やマネジメントに関する学びが効果的です。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に土に関連する事柄での吉凶が顕著です。',
      goodDays: [5, 14, 23],
      badDays: [3, 12, 21, 30],
      luckyDirections: ['中央', '南西'],
      luckyColors: ['黄', '茶']
    },
    compatibility: {
      good: ['一白水星', '七赤金星'],
      neutral: ['二黒土星', '八白土星'],
      challenging: ['三碧木星', '四緑木星'],
      business: ['一白水星', '七赤金星', '九紫火星'],
      romance: ['七赤金星', '一白水星']
    },
    personality: {
      strengths: [
        'リーダーシップ',
        '決断力',
        '統率力',
        '責任感',
        '包容力'
      ],
      weaknesses: [
        '頑固さ',
        '独断的',
        '過度な完璧主義',
        'プレッシャーの蓄積'
      ],
      careers: [
        '経営者',
        '管理職',
        '政治家',
        '教育者',
        'プロジェクトマネージャー'
      ],
      lifeGoal: '組織や社会の中心として、調和と発展を導くこと'
    },
    detailedDescription: '五黄土星は、九星気学において最も強い運気を持つ中心の星です。土の性質を持ち、中央の方位を司ります。その特徴は、強いリーダーシップと統率力にあり、周囲の人々を導く力を持っています。'
  },
  "6": {
    name: '六白金星',
    element: '金',
    direction: '北西',
    characteristics: [
      '正義感が強く、信念を持って行動します',
      '決断力と実行力があります',
      '周囲からの信頼が厚いです',
      '公平な判断ができます',
      '責任感が強く、誠実です'
    ],
    yearlyFortune: {
      career: '公正な判断が評価される時期です。リーダーシップを発揮できます。',
      relationships: '信頼関係に基づく絆が深まります。新しい出会いも期待できます。',
      health: '規律ある生活が健康の基盤となります。定期的な運動を心がけましょう。',
      wealth: '堅実な投資や貯蓄が実を結びます。計画的な資産運用が吉。',
      study: '専門的なスキルの習得や資格取得に適しています。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に金に関連する事柄での吉凶が顕著です。',
      goodDays: [6, 15, 24],
      badDays: [8, 17, 26],
      luckyDirections: ['北西', '西'],
      luckyColors: ['白', '金']
    },
    compatibility: {
      good: ['一白水星', '七赤金星'],
      neutral: ['三碧木星', '九紫火星'],
      challenging: ['二黒土星', '五黄土星'],
      business: ['一白水星', '七赤金星', '八白土星'],
      romance: ['一白水星', '七赤金星']
    },
    personality: {
      strengths: [
        '正義感',
        '決断力',
        '誠実さ',
        '責任感',
        'リーダーシップ'
      ],
      weaknesses: [
        '頑固さ',
        '融通の利かなさ',
        '過度な完璧主義',
        '自己犠牲的な傾向'
      ],
      careers: [
        '法律家',
        '公務員',
        '経営者',
        '教育者',
        'コンサルタント'
      ],
      lifeGoal: '正義と公平さを追求し、社会の秩序を守ること'
    },
    detailedDescription: '六白金星は、九星気学において正義と決断を象徴する星です。金の性質を持ち、北西の方位を司ります。その特徴は、強い正義感と決断力にあり、周囲からの信頼も厚い存在です。'
  },
  "7": {
    name: '七赤金星',
    element: '金',
    direction: '西',
    characteristics: [
      '独創性と表現力に優れています',
      '芸術的なセンスがあります',
      '直感力が鋭いです',
      'カリスマ性があります',
      '人を魅了する力があります'
    ],
    yearlyFortune: {
      career: '創造的な仕事で成果を上げられます。独自のアイデアが評価されます。',
      relationships: '魅力的な出会いが期待できます。人脈が広がる時期です。',
      health: '感性を大切にした生活を心がけましょう。芸術活動で心身をリフレッシュ。',
      wealth: '創造的な活動からの収入が期待できます。芸術関連の投資も吉。',
      study: '芸術や表現に関する学びが効果的です。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に金に関連する事柄での吉凶が顕著です。',
      goodDays: [7, 16, 25],
      badDays: [9, 18, 27],
      luckyDirections: ['西', '南西'],
      luckyColors: ['赤', '金']
    },
    compatibility: {
      good: ['五黄土星', '六白金星'],
      neutral: ['四緑木星', '九紫火星'],
      challenging: ['一白水星', '三碧木星'],
      business: ['五黄土星', '六白金星', '九紫火星'],
      romance: ['五黄土星', '六白金星']
    },
    personality: {
      strengths: [
        '創造性',
        '直感力',
        'カリスマ性',
        '表現力',
        '芸術性'
      ],
      weaknesses: [
        '気分屋',
        '自己中心的',
        '浪費傾向',
        '感情的になりやすい'
      ],
      careers: [
        'アーティスト',
        'デザイナー',
        '俳優',
        'プロデューサー',
        'マーケター'
      ],
      lifeGoal: '芸術と創造性を通じて、世界に美と感動を届けること'
    },
    detailedDescription: '七赤金星は、九星気学において芸術と創造を象徴する星です。金の性質を持ち、西の方位を司ります。その特徴は、豊かな創造性と表現力にあり、人々を魅了するカリスマ性を持っています。'
  },
  "8": {
    name: '八白土星',
    element: '土',
    direction: '南西',
    characteristics: [
      '誠実で堅実な性格です',
      '地道な努力を惜しみません',
      '責任感が強いです',
      '安定を重視します',
      '信頼される人柄です'
    ],
    yearlyFortune: {
      career: '着実な成長が期待できる時期です。長期的なプロジェクトに適しています。',
      relationships: '長期的な信頼関係を築けます。安定した人間関係が築けます。',
      health: '継続的な健康管理が実を結びます。規則正しい生活が大切です。',
      wealth: '堅実な投資や貯蓄が吉。不動産関連の活動も好調です。',
      study: '基礎的な学びや資格取得に適しています。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に土に関連する事柄での吉凶が顕著です。',
      goodDays: [8, 17, 26],
      badDays: [2, 11, 20, 29],
      luckyDirections: ['南西', '北東'],
      luckyColors: ['白', '黄']
    },
    compatibility: {
      good: ['一白水星', '二黒土星'],
      neutral: ['五黄土星', '七赤金星'],
      challenging: ['三碧木星', '六白金星'],
      business: ['一白水星', '二黒土星', '五黄土星'],
      romance: ['一白水星', '二黒土星']
    },
    personality: {
      strengths: [
        '誠実さ',
        '堅実さ',
        '責任感',
        '忍耐力',
        '実行力'
      ],
      weaknesses: [
        '保守的',
        '融通が利かない',
        '慎重すぎる',
        '変化を好まない'
      ],
      careers: [
        '不動産業',
        '金融業',
        '公務員',
        '会計士',
        '建築家'
      ],
      lifeGoal: '堅実な努力を積み重ね、社会に安定をもたらすこと'
    },
    detailedDescription: '八白土星は、九星気学において安定と誠実を象徴する星です。土の性質を持ち、南西の方位を司ります。その特徴は、堅実な性格と地道な努力を惜しまない姿勢にあります。'
  },
  "9": {
    name: '九紫火星',
    element: '火',
    direction: '南',
    characteristics: [
      '情熱的で活動的です',
      'カリスマ性があります',
      'エネルギッシュに行動できます',
      '先見性があります',
      '人々を導く力があります'
    ],
    yearlyFortune: {
      career: '積極的な行動が実を結ぶ時期です。新規プロジェクトの立ち上げに適しています。',
      relationships: '人々を引きつける魅力が高まります。新しい出会いが多い時期です。',
      health: '活動的な生活が運気を高めます。スポーツや運動で活力を維持しましょう。',
      wealth: '積極的な投資や新規事業が吉。リスクを恐れず挑戦することで道が開けます。',
      study: '新しい分野への挑戦や革新的な学びが効果的です。'
    },
    monthlyFortune: {
      description: '月の運気の変化に敏感で、特に火に関連する事柄での吉凶が顕著です。',
      goodDays: [9, 18, 27],
      badDays: [1, 10, 19, 28],
      luckyDirections: ['南', '東'],
      luckyColors: ['紫', '赤']
    },
    compatibility: {
      good: ['三碧木星', '四緑木星'],
      neutral: ['六白金星', '七赤金星'],
      challenging: ['二黒土星', '五黄土星'],
      business: ['三碧木星', '四緑木星', '七赤金星'],
      romance: ['三碧木星', '四緑木星']
    },
    personality: {
      strengths: [
        '情熱',
        'リーダーシップ',
        '行動力',
        '創造性',
        'カリスマ性'
      ],
      weaknesses: [
        '短気',
        '衝動的',
        '独断的',
        '燃え尽き症候群'
      ],
      careers: [
        '起業家',
        '経営者',
        'プロデューサー',
        '政治家',
        'アーティスト'
      ],
      lifeGoal: '情熱と創造性で人々を導き、社会に革新をもたらすこと'
    },
    detailedDescription: '九紫火星は、九星気学において情熱と活力を象徴する星です。火の性質を持ち、南の方位を司ります。その特徴は、強い情熱とカリスマ性にあり、人々を導く力を持っています。'
  }
};

// 九星の計算（本格的な実装）
function calculateStarNumber(birthDate: string): number {
  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 立春を基準とした年の切り替わりを考慮
  const springDay = calculateSpringDay(year);
  
  // 立春前の場合は前年の九星を適用
  const targetYear = (month === 2 && day < springDay) || month < 2 ? year - 1 : year;
  
  // 九星の計算
  const starNumber = ((10 - (targetYear % 9)) % 9) || 9;
  
  return starNumber;
}

// 立春の日を計算（概算）
function calculateSpringDay(year: number): number {
  return Math.floor(year * 0.2422 + 3.87) % 30;
}

// 月運を計算
function calculateMonthlyFortune(birthDate: string, currentDate: Date = new Date()): string {
  const starNumber = calculateStarNumber(birthDate);
  const currentMonth = currentDate.getMonth() + 1;
  
  // 月運の計算ロジックを実装
  // TODO: 実際の九星気学の月運計算ロジックを実装
  
  return `${currentMonth}月の運勢...`;
}

// 日運を計算
function calculateDailyFortune(birthDate: string, targetDate: Date = new Date()): string {
  const starNumber = calculateStarNumber(birthDate);
  
  // 日運の計算ロジックを実装
  // TODO: 実際の九星気学の日運計算ロジックを実装
  
  return '今日の運勢...';
}

export async function calculateKyuseiStar(birthDate: string): Promise<KyuseiStar & { aiAnalysis: string }> {
  const starNumber = calculateStarNumber(birthDate);
  const baseStar = kyuseiStars[starNumber];
  
  // AIによる個別の運勢分析
  const prompt = `
以下の情報に基づいて、詳細な運勢と開運アドバイスを提供してください：

九星: ${baseStar.name}
五行: ${baseStar.element}
方位: ${baseStar.direction}

特に以下の点について詳しく解説してください：
1. 現在の社会情勢における${baseStar.name}の活かし方
2. キャリア開発とスキル向上のための具体的なアドバイス
3. 人間関係の改善と円滑なコミュニケーションのためのヒント
4. 健康管理と精神的な充実のためのアドバイス
5. 金運を高めるための具体的な行動指針

また、${baseStar.name}の人が特に注意すべき点や、運気を上昇させるためのアクションプランも提案してください。
`;

  const aiAnalysis = await getGeminiResponse(prompt);

  return {
    ...baseStar,
    aiAnalysis
  };
}

export type { KyuseiStar };
export { calculateMonthlyFortune, calculateDailyFortune }; 