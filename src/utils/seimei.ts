import { getGeminiResponse } from './ai';

interface NameInput {
  familyName: string;
  givenName: string;
  familyNameKana: string;
  givenNameKana: string;
}

interface Kakusu {
  value: number;
  meaning: string;
  fortune: string;
  personality: string[];
  career: string[];
  relationships: string[];
  advice: string[];
}

export interface SeimeiResult {
  tenkaku: Kakusu;    // 天格
  jinkaku: Kakusu;    // 人格
  chikaku: Kakusu;    // 地格
  gaikaku: Kakusu;    // 外格
  soukaku: Kakusu;    // 総格
  nameEnergy: {       // 各文字のエネルギー
    family: {
      kanji: string;
      strokes: number;
      energy: string;
    }[];
    given: {
      kanji: string;
      strokes: number;
      energy: string;
    }[];
  };
  compatibility: {    // 相性
    business: string;
    romance: string;
    friendship: string;
  };
  lifeDestiny: string;  // 運命の方向性
  aiAnalysis: string;   // AI分析
}

// 漢字の画数データベース
const kanjiDatabase: { [key: string]: number } = {
  // 基本的な漢字（1-5画）
  '一': 1, '二': 2, '三': 3, '丁': 2, '七': 2, '九': 2, '了': 2, '人': 2, '十': 2, '八': 2,
  '刀': 2, '力': 2, '又': 2, '乃': 2, '万': 3, '丈': 3, '上': 3, '下': 3, '与': 3, '久': 3,
  '亡': 3, '凡': 3, '刃': 3, '千': 3, '土': 3, '士': 3, '夕': 3, '大': 3, '女': 3, '子': 3,
  '寸': 3, '小': 3, '山': 3, '川': 3, '工': 3, '己': 3, '干': 3, '弓': 3, '才': 3, '之': 3,
  '五': 4, '井': 4, '仁': 4, '今': 4, '介': 4, '内': 4, '円': 4, '天': 4, '太': 4, '少': 4,
  '引': 4, '心': 4, '手': 4, '支': 4, '文': 4, '日': 4, '月': 4, '木': 4, '水': 4, '火': 4,
  '中': 4, '六': 4, '切': 4, '午': 4, '元': 4, '公': 4, '区': 4, '友': 4, '双': 4, '反': 4,
  '収': 4, '比': 4, '毛': 4, '氏': 4, '父': 4, '片': 4, '牛': 4, '犬': 4, '王': 4, '分': 4,
  '化': 4, '升': 4, '厄': 4, '及': 4, '夫': 4, '孔': 4, '巴': 4,
  '以': 5, '加': 5, '可': 5, '古': 5, '右': 5, '司': 5, '史': 5, '叶': 5, '市': 5, '布': 5,
  '平': 5, '正': 5, '玉': 5, '田': 5, '由': 5, '白': 5, '石': 5, '示': 5, '央': 5, '弘': 5,
  '必': 5, '永': 5, '末': 5, '未': 5, '札': 5, '本': 5, '功': 5, '包': 5,
  '半': 5, '北': 5, '占': 5, '去': 5, '叫': 5, '号': 5, '四': 5, '外': 5, '失': 5, '左': 5,

  // 6-8画の漢字
  '安': 6, '会': 6, '印': 6, '英': 6, '衣': 6, '伊': 6, '羽': 6, '江': 6, '光': 6, '吉': 6,
  '好': 6, '向': 6, '后': 6, '守': 6, '寺': 6, '州': 6, '池': 6, '竹': 6, '次': 6, '早': 6,
  '百': 6, '名': 6, '字': 6, '西': 6, '多': 6, '肉': 6, '米': 6, '缶': 6, '年': 6, '曲': 6,
  '有': 6, '朱': 6, '先': 6, '全': 6, '両': 6, '争': 6, '交': 6, '仲': 6, '伎': 6, '糸': 6, // 糸 added
  '位': 7, '依': 7, '価': 7, '佐': 7, '児': 7, '志': 7, '村': 7, '男': 7, '町': 7, '岡': 7,
  '完': 7, '希': 7, '快': 7, '我': 7, '系': 7, '孝': 7, '坂': 7, '材': 7, '更': 7, '杉': 7,
  '初': 7, '松': 7, '沢': 7, '谷': 7, '豆': 7, '辰': 7, '那': 7, '妙': 7, '秀': 7, '走': 7,
  '里': 7, '医': 7, '君': 7, '吹': 7, '坊': 7, '妥': 7, '寿': 7, '巧': 7, '序': 7, '形': 7,
  '青': 8, '林': 8, '京': 8, '信': 8, '岸': 8, '金': 8, '長': 8, '門': 8, '阿': 8, '卓': 8,
  '和': 8, '奈': 8, '岩': 8, '店': 8, '東': 8, '波': 8, '法': 8, '泉': 8, '知': 8,
  '直': 8, '昌': 8, '明': 8, '欣': 8, '武': 8, '典': 8, '芳': 8, '雨': 8, '官': 8, '亜': 8, '季': 8, // 季 added

  // 9-11画の漢字
  '美': 9, '柳': 9, '洋': 9, '相': 9, '春': 9, '昭': 9, '真': 9, '秋': 9, '宮': 9, '城': 9,
  '姫': 9, '威': 9, '宣': 9, '建': 9, '思': 9, '星': 9, '映': 9, '柱': 9, '洞': 9, '畑': 9,
  '紀': 9, '軍': 9, '郎': 9, '宥': 9, '厚': 9, '奏': 9, '契': 9, '姿': 9, '孤': 9, '帝': 9, '咲': 9, '虹': 9, // 咲, 虹 added
  '高': 10, '浩': 10, '晃': 10, '浦': 10, '海': 10, '原': 10, '島': 10, '時': 10, '神': 10,
  '夏': 10, '宰': 10, '寛': 10, '将': 10, '恵': 10, '悦': 10, '敏': 10, '晋': 10,
  '栄': 10, '根': 10, '桜': 10, '梅': 10, '浅': 10, '浪': 10, '祐': 10, '秦': 10,
  '素': 10, '紋': 10, '翁': 10, '能': 10, '莉': 10, '華': 10, '野': 11, '康': 11, '崇': 11,
  '教': 11, '清': 11, '理': 11, '黒': 11, '善': 11, '章': 11, '堂': 11, '場': 11, '塚': 11, '彩': 11, '曽': 11, // 彩, 曽 added

  // 12-14画の漢字
  '雄': 12, '順': 12, '智': 12, '森': 12, '椎': 12, '渓': 12, '登': 12, '絵': 12, '貴': 12,
  '道': 12, '隆': 12, '雅': 12, '朝': 12, '湖': 12, '渚': 12, '琴': 12, '結': 12, '絹': 12,
  '葉': 12, '裕': 12, '詩': 12, '雲': 12, '斎': 12, '喜': 12, '嵐': 12, '幹': 12, '暁': 12,
  '新': 13, '源': 13, '聖': 13, '誠': 13, '豊': 13, '鈴': 13, '関': 13, '嘉': 13, '慶': 13,
  '滋': 13, '碧': 13, '禎': 13, '綾': 13, '菊': 13, '詞': 13, '達': 13, '鉄': 13, '靖': 13, '楓': 13, '福': 13, // 楓, 福 added
  '輝': 14, '賢': 14, '遥': 14, '慧': 14, '暢': 14, '漢': 14,
  '瑞': 14, '碩': 14, '綜': 14, '維': 14, '翠': 14, '菫': 14, '語': 14, '豫': 14, '賀': 14, '鳳': 14, '碼': 14, '齊': 14, // 鳳, 碼, 齊 added

  // 15画以上の漢字
  '徳': 15, '潮': 15, '澄': 15, '燿': 15, '篤': 15, '織': 15, '薫': 15, '諒': 15,
  '錦': 15, '霞': 15, '優': 15, '懐': 15, '璃': 15, '聡': 15, '蓮': 15, '蝶': 15, '澤': 15, '齋': 15, '賴': 15, '澁': 15, '諫': 15, '鍊': 15, '鵜': 15, // 蝶, 澤, 齋, 賴, 澁, 諫, 鍊, 鵜 added
  '瞳': 16, '穣': 16, '縄': 16, '臨': 16, '薔': 16, '襄': 16,
  '醇': 16, '鎌': 16, '瀬': 17, '藤': 18, '鷹': 18, '麗': 19, '鑑': 23, '灘': 20, '龍': 16, '靜': 16, '曉': 12, '濱': 17, '頰': 17, '鷄': 17, '髓': 17, '鎭': 18, '麴': 19, '靈': 20, '響': 20, '驍': 20, '讚': 22, '鑄': 22, '觀': 23, '驗': 23, '體': 23, '顯': 23, '驛': 23, '鬪': 25, // Many 16+ added from existing list and some new ones

  // 旧字体・異体字
  '﨑': 14, '眞': 16, '濱': 17, '髙': 16, '惠': 12, '經': 13, '榮': 14, '曾': 11,
  '增': 14, '齋': 15, '齊': 14, '淺': 11, '澤': 15, '瀨': 17, '邊': 17, '豐': 13, '澁': 15,
  '賴': 15, '黑': 11, '桒': 10, '竝': 8, '福': 13, '靑': 8, '飯': 12,
  '驛': 23, '龍': 16, '龜': 17, '玻': 9, '珉': 9, '琲': 12, '瑯': 13, '碼': 14,
  '禮': 18, '絲': 14, '綫': 13, '茲': 10, '萬': 12, '蘭': 19,
  '虹': 9, '蝶': 15, '衞': 16, '襃': 17, '觀': 23, '諫': 15, '諭': 16, '變': 23, '讃': 22,
  '釋': 16, '鈩': 12, '鉢': 13, '錄': 16, '鍊': 15, '鎭': 18, '鏡': 19, '鐵': 17,
  '鑄': 22, '閒': 12, '陷': 11, '險': 16, '雜': 14, '靈': 20, '靜': 16, '響': 20,
  '頰': 17, '顯': 23, '飮': 12, '驍': 20, '驗': 23, '髓': 17, '體': 23, '髮': 16, '鬪': 25,
  '鳳': 14, '鵜': 15, '鷄': 17, '麴': 19, '麿': 18, '黃': 12, '默': 16, '龢': 17, '國': 8, '嶋': 15, '櫻': 21 // 國, 嶋, 櫻 added
};

// 運勢判断のデータベース
const kakusuDatabase: { [key: number]: Kakusu } = {
  1: {
    value: 1,
    meaning: '独創性と先駆性',
    fortune: '新しいことを始めるのに適した数。独立心が強く、創造的な成功が期待できます。',
    personality: [
      '独創的な発想力',
      'リーダーシップ',
      '先駆者的な精神'
    ],
    career: [
      '起業家',
      'クリエイター',
      '研究者'
    ],
    relationships: [
      '自立心が強い',
      '個性的な魅力',
      '率直なコミュニケーション'
    ],
    advice: [
      '独自の視点を活かす',
      '新しいことへの挑戦を恐れない',
      '協調性も意識する'
    ]
  },
  // ... 他の数字も同様に定義
};

// 画数計算関数
function calculateStrokes(kanji: string): number {
  let total = 0;
  for (const char of kanji) {
    if (kanjiDatabase[char]) {
      total += kanjiDatabase[char];
    } else {
      throw new Error(`漢字「${char}」の画数データが見つかりません。`);
    }
  }
  return total;
}

// 各格の計算
function calculateKakusu(strokes: number): Kakusu {
  // 81で割った余りを使用（伝統的な計算方法）
  const normalizedStrokes = ((strokes - 1) % 81) + 1;
  return kakusuDatabase[normalizedStrokes] || {
    value: normalizedStrokes,
    meaning: '該当なし',
    fortune: '特殊な数値です',
    personality: [],
    career: [],
    relationships: [],
    advice: []
  };
}

// 文字のエネルギー判定
function determineKanjiEnergy(kanji: string, strokes: number): string {
  // 五行思想に基づくエネルギー判定
  const element = strokes % 5;
  const energies = ['木', '火', '土', '金', '水'];
  return `${kanji}（${strokes}画）は${energies[element]}のエネルギーを持ちます`;
}

export async function calculateSeimei(name: NameInput): Promise<SeimeiResult> {
  try {
    // 姓の各文字の画数計算
    const familyStrokes = name.familyName.split('').map(kanji => ({
      kanji,
      strokes: calculateStrokes(kanji),
      energy: determineKanjiEnergy(kanji, calculateStrokes(kanji))
    }));

    // 名の各文字の画数計算
    const givenStrokes = name.givenName.split('').map(kanji => ({
      kanji,
      strokes: calculateStrokes(kanji),
      energy: determineKanjiEnergy(kanji, calculateStrokes(kanji))
    }));

    // 各格の計算
    const tenkakuStrokes = familyStrokes.reduce((sum, char) => sum + char.strokes, 0);
    const chikakuStrokes = givenStrokes.reduce((sum, char) => sum + char.strokes, 0);
    const jinkakuStrokes = familyStrokes[familyStrokes.length - 1].strokes + givenStrokes[0].strokes;
    const soukakuStrokes = tenkakuStrokes + chikakuStrokes;
    const gaikakuStrokes = soukakuStrokes - jinkakuStrokes;

    const result: SeimeiResult = {
      tenkaku: calculateKakusu(tenkakuStrokes),
      jinkaku: calculateKakusu(jinkakuStrokes),
      chikaku: calculateKakusu(chikakuStrokes),
      gaikaku: calculateKakusu(gaikakuStrokes),
      soukaku: calculateKakusu(soukakuStrokes),
      nameEnergy: {
        family: familyStrokes,
        given: givenStrokes
      },
      compatibility: {
        business: '相性判断は各格の組み合わせから導き出されます',
        romance: '相性判断は各格の組み合わせから導き出されます',
        friendship: '相性判断は各格の組み合わせから導き出されます'
      },
      lifeDestiny: '運命の方向性は総格と他の格の関係から導き出されます',
      aiAnalysis: ''
    };

    // AIによる総合分析
    const prompt = `
姓名判断の結果に基づいて、詳細な運勢と開運アドバイスを提供してください：

名前: ${name.familyName}${name.givenName}
天格: ${result.tenkaku.value}
人格: ${result.jinkaku.value}
地格: ${result.chikaku.value}
外格: ${result.gaikaku.value}
総格: ${result.soukaku.value}

特に以下の点について詳しく解説してください：
1. 名前全体のバランスと運勢の特徴
2. キャリアと才能の活かし方
3. 対人関係と相性
4. 人生の転機と開運のポイント
5. 運気を最大限に活かすためのアドバイス

また、五行のバランスと各格の相互作用も考慮して、具体的なアドバイスを提供してください。
`;

    result.aiAnalysis = await getGeminiResponse(prompt);

    return result;
  } catch (error) {
    console.error('Error in seimei calculation:', error);
    throw error;
  }
} 
