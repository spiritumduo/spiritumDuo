import React, { forwardRef } from 'react';
import { Input as NHSInput } from 'nhsuk-react-components';

const Input = forwardRef<HTMLInputElement, any>(
  // eslint-disable-next-line prefer-arrow-callback
  function Input(props, ref) {
    return <NHSInput { ...props } inputRef={ ref } />;
  },
);

export default Input;
