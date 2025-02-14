import React from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyForm, { SurveyData } from '../components/SurveyForm';

export default function SurveyPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: SurveyData) => {
    try {
      // 本番環境のAPIエンドポイント
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      
      const response = await fetch(`${apiUrl}/api/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // CORS対策
          'Accept': 'application/json',
        },
        credentials: 'include', // クッキーを含める
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        // レスポンスのエラーメッセージを取得
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'アンケートの送信に失敗しました');
      }

      // 送信成功後、完了ページに遷移
      navigate('/survey/complete');
    } catch (error) {
      console.error('Survey submission error:', error);
      
      // 開発環境の場合は、一時的にエラーを無視して完了ページに遷移
      if (import.meta.env.DEV) {
        console.warn('開発環境: エラーを無視して完了ページに遷移します');
        navigate('/survey/complete');
        return;
      }
      
      throw error;
    }
  };

  return <SurveyForm onSubmit={handleSubmit} />;
} 