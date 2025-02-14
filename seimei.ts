export class FortuneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FortuneError";
  }
}

export async function calculateSeimei(input: string): Promise<any> {
  try {
    // APIに対してPOSTリクエストを送信
    const response = await fetch('https://api.example.com/seimei', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ input })
    });

    // APIからのレスポンスをテキストとして取得
    const text = await response.text();

    // 取得したレスポンスをトリムして、JSONとして有効かどうかをチェック
    const trimmed = text.trim();
    if (!(trimmed.startsWith("{") || trimmed.startsWith("["))) {
      // JSON形式の開始/終了記号が不足している場合はエラーを投げる
      throw new Error("JSON形式の開始/終了記号が不足しています");
    }

    // 文字列が有効なJSONの場合、パースを実施
    const result = JSON.parse(trimmed);
    return result;
  } catch (error: any) {
    // エラーが発生した場合、FortuneError として再スロー
    throw new FortuneError("無効なJSON形式: " + error.message);
  }
} 