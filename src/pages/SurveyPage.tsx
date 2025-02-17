import React from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyForm, { SurveyData } from '../components/SurveyForm';

export default function SurveyPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data: SurveyData) => {
    try {
      // 本番環境のAPIエンドポイント
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/survey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          submittedAt: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'アンケートの送信に失敗しました');
      }

      const result = await response.json();
      console.log('Survey submitted successfully:', result);

      // 送信成功後、完了ページに遷移
      navigate('/survey/complete');
    } catch (error) {
      console.error('Survey submission error:', error);
      throw error;
    }
  };

  return <SurveyForm onSubmit={handleSubmit} />;
} 