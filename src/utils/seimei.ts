import { getGeminiResponse } from './ai/gemini';
import { FortuneError, ErrorCode } from '../types';

export interface NameInput {
  familyName: string;
  givenName: string;
  birthDate?: string;
}

export interface SeimeiResult {
  analysis: {
    basic: {
      fiveGrids: {
        heaven: {
          value: number;
          meaning: string;
          element: string;
        };
        person: {
          value: number;
          meaning: string;
          element: string;
        };
        earth: {
          value: number;
          meaning: string;
          element: string;
        };
        outer: {
          value: number;
          meaning: string;
          element: string;
        };
        total: {
          value: number;
          meaning: string;
          element: string;
        };
      };
      soundVibration: number[];
    };
    annualForecast: {
      [key: string]: string;
    };
    overall: string;
    personality: string;
    career: string;
    relationships: string;
    luckPoints: string[];
  };
  compatibility: {
    career: string[];
  };
  luckyItems: {
    color: string;
    number: number;
    direction: string;
  };
  advice: string[];
  warnings: string[];
  nameEnergy: {
    family: Array<{
      kanji: string;
      strokes: number;
      energy: string;
    }>;
    given: Array<{
      kanji: string;
      strokes: number;
      energy: string;
    }>;
  };
  tenkaku: {
    value: number;
    meaning: string;
  };
  jinkaku: {
    value: number;
    meaning: string;
  };
  chikaku: {
    value: number;
    meaning: string;
  };
  gaikaku: {
    value: number;
    meaning: string;
  };
  soukaku: {
    value: number;
    meaning: string;
  };
}

// システムプロンプトの定義
const SEIMEI_SYSTEM_PROMPT = `
あなたは姓名判断の専門家です。入力された名前に対して分析を行い、必ず以下の形式のJSONで結果を返してください：

{
  "analysis": {
    "basic": {
      "fiveGrids": {
        "heaven": {
          "value": 10,
          "meaning": "天格の意味の説明",
          "element": "火"
        },
        "person": {
          "value": 17,
          "meaning": "人格の意味の説明",
          "element": "土"
        },
        "earth": {
          "value": 12,
          "meaning": "地格の意味の説明",
          "element": "土"
        }
      },
      "soundVibration": [3, 7, 2]
    },
    "annualForecast": {
      "2024": "2024年の運勢予測"
    }
  },
  "compatibility": {
    "career": ["適職1", "適職2", "適職3"]
  },
  "luckyItems": {
    "color": "ラッキーカラー",
    "number": 1,
    "direction": "ラッキーな方角"
  }
}

分析のポイント：
1. 五格（天格、人格、地格、外格、総格）の数値と意味
2. 陰陽バランス
3. 各格の相互作用
4. 部首分析と五行配分
5. 運勢予測と開運時期
6. 具体的なアドバイス

必ず上記のJSON形式で出力してください。テキスト形式や説明文は含めないでください。
`;

function generateSeimeiPrompt(name: NameInput): string {
  return `${SEIMEI_SYSTEM_PROMPT}

分析対象の情報：
姓：${name.familyName}
名：${name.givenName}
${name.birthDate ? `生年月日：${name.birthDate}` : ''}

上記の名前について分析を行い、指定されたJSON形式で結果を返してください。
テキスト形式や説明文は含めず、必ずJSONオブジェクトのみを返してください。
`;
}

export async function calculateSeimei(name: NameInput): Promise<SeimeiResult> {
  try {
    const prompt = generateSeimeiPrompt(name);
    const response = await getGeminiResponse(
      SEIMEI_SYSTEM_PROMPT,
      prompt,
      [] // 会話履歴は空配列を渡す
    );

    try {
      let sanitizedResponse = response.content
        .replace(/\n/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/[""'']/g, '"')
        .trim();

      // テキスト形式の応答をJSONに変換
      if (!sanitizedResponse.startsWith('{')) {
        const sections = sanitizedResponse.split(/\*\*([^*]+)\*\*/g)
          .filter(s => s.trim())
          .reduce((acc: any, curr, i, arr) => {
            if (i % 2 === 0) {
              const content = curr.trim();
              const section = arr[i - 1]?.trim();
              if (section) {
                acc[section] = content;
              }
            }
            return acc;
          }, {});

        // 五格の情報を抽出
        const fiveGridsMatch = sections['五格']?.match(/天格：(\d+).*人格：(\d+).*地格：(\d+).*外格：(\d+).*総格：(\d+)/);
        const [, heaven, person, earth, outer, total] = fiveGridsMatch || [null, 0, 0, 0, 0, 0];

        // 職業適性を抽出
        const careerMatch = sections['職業適性']?.match(/(?:以下のような職業が適性：)?([\s\S]*?)(?=\n\n|$)/);
        const careers = careerMatch?.[1]
          ?.split('\n')
          ?.map(line => line.replace(/[*\s]/g, '').split('：')[1])
          ?.filter(Boolean) || [];

        // 文字のエネルギーを抽出
        const familyEnergy = name.familyName.split('').map(char => ({
          kanji: char,
          strokes: getStrokeCount(char),
          energy: getCharacterEnergy(char)
        }));

        const givenEnergy = name.givenName.split('').map(char => ({
          kanji: char,
          strokes: getStrokeCount(char),
          energy: getCharacterEnergy(char)
        }));

        sanitizedResponse = JSON.stringify({
          analysis: {
            basic: {
              fiveGrids: {
                heaven: { 
                  value: parseInt(heaven), 
                  meaning: sections['五格']?.match(/天格：.*?（(.*?)）/)?.[1] || "天格の意味", 
                  element: "火" 
                },
                person: { 
                  value: parseInt(person), 
                  meaning: sections['五格']?.match(/人格：.*?（(.*?)）/)?.[1] || "人格の意味", 
                  element: "土" 
                },
                earth: { 
                  value: parseInt(earth), 
                  meaning: sections['五格']?.match(/地格：.*?（(.*?)）/)?.[1] || "地格の意味", 
                  element: "土" 
                },
                outer: { 
                  value: parseInt(outer), 
                  meaning: sections['五格']?.match(/外格：.*?（(.*?)）/)?.[1] || "外格の意味", 
                  element: "火" 
                },
                total: { 
                  value: parseInt(total), 
                  meaning: sections['五格']?.match(/総格：.*?（(.*?)）/)?.[1] || "総格の意味", 
                  element: "火" 
                }
              },
              soundVibration: [3, 7, 2]  // デフォルト値
            },
            annualForecast: {
              "2024": sections['運勢予測'] || "運勢予測の内容"
            },
            overall: sections['基本分析'] || '',
            personality: sections['深層分析'] || '',
            career: sections['職業適性'] || '',
            relationships: sections['相性'] || '',
            luckPoints: sections['運気調整法']?.split('\n').filter(Boolean) || []
          },
          compatibility: {
            career: careers.length > 0 ? careers : ["起業家", "コンサルタント"]
          },
          luckyItems: {
            color: '赤',  // デフォルト値
            number: 1,    // デフォルト値
            direction: '南'  // デフォルト値
          },
          advice: sections['アドバイス']?.split('\n').filter(Boolean) || [],
          warnings: [],
          nameEnergy: {
            family: familyEnergy,
            given: givenEnergy
          },
          tenkaku: {
            value: parseInt(heaven),
            meaning: sections['五格']?.match(/天格：.*?（(.*?)）/)?.[1] || "天格の意味"
          },
          jinkaku: {
            value: parseInt(person),
            meaning: sections['五格']?.match(/人格：.*?（(.*?)）/)?.[1] || "人格の意味"
          },
          chikaku: {
            value: parseInt(earth),
            meaning: sections['五格']?.match(/地格：.*?（(.*?)）/)?.[1] || "地格の意味"
          },
          gaikaku: {
            value: parseInt(outer),
            meaning: sections['五格']?.match(/外格：.*?（(.*?)）/)?.[1] || "外格の意味"
          },
          soukaku: {
            value: parseInt(total),
            meaning: sections['五格']?.match(/総格：.*?（(.*?)）/)?.[1] || "総格の意味"
          }
        });
      }

      const result = JSON.parse(sanitizedResponse);
      return validateResultStructure(result);
    } catch (e) {
      console.error('JSON解析エラー:', e, 'Raw response:', response.content);
      throw new FortuneError(`無効なJSON形式: ${(e as Error).message}`, 'RESPONSE_FORMAT_ERROR');
    }
  } catch (error) {
    console.error('姓名判断エラー:', error);
    throw error instanceof FortuneError 
      ? error
      : new FortuneError('姓名判断に失敗しました', 'AI_ERROR');
  }
}

function validateResultStructure(result: any): SeimeiResult {
  const requiredFields = [
    'analysis.basic.fiveGrids.heaven.value',
    'analysis.basic.soundVibration',
    'analysis.annualForecast.2024',
    'compatibility.career',
    'luckyItems.color',
    'luckyItems.number',
    'luckyItems.direction'
  ];

  const missingFields = requiredFields.filter(field => 
    !field.split('.').reduce((obj, key) => obj?.[key], result)
  );

  if (missingFields.length > 0) {
    throw new Error(`不足フィールド: ${missingFields.join(', ')}`);
  }

  // 型チェックを強化
  if (!Array.isArray(result.compatibility.career)) {
    throw new Error('careerフィールドが配列形式ではありません');
  }

  return result as SeimeiResult;
}

// 漢字の画数を取得する関数（実際の実装は別途必要）
function getStrokeCount(char: string): number {
  // TODO: 実際の画数データベースを使用して実装
  return 5;
}

// 文字のエネルギーを取得する関数（実際の実装は別途必要）
function getCharacterEnergy(char: string): string {
  // TODO: 実際の五行データベースを使用して実装
  return "木の気";
} 
