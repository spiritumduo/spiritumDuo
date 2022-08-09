import React, { useLayoutEffect, useState } from 'react';
import { render, screen } from '@testing-library/react';
import { ConfigProvider, useConfig } from 'components/ConfigContext';

import { formatIdentifier, useHospitalNumberFormat, useNationalNumberFormat } from './format-identifier';

// We test these hooks by rendering them because they depend on React context

const TestConfigSetup = ({ children }: React.PropsWithChildren<unknown>): JSX.Element => {
  const { updateConfig } = useConfig();
  const [configured, setConfigured] = useState(false);
  useLayoutEffect(() => {
    if (!configured) {
      updateConfig({
        hospitalNumberFormat: 'f@@@: @@@@+++L',
        nationalNumberFormat: 'f@@@: @@@-@@@-@+++L',
      });
      setConfigured(true);
    }
  }, [configured, updateConfig]);
  return <div>{children}</div>;
};

const TestHospitalNumberFormat = ({ identifier }:{identifier: string}):JSX.Element => {
  const hospitalNumberFormat = useHospitalNumberFormat();
  return (
    <TestConfigSetup>
      <div>{hospitalNumberFormat(identifier)}</div>
    </TestConfigSetup>
  );
};

const TestNationalNumberFormat = ({ identifier }:{identifier: string}):JSX.Element => {
  const nationalNumberFormat = useNationalNumberFormat();
  return (
    <TestConfigSetup>
      <div>{nationalNumberFormat(identifier)}</div>
    </TestConfigSetup>
  );
};

test('useHospitalNumberFormat should format a full length hospitalNumber correctly', () => {
  render(
    <ConfigProvider>
      <TestHospitalNumberFormat identifier="MRN1234567" />
    </ConfigProvider>,
  );
  expect(screen.getByText('fMRN: 1234567L')).toBeInTheDocument();
});

test('useHospitalNumberFormat should format a short hospitalNumber correctly', () => {
  render(
    <ConfigProvider>
      <TestHospitalNumberFormat identifier="MRN1234" />
    </ConfigProvider>,
  );
  expect(screen.getByText('fMRN: 1234L')).toBeInTheDocument();
});

test('useNationalNumberFormat should format a full length nationalNumber correctly', () => {
  render(
    <ConfigProvider>
      <TestNationalNumberFormat identifier="NHS1234567890" />
    </ConfigProvider>,
  );
  expect(screen.getByText('fNHS: 123-456-7890L')).toBeInTheDocument();
});

test('useNationalNumberFormat should format a short nationalNumber correctly', () => {
  render(
    <ConfigProvider>
      <TestNationalNumberFormat identifier="NHS1234567" />
    </ConfigProvider>,
  );
  expect(screen.getByText('fNHS: 123-456-7L')).toBeInTheDocument();
});

test('formatIdentifier should format correctly', () => {
  const formatString = 'T@E@S@T';
  const identifier = '123';
  const result = formatIdentifier(identifier, formatString);
  expect(result).toBe('T1E2S3T');
});

test('formatIdentifier should throw exception if identifier is too short', () => {
  const formatString = 'T@E@S@T';
  const identifier = '12';
  expect(() => formatIdentifier(identifier, formatString)).toThrow();
});

test('formatIdentifier should throw exception if identifier is too long', () => {
  const formatString = 'T@E@S@T';
  const identifier = '1234';
  expect(() => formatIdentifier(identifier, formatString)).toThrow();
});

test('formatIdentifier should format full length string correctly with optional characters', () => {
  const formatString = 'T@E@S@T++';
  const identifier = '12345';
  const result = formatIdentifier(identifier, formatString);
  expect(result).toBe('T1E2S3T45');
});

test('formatIdentifier should format short string correctly with optional characters', () => {
  const formatString = 'T@E@S@T++';
  const identifier = '123';
  const result = formatIdentifier(identifier, formatString);
  expect(result).toBe('T1E2S3T');
});

test('formatIdentifier should throw exception if identifier is too short with optional characters', () => {
  const formatString = 'T@E@S@T++';
  const identifier = '12';
  expect(() => formatIdentifier(identifier, formatString)).toThrow();
});

test('formatIdentifier should throw exception if identifier is too long with optional characters', () => {
  const formatString = 'T@E@S@T++';
  const identifier = '123456';
  expect(() => formatIdentifier(identifier, formatString)).toThrow();
});
