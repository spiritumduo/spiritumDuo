/* eslint-disable import/no-extraneous-dependencies */
import React, { PropsWithChildren, useEffect, useLayoutEffect } from 'react';
import MDate from 'mockdate';

type MockDateProps = PropsWithChildren<{
  date: string | number | Date;
}>;

const MockDate = ({ date, children }: MockDateProps): JSX.Element => {
  useLayoutEffect(() => {
    MDate.set(date);
    return () => MDate.reset();
  }, [date]);
  return <>{children}</>;
};

export default MockDate;
