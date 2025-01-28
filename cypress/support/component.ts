/// <reference types="cypress" />
import { mount } from 'cypress/react18';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../../src/theme';
import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
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