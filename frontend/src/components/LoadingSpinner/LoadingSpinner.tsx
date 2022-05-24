import React, { useState, useEffect, PropsWithChildren } from 'react';

import LoadingSpinnerSvg from './LoadingSpinnerSvg';

type LoadingSpinnerProps = PropsWithChildren<{
  loading: boolean;
  delay?: number;
}>;

const LoadingSpinner = ({ loading, delay = 500, children }: LoadingSpinnerProps): JSX.Element => {
  const [delayEndTime, setDelayEndTime] = useState<number>(0);
  useEffect(() => {
    if (loading && (delayEndTime === 0 && delay !== undefined)) setDelayEndTime(Date.now() + delay);
  }, [delay, delayEndTime, loading]);
  useEffect(() => {
    if (!loading && delayEndTime < Date.now()) setDelayEndTime(0);
  }, [delayEndTime, loading]);
  const showSpinner = (loading === true) || (delayEndTime > Date.now());
  // const showSpinner = true;
  return (
    showSpinner
      ? (
        <div className="row">
          <div className="col-3 col-md-2 col-xl-1 mx-auto text-center">
            <LoadingSpinnerSvg />
          </div>
        </div>
      )
      : <>{children}</>
  );
};

export default LoadingSpinner;
