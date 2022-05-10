import React, { InputHTMLAttributes, useCallback, useReducer } from 'react';

export type SdSelectOptionValue = InputHTMLAttributes<HTMLInputElement>['value'];

export interface SdSelectOption {
  value: string;
  name: string;
}
interface SdSelectContextInterface {
  selectedOptions: Map<string, SdSelectOption>;
  optionOnClick: (value: SdSelectOptionValue, name: string) => void;
}

function contextNotSetupError() {
  throw new Error('SdSelectContext not configured');
}

const SdSelectContext = React.createContext<SdSelectContextInterface>({
  selectedOptions: new Map(),
  optionOnClick: () => contextNotSetupError(),
});

function selectedOptionsReducer(
  state: Map<string, SdSelectOption>, action: SdSelectOption,
): Map<string, SdSelectOption> {
  const newState = new Map(state);
  newState.has(action.value)
    ? newState.delete(action.value)
    : newState.set(action.value, action);
  return newState;
}

export const SdSelectContextProvider = (
  { children }: React.PropsWithChildren<Partial<{value: SdSelectContextInterface}>>,
): JSX.Element => {
  const [
    selectedOptions, dispatchSelectedOption,
  ] = useReducer(selectedOptionsReducer, new Map<string, SdSelectOption>());

  const onClickFn = useCallback((value: SdSelectOptionValue, name: string) => {
    let valueString;
    if (value) {
      if (typeof value === 'number') {
        valueString = value.toString();
      } else if (!Array.isArray(value)) {
        valueString = value as string;
      }
    }
    if (valueString) dispatchSelectedOption({ value: valueString, name: name });
  }, []);

  return (
    <SdSelectContext.Provider
      value={ {
        selectedOptions: selectedOptions,
        optionOnClick: onClickFn,
      } }
    >
      {children}
    </SdSelectContext.Provider>
  );
};

export default SdSelectContext;
