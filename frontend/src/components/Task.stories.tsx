import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Task, { TaskProps } from './Task'

export default {
  title: 'Components/Task',
  component: Task,
} as ComponentMeta<typeof Task>;

const Template: ComponentStory<typeof Task> = (args) => <Task {...args} />;

export const Default = Template.bind({});
Default.args = {
  task: {
    id: 1,
    title: 'Test Task',
    state: 'TASK_INBOX',
    updatedAt: new Date(2021, 0, 1, 9, 0),
  },
  onArchiveTask: () => {},
  onPinTask: () => {},
};

export const Pinned = Template.bind({});
Pinned.args = {
  ...Default.args,
  task: {
     // args? Partial<TaskProps> | undefined, so cast to TaskProps
    ...(Default.args.task as TaskProps["task"]),
    state: 'TASK_PINNED',
  },
};

export const Archived = Template.bind({});
Archived.args = {
    ...Default.args,
    task: {
      ...(Default.args.task as TaskProps["task"]),
      state: 'TASK_ARCHIVED',
    }
    
};