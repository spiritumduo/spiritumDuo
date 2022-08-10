import React, { ElementType, useState } from 'react';

export interface ConfigInterface {
  hospitalNumberFormat: string;
  nationalNumberFormat: string;
}

export type ConfigContextType = ConfigInterface & {
  updateConfig: (config: ConfigInterface) => void;
};

/**
 * ConfigContext is a React context that holds the current config.
 * Do not use this directly, use the useConfig hook instead.
 */
const ConfigContext = React.createContext<ConfigContextType | undefined>(undefined);

/**
 * ConfigProvider is a React component that provides the ConfigContext.
 * @param {React.ComponentPropsWithRef<ElementType>} props
 * @returns {JSX.Element}
 */
export const ConfigProvider = (
  { children, value }: React.PropsWithChildren<{ value?: ConfigInterface }>,
): JSX.Element => {
  const localStorageConfig = localStorage.getItem('config');
  const parsedConfig: ConfigInterface = localStorageConfig
    ? JSON.parse(localStorageConfig)
    : undefined;
  const initialState = value || parsedConfig || {
    hospitalNumberFormat: '',
    nationalNumberFormat: '',
  };
  const [configState, updateConfigState] = useState<ConfigInterface>(initialState);

  const updateConfig = (config: ConfigInterface) => {
    try {
      localStorage.setItem('config', JSON.stringify(config));
      updateConfigState(config);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  };

  return (
    <ConfigContext.Provider value={ { ...configState, updateConfig } }>
      { children }
    </ConfigContext.Provider>
  );
};

/**
 * useConfig - hook to get the config context
 * This avoids having to check for undefined when we consume the context
 * @returns {ConfigContextType}
 */
export const useConfig = (): ConfigContextType => {
  const context = React.useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
