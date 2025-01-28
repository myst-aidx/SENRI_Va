/// <reference types="cypress" />
// カスタムコマンドの実装をここに追加
// 例: Cypress.Commands.add('login', (email, password) => { ... })
// ローカルストレージクリアコマンド
Cypress.Commands.add('clearLocalStorage', () => {
    cy.window().then((win) => {
        win.localStorage.clear();
    });
});
// ログインコマンド
Cypress.Commands.add('login', (email, password) => {
    cy.intercept('POST', '/api/auth/login').as('loginRequest');
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
});
export {};
