import React from 'react';
import PersonalizedChatBot from './PersonalizedChatBot';

describe('PersonalizedChatBot', () => {
  it('renders and handles chat interaction', () => {
    cy.mount(<PersonalizedChatBot />);
    cy.get('[data-testid="chat-input"]').should('exist');
    cy.get('[data-testid="chat-input"]').type('Hello{enter}');
    cy.get('[data-testid="chat-messages"]').should('contain', 'Hello');
  });

  it('handles API interaction', () => {
    cy.intercept('POST', '/api/chat', {
      statusCode: 200,
      body: { response: 'Test response' }
    }).as('chatRequest');

    cy.mount(<PersonalizedChatBot />);
    cy.get('[data-testid="chat-input"]').type('Test message{enter}');
    cy.wait('@chatRequest');
    cy.get('[data-testid="chat-messages"]').should('contain', 'Test response');
  });
});