import React, { InputHTMLAttributes, useCallback, useEffect, useReducer } from 'react';

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
  state: Map<string, SdSelectOption>,
  action: {
    type: 'toggle' | 'reset',
    payload: SdSelectOption | SdSelectOption[],
  },
): Map<string, SdSelectOption> {
  switch (action.type) {
    case 'toggle': {
      if (Array.isArray(action.payload)) {
        throw new Error('Array used in toggle');
      }
      const newState = new Map(state);
      newState.has(action.payload.value)
        ? newState.delete(action.payload.value)
        : newState.set(action.payload.value, action.payload);
      return newState;
    }
    case 'reset': {
      if (Array.isArray(action.payload)) {
        return new Map(action.payload.map((ic) => [ic.value, ic]));
      }
      throw new Error('Array required for reset');
    }
    default:
      throw new Error('Invalid action type');
  }
}

interface SdSelectContextProviderProps {
  initialChecked: SdSelectOption[];
}

export const SdSelectContextProvider = ({
  children, initialChecked,
}: React.PropsWithChildren<Partial<SdSelectContextProviderProps>>): JSX.Element => {
  const [
    selectedOptions, dispatchSelectedOption,
  ] = useReducer(selectedOptionsReducer, new Map());

  useEffect(() => {
    if (initialChecked) {
      dispatchSelectedOption({
        type: 'reset',
        payload: initialChecked,
      });
    }
  }, [initialChecked]);

  const onClickFn = useCallback((value: SdSelectOptionValue, name: string) => {
    let valueString;
    if (value) {
      if (typeof value === 'number') {
        valueString = value.toString();
      } else if (!Array.isArray(value)) {
        valueString = value as string;
      }
    }
    if (valueString) {
      dispatchSelectedOption({
        type: 'toggle',
        payload: { value: valueString, name: name },
      });
    }
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
