/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { ConfigProvider, ConfigInterface } from 'components/ConfigContext';

const MockConfigProvider = (
  { children, value }: React.PropsWithChildren<{ value?: ConfigInterface }>,
) => (
  <ConfigProvider
    value={ {
      hospitalNumberFormat: value ? value.hospitalNumberFormat : '@@@@: @@@++++L',
      nationalNumberFormat: value ? value.nationalNumberFormat : '@@@@: @@@-@@@-@+++L',
    } }
  >
    { children }
  </ConfigProvider>
);

export default MockConfigProvider;
