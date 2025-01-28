/// <reference types="cypress" />
import React from 'react';
import { mount } from 'cypress/react18';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../src/theme';
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode, options?: object): Cypress.Chainable;
    }
  }
}

Cypress.Commands.add('mount', (component: React.ReactNode, options = {}) => {
  const wrapped = (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    </BrowserRouter>
  );
  return mount(wrapped, options);
}); 