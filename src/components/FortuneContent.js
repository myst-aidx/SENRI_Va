import { jsx as _jsx } from "react/jsx-runtime";
import { useLocation } from 'react-router-dom';
import FortunePage from '../pages/FortunePage';
import AstrologyChatBot from './AstrologyChatBot';
import TarotReader from './TarotReader';
import PalmReader from './PalmReader';
import { NumerologyReader } from './NumerologyReader';
import DreamReader from './DreamReader';
import AnimalReader from './AnimalReader';
import FourPillarsReader from './FourPillarsReader';
import HistoryPage from '../pages/HistoryPage';
import FengshuiReader from './FengshuiReader';
export function FortuneContent() {
    const location = useLocation();
    const path = location.pathname.split('/').pop();
    // パスに基づいて適切なコンポーネントを返す
    const renderContent = () => {
        if (!path || path === '') {
            return _jsx(FortunePage, {});
        }
        switch (path) {
            case 'astrology':
                return _jsx(AstrologyChatBot, {});
            case 'tarot':
                return _jsx(TarotReader, {});
            case 'palm':
                return _jsx(PalmReader, {});
            case 'numerology':
                return _jsx(NumerologyReader, {});
            case 'dream':
                return _jsx(DreamReader, {});
            case 'animal':
                return _jsx(AnimalReader, {});
            case 'fourpillars':
                return _jsx(FourPillarsReader, {});
            case 'history':
                return _jsx(HistoryPage, {});
            case 'fengshui':
                return _jsx(FengshuiReader, {});
            default:
                return _jsx(FortunePage, {});
        }
    };
    return renderContent();
}
