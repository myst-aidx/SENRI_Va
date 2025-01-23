import { jsx as _jsx } from "react/jsx-runtime";
import AstrologyChatBot from './AstrologyChatBot';
import { BrowserRouter } from 'react-router-dom';
describe('AstrologyChatBot', () => {
    it('renders chat interface', () => {
        cy.mount(_jsx(BrowserRouter, { children: _jsx(AstrologyChatBot, {}) }));
        cy.get('[data-testid="astrology-chat-interface"]').should('exist'); //Using data-testid from edited code
        cy.get('.chat-container').should('exist'); //Keeping original check for completeness
        cy.get('.message-input').should('exist');
        cy.get('button').contains('送信').should('exist');
    });
    it('handles astrology predictions', () => {
        cy.intercept('POST', '/api/fortune/astrology', {
            statusCode: 200,
            body: { prediction: 'Your stars are aligned' }
        }).as('astrologyRequest');
        cy.mount(_jsx(BrowserRouter, { children: _jsx(AstrologyChatBot, {}) }));
        cy.get('[data-testid="query-input"]').type('What do my stars say?{enter}');
        cy.wait('@astrologyRequest');
        cy.get('[data-testid="prediction-result"]').should('contain', 'Your stars are aligned');
    });
    it('メッセージの送信が機能する', () => {
        const message = 'これからの運勢を教えてください';
        cy.get('.message-input').type(message);
        cy.get('button').contains('送信').click();
        cy.get('.user-message').last().should('contain', message);
    });
    it('AIの応答が表示される', () => {
        cy.intercept('POST', '/api/astrology/chat', {
            statusCode: 200,
            body: {
                message: 'あなたの星座は...',
                horoscope: {
                    sign: '牡羊座',
                    prediction: '良い機会に恵まれる時期です'
                }
            }
        }).as('getAstrologyResponse');
        cy.get('.message-input').type('今日の運勢を教えて');
        cy.get('button').contains('送信').click();
        cy.wait('@getAstrologyResponse');
        cy.get('.bot-message').last().should('contain', '牡羊座');
    });
    it('ホロスコープ情報が表示される', () => {
        cy.intercept('GET', '/api/astrology/horoscope', {
            statusCode: 200,
            body: {
                planets: [
                    { name: '太陽', sign: '牡羊座', house: 1 },
                    { name: '月', sign: '蟹座', house: 4 }
                ],
                aspects: [
                    { planet1: '太陽', planet2: '月', type: 'トライン' }
                ]
            }
        }).as('getHoroscope');
        cy.get('button').contains('ホロスコープを表示').click();
        cy.wait('@getHoroscope');
        cy.get('.horoscope-info').should('be.visible');
        cy.get('.planet-position').should('have.length.at.least', 2);
    });
    it('エラー処理が機能する', () => {
        cy.intercept('POST', '/api/astrology/chat', {
            statusCode: 500,
            body: {
                error: 'サーバーエラーが発生しました'
            }
        }).as('getChatError');
        cy.get('.message-input').type('今日の運勢を教えて');
        cy.get('button').contains('送信').click();
        cy.wait('@getChatError');
        cy.get('.error-message').should('be.visible');
    });
    it('チャット履歴が保存される', () => {
        cy.intercept('POST', '/api/fortune/history', {
            statusCode: 200,
            body: {
                message: '履歴が保存されました'
            }
        }).as('saveHistory');
        cy.get('.message-input').type('今日の運勢を教えて');
        cy.get('button').contains('送信').click();
        cy.wait('@saveHistory');
    });
    it('入力バリデーションが機能する', () => {
        cy.get('button').contains('送信').click();
        cy.get('.error-message').should('contain', 'メッセージを入力してください');
        const longMessage = 'a'.repeat(1001);
        cy.get('.message-input').type(longMessage);
        cy.get('.error-message').should('contain', 'メッセージは1000文字以内で入力してください');
    });
});
