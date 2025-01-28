// 占い結果の共通型
export interface FortuneReading {
  type: 'tarot' | 'numerology' | 'palm' | 'dream';
  reading: string;
  timestamp: string;
}

// タロット占いの結果型
export interface TarotReading extends FortuneReading {
  type: 'tarot';
  cards: string[];
  spread: string;
  question?: string;
}

// 数秘術の結果型
export interface NumerologyReading extends FortuneReading {
  type: 'numerology';
  birthDate: string;
  name?: string;
  destinyNumber: number;
  nameNumber?: number;
  description: string;
  detailedDescription: string;
  positiveTraits: string[];
  challenges: string[];
  compatibleNumbers: number[];
  luckyItems: string[];
}

// 手相占いの結果型
export interface PalmReading extends FortuneReading {
  type: 'palm';
  imageUrl: string;
}

// 夢占いの結果型
export interface DreamReading extends FortuneReading {
  type: 'dream';
  content: string;
}

// 数秘術のパラメータ型
export interface NumerologyParams {
  birthDate: string;
  name?: string;
}
