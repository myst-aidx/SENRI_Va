/// <reference types="cypress" />
import { mount } from 'cypress/react18';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../src/contexts/AuthContext';
import { ThemeProvider } from '../../src/contexts/ThemeContext';
import { PersonalInfoProvider } from '../../src/contexts/PersonalInfoContext';
import { LoadingProvider } from '../../src/contexts/LoadingContext';
import '../../src/index.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
      intercept(
        url: string | RegExp | Partial<Cypress.RequestOptions>,
        response?: string | object | Function
      ): Chainable<null>;
      intercept(
        method: string,
        url: string | RegExp,
        response?: string | object | Function
      ): Chainable<null>;
    }
  }
}

Cypress.Commands.add('mount', (component: React.ReactNode) => {
  const wrapped = (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LoadingProvider>
            <PersonalInfoProvider>
              {component}
            </PersonalInfoProvider>
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );

  return mount(wrapped);
});