import '../src/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import '../src/index.css';
import { MockedProvider } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router';
import { addDecorator } from '@storybook/react';

addDecorator((Story) => (<MemoryRouter initialEntries={['/']}><Story /></MemoryRouter>));
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  apolloClient: {
    MockedProvider,
    // any props you want to pass to MockedProvider on every story
  },
}