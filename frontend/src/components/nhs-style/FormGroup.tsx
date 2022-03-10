import React, { ReactNode, HTMLProps } from 'react';
import classNames from 'classnames';
import { ErrorMessage, Hint, Label } from 'nhsuk-react-components';

export interface FormElementProps {
  id?: string;
  hint?: string;
  label?: string;
  error?: string
}

type FormGroupProps<T> = FormElementProps & {
  children: (props: FormElementRenderProps<T>) => ReactNode;
};

type BaseFormElementRenderProps = HTMLProps<
HTMLInputElement | HTMLDivElement | HTMLSelectElement | HTMLTextAreaElement
> & {
  error?: string | boolean;
};

type ExcludedProps =
  | 'hint'
  | 'label'
  | 'labelProps'
  | 'hintProps'
  | 'errorProps'
  | 'inputType'
  | 'disableErrorLine';

type FormElementRenderProps<T> = Omit<T, ExcludedProps> & {
  id: string;
  name: string;
};

const FormGroup = <T extends BaseFormElementRenderProps>(
  { children, hint, label, error, id, ...rest }: FormGroupProps<T>,
): JSX.Element => {
  const randomNumber = Math.random() + 1;
  const randomID = randomNumber.toString(36).substring(2, 10);
  const elementID = id || randomID;
  const labelID = `${id}-label`;
  const errorID = `${id}-error`;
  const hintID = `${id}-hint`;

  const childProps = {
    'aria-describedby': hint ? hintID : undefined,
    'aria-labelledby': label ? labelID : undefined,
    error: error,
    name: elementID,
    id: elementID,
    ...rest,
  } as FormElementRenderProps<T>;

  return (
    <div
      className={ classNames(
        'nhsuk-form-group',
        {
          'nhsuk-form-group--error': error,
        },
      ) }
    >
      {
        label
          ? (
            <Label id={ labelID } htmlFor={ elementID }>
              {label}
            </Label>
          )
          : null
      }
      {
        hint
          ? (
            <Hint id={ hintID }>
              {hint}
            </Hint>
          )
          : null
      }
      {
        error
          ? (
            <ErrorMessage id={ errorID }>
              {error}
            </ErrorMessage>
          )
          : null
      }
      {children(childProps)}
    </div>
  );
};

export default FormGroup;
