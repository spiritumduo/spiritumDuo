import React, { useLayoutEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider, useConfig } from './ConfigContext';

const testHospitalNumberFormat = 'testHospitalFormat';
const testNationalNumberFormat = 'testNationalFormat';

const testConfig = {
  hospitalNumberFormat: testHospitalNumberFormat,
  nationalNumberFormat: testNationalNumberFormat,
};

const ContextTest = () => {
  const { updateConfig, hospitalNumberFormat, nationalNumberFormat } = useConfig();
  const [configSet, setConfigSet] = React.useState(false); // avoid infinite rerender in story
  useLayoutEffect(() => {
    if (!configSet) {
      updateConfig(testConfig);
      setConfigSet(true);
    }
  }, [configSet, updateConfig]);
  return <div>{`${hospitalNumberFormat} ${nationalNumberFormat}`}</div>;
};

describe('ConfigContext', () => {
  beforeEach(() => {
    localStorage.removeItem('config');
  });

  it('Should update the config when supplied with correct values', () => {
    render(<ConfigProvider><ContextTest /></ConfigProvider>);
    expect(screen.getByText(`${testHospitalNumberFormat} ${testNationalNumberFormat}`)).toBeInTheDocument();
  });

  it('Should persist the configuration in localStorage', () => {
    render(<ConfigProvider><ContextTest /></ConfigProvider>);
    const config = JSON.parse(localStorage.getItem('config') || '');
    expect(config).toEqual(testConfig);
  });
});
