import { theme } from '../../src/theme';
import './commands';
Cypress.Commands.add('mount', (component, options = {}) => {
    const wrapped = theme = { theme } >
        { component }
        < /ThemeProvider>
        < /BrowserRouter>;
});
return mount(wrapped, options);
;
