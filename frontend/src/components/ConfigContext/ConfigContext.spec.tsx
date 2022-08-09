import React, { useLayoutEffect } from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider, useConfig } from './ConfigContext';

const testHospitalNumberFormat = 'testHospitalFormat';
const testNationalNumberFormat = 'testNationalFormat';

const ContextTest = () => {
  const { updateConfig, hospitalNumberFormat, nationalNumberFormat } = useConfig();
  const [configSet, setConfigSet] = React.useState(false); // avoid infinite rerender in story
  useLayoutEffect(() => {
    if (!configSet) {
      updateConfig({
        hospitalNumberFormat: testHospitalNumberFormat,
        nationalNumberFormat: testNationalNumberFormat,
      });
      setConfigSet(true);
    }
  }, [configSet, updateConfig]);
  return <div>{`${hospitalNumberFormat} ${nationalNumberFormat}`}</div>;
};

it('Should update the config when supplied with correct values', () => {
  render(<ConfigProvider><ContextTest /></ConfigProvider>);
  expect(screen.getByText(`${testHospitalNumberFormat} ${testNationalNumberFormat}`)).toBeInTheDocument();
});
