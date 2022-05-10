/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useForm } from 'react-hook-form';

import CheckboxOption from './CheckboxOption';
import SdSelect from './SdSelect';

const options: {
  value: string;
  name: string;
  selected?: boolean;
}[] = [];
for (let i = 0; i < 5; ++i) {
  options.push({
    value: i.toString(),
    name: `Value ${i.toString()}`,
  });
}

export default {
  title: 'components/SdSelect',
  component: SdSelect,
} as ComponentMeta<typeof SdSelect>;

const Template: ComponentStory<typeof SdSelect> = (args) => <SdSelect { ...args } />;

export const Default = Template.bind({});

export const InForm:ComponentStory<typeof SdSelect> = () => {
  interface FormType {
    sdselect: string[];
  }
  const { getValues, handleSubmit, register } = useForm<FormType>();
  const [submitted, updateSubmitted] = useState<FormType>();

  const doSubmit = (values?: FormType) => {
    if (values) updateSubmitted(values);
  };
  return (
    <div className="div">
      <form
        action=""
        onSubmit={ handleSubmit(() => {
          const values = getValues();
          doSubmit(values);
        }) }
      >
        <SdSelect { ...register('sdselect') }>
          {
            options.map((o) => (
              <CheckboxOption
                key={ o.value }
                value={ o.value }
                name={ o.name }
                label={ o.name }
              />
            ))
          }
        </SdSelect>
        <button type="submit">Submit</button>
      </form>
      <div className="output-values">
        <ul>
          {
            submitted?.sdselect?.map((s) => <li key={ s }>{s}</li>)
          }
        </ul>
      </div>
    </div>
  );
};
