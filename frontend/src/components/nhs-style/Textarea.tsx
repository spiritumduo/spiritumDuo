import React, { forwardRef, HTMLProps } from 'react';
import classNames from 'classnames';
import FormGroup, { FormElementProps } from './FormGroup';

type TextareaProps = HTMLProps<HTMLTextAreaElement> & FormElementProps;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function Textarea(props: TextareaProps, ref) {
    return (
      <FormGroup<TextareaProps> { ...props }>
        {({ className, error, ...rest }) => (
          <textarea
            className={ classNames('nhsuk-textarea', { 'nhsuk-textarea--error': error }, className) }
            { ...rest }
            ref={ ref }
          />
        )}
      </FormGroup>
    );
  },
);

export default Textarea;
