import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, History } from 'lucide-react';
// 動物の定義
const ANIMAL_TYPES = {
    lion: {
        name: 'ライオン',
        image: '/animals/lion.png',
        personality: 'リーダーシップがあり、カリスマ性のある性格',
        strengths: ['決断力', '勇気', '自信'],
        weaknesses: ['頑固さ', '独断的'],
        compatibility: ['イーグル', 'タイガー'],
        career: '経営者、管理職、政治家',
        advice: '他者の意見にも耳を傾けることで、より良いリーダーになれます。'
    },
    eagle: {
        name: 'イーグル',
        image: '/animals/eagle.png',
        personality: '洞察力が鋭く、大局的な視野を持つ性格',
        strengths: ['先見性', '判断力', '独立心'],
        weaknesses: ['孤高', '非妥協的'],
        compatibility: ['ライオン', 'フォックス'],
        career: '戦略家、コンサルタント、研究者',
        advice: 'チームワークを大切にすることで、より大きな成果が得られます。'
    },
    fox: {
        name: 'フォックス',
        image: '/animals/fox.png',
        personality: '賢く機転が利き、適応力のある性格',
        strengths: ['知恵', '柔軟性', '交渉力'],
        weaknesses: ['優柔不断', '計算高さ'],
        compatibility: ['イーグル', 'ディア'],
        career: '外交官、営業職、クリエイター',
        advice: '直感を信じることで、より良い機会をつかむことができます。'
    },
    deer: {
        name: 'ディア',
        image: '/animals/deer.png',
        personality: '優しく思いやりがあり、繊細な性格',
        strengths: ['共感力', '協調性', '芸術性'],
        weaknesses: ['優柔不断', '依存的'],
        compatibility: ['フォックス', 'ラビット'],
        career: 'カウンセラー、教師、アーティスト',
        advice: '自分の意見をもっと主張することで、より充実した人生が送れます。'
    },
    rabbit: {
        name: 'ラビット',
        image: '/animals/rabbit.png',
        personality: '好奇心旺盛で、社交的な性格',
        strengths: ['コミュニケーション力', '創造性', '明るさ'],
        weaknesses: ['落ち着きのなさ', '気分屋'],
        compatibility: ['ディア', 'タイガー'],
        career: '広報、エンターテイナー、デザイナー',
        advice: '一つのことに集中することで、より深い成果が得られます。'
    },
    tiger: {
        name: 'タイガー',
        image: '/animals/tiger.png',
        personality: '情熱的で行動力のある性格',
        strengths: ['実行力', '直感力', 'カリスマ性'],
        weaknesses: ['短気', '衝動的'],
        compatibility: ['ライオン', 'ラビット'],
        career: '起業家、アスリート、プロデューサー',
        advice: '計画的に行動することで、より確実な成功が得られます。'
    }
};
// 質問のリスト
const QUESTIONS = [
    {
        id: 1,
        text: '新しい環境での行動について、最も当てはまるものは？',
        options: [
            { value: 'lion', text: '率先して周りを引っ張っていく' },
            { value: 'eagle', text: 'まず状況を冷静に分析する' },
            { value: 'fox', text: '柔軟に対応しながら進める' },
            { value: 'deer', text: '周りの様子を見ながら慎重に進める' },
            { value: 'rabbit', text: '積極的に周りと交流する' },
            { value: 'tiger', text: '直感を信じて行動する' }
        ]
    },
    {
        id: 2,
        text: '困難な状況に直面したとき、あなたはどうする？',
        options: [
            { value: 'lion', text: '自分の信念を貫き通す' },
            { value: 'eagle', text: '最善の戦略を練り直す' },
            { value: 'fox', text: '状況に応じて方針を変える' },
            { value: 'deer', text: '誰かに相談する' },
            { value: 'rabbit', text: '新しいアイデアを探す' },
            { value: 'tiger', text: 'すぐに行動を起こす' }
        ]
    },
    {
        id: 3,
        text: '理想の休日の過ごし方は？',
        options: [
            { value: 'lion', text: '新しいプロジェクトの計画を立てる' },
            { value: 'eagle', text: '一人で趣味や研究に没頭する' },
            { value: 'fox', text: '様々な場所を探索する' },
            { value: 'deer', text: '大切な人と穏やかに過ごす' },
            { value: 'rabbit', text: '友人とアクティビティを楽しむ' },
            { value: 'tiger', text: 'スポーツや冒険に挑戦する' }
        ]
    }
];
export default function AnimalReader() {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [result, setResult] = useState(null);
    // 回答を処理する関数
    const handleAnswer = (answer) => {
        const newAnswers = [...answers, answer];
        setAnswers(newAnswers);
        if (currentQuestion < QUESTIONS.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
        else {
            // 最も多く選ばれた動物を結果として表示
            const animalCounts = newAnswers.reduce((acc, curr) => {
                acc[curr] = (acc[curr] || 0) + 1;
                return acc;
            }, {});
            // 最も多く選ばれた動物を特定
            let maxCount = 0;
            let resultAnimal = 'lion';
            Object.entries(animalCounts).forEach(([animal, count]) => {
                if (count > maxCount) {
                    maxCount = count;
                    resultAnimal = animal;
                }
            });
            setResult(resultAnimal);
        }
    };
    // 診断をリセットする関数
    const resetDiagnosis = () => {
        setCurrentQuestion(0);
        setAnswers([]);
        setResult(null);
    };
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-900 text-purple-100", children: [_jsx("nav", { className: "p-4 bg-purple-900/50", children: _jsxs("div", { className: "max-w-4xl mx-auto flex justify-between items-center", children: [_jsxs("button", { onClick: () => navigate('/fortune'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(Home, { size: 24 }), _jsx("span", { children: "\u30DB\u30FC\u30E0" })] }), _jsxs("div", { className: "flex space-x-4", children: [_jsx("button", { onClick: () => navigate('/fortune'), className: "px-4 py-2 bg-purple-800 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500", children: "\u5360\u3044\u9078\u629E\u306B\u623B\u308B" }), _jsxs("button", { onClick: () => navigate('/history'), className: "flex items-center space-x-2 text-purple-200 hover:text-purple-100", children: [_jsx(History, { size: 24 }), _jsx("span", { children: "\u5C65\u6B74" })] })] })] }) }), _jsx("main", { className: "container mx-auto px-4 py-8", children: _jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-purple-200 to-amber-200", children: "\u3042\u306A\u305F\u306E\u6027\u683C\u3092\u52D5\u7269\u3067\u8A3A\u65AD" }), !result ? (_jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsxs("h2", { className: "text-xl font-semibold mb-4", children: ["\u8CEA\u554F ", currentQuestion + 1, " / ", QUESTIONS.length] }), _jsx("p", { className: "text-lg mb-6", children: QUESTIONS[currentQuestion].text }), _jsx("div", { className: "space-y-3", children: QUESTIONS[currentQuestion].options.map((option, index) => (_jsx("button", { onClick: () => handleAnswer(option.value), className: "w-full p-3 text-left bg-purple-800/50 hover:bg-purple-800/70 rounded-lg transition-colors", children: option.text }, index))) })] }) })) : (_jsx("div", { className: "space-y-8", children: _jsxs("div", { className: "p-6 bg-purple-900/30 border border-purple-700/50 rounded-lg", children: [_jsx("h2", { className: "text-2xl font-bold text-center mb-6", children: "\u3042\u306A\u305F\u306E\u52D5\u7269\u30BF\u30A4\u30D7\u306F..." }), _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "w-48 h-48 mx-auto mb-4 rounded-full bg-purple-800/50 flex items-center justify-center", children: _jsx("img", { src: ANIMAL_TYPES[result].image, alt: ANIMAL_TYPES[result].name, className: "w-32 h-32 object-contain" }) }), _jsx("h3", { className: "text-3xl font-bold text-amber-200 mb-4", children: ANIMAL_TYPES[result].name }), _jsx("p", { className: "text-lg mb-6", children: ANIMAL_TYPES[result].personality })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-purple-200 mb-2", children: "\u9577\u6240" }), _jsx("ul", { className: "list-disc list-inside", children: ANIMAL_TYPES[result].strengths.map((strength, index) => (_jsx("li", { children: strength }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-purple-200 mb-2", children: "\u77ED\u6240" }), _jsx("ul", { className: "list-disc list-inside", children: ANIMAL_TYPES[result].weaknesses.map((weakness, index) => (_jsx("li", { children: weakness }, index))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-purple-200 mb-2", children: "\u76F8\u6027\u306E\u826F\u3044\u52D5\u7269" }), _jsx("p", { children: ANIMAL_TYPES[result].compatibility.join('、') })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-purple-200 mb-2", children: "\u5411\u3044\u3066\u3044\u308B\u8077\u696D" }), _jsx("p", { children: ANIMAL_TYPES[result].career })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-purple-200 mb-2", children: "\u30A2\u30C9\u30D0\u30A4\u30B9" }), _jsx("p", { children: ANIMAL_TYPES[result].advice })] })] }), _jsx("button", { onClick: resetDiagnosis, className: "w-full mt-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors", children: "\u3082\u3046\u4E00\u5EA6\u8A3A\u65AD\u3059\u308B" })] }) }))] }) })] }));
}
