import React, { useState } from 'react';
import { calculateSeimei } from './seimei';

const SeimeiReader: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // フォーム送信時に calculateSeimei を呼び出す
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await calculateSeimei(input);
      setResult(res);
      setError(null);
    } catch (err: any) {
      // エラー発生時はエラーメッセージを設定
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div>
      <h1>姓名判断アプリ</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="姓名を入力してください"
        />
        <button type="submit">姓名判断を実行</button>
      </form>
      {error && (
        <div style={{ color: 'red' }}>
          エラー: {error}
        </div>
      )}
      {result && (
        <pre>
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default SeimeiReader; 