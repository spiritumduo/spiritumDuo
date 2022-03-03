import React, { HTMLProps } from 'react';

export interface InputProps extends HTMLProps<HTMLInputElement> {
  type: string;
  error?: string | boolean;
  label?: string;
  id: string;
  register: any;
}

const Input = ({
  error,
  label,
  id,
  register,
  ...other
}: InputProps): JSX.Element => {
  const _className = error ? 'nhsuk-input nhsuk-input--error' : 'nhsuk-input';
  const { ref, ...rest } = register;
  const _error = typeof error === 'string' ? <span className="nhsuk-error-message" id={ `${id}--error` } role="alert"><span className="nhsuk-u-visually-hidden">Error:</span>{ error }</span> : '';
  return (
    <div className="nhsuk-form-group">
      {label ? <label className="nhsuk-label" id={ `${id}--label` } htmlFor={ id }>{ label }</label> : ''}
      <input id={ id } className={ _className } ref={ ref } { ...rest } { ...other } />
      { _error }
    </div>
  );
};

export default Input;
