import axios from 'axios';

interface GooAPIResponse {
  converted: string;
  output_type: string;
  request_id: string;
}

// 漢字からフリガナへの変換関数
export async function getKanaFromKanji(text: string): Promise<string> {
  try {
    // テキストが空の場合は空文字を返す
    if (!text) return '';

    // ひらがなカタカナのみの場合はそのまま返す
    if (/^[\u3040-\u309F\u30A0-\u30FF]+$/.test(text)) {
      return text;
    }

    // Goo APIを使用して漢字をフリガナに変換
    const response = await axios.post<GooAPIResponse>('https://labs.goo.ne.jp/api/hiragana', {
      app_id: import.meta.env.VITE_GOO_APP_ID,
      sentence: text,
      output_type: 'katakana'
    });

    if (response.data && response.data.converted) {
      return response.data.converted;
    }

    throw new Error('フリガナの変換に失敗しました。');
  } catch (error) {
    console.error('Error converting kanji to kana:', error);
    throw new Error('フリガナの変換中にエラーが発生しました。');
  }
} 
