import React, { useState, useEffect, PropsWithChildren } from 'react';

import LoadingSpinnerSvg from './LoadingSpinnerSvg';

type LoadingSpinnerProps = PropsWithChildren<{
  loading: boolean;
  delay?: number;
}>;

const LoadingSpinner = ({ loading, delay = 500, children }: LoadingSpinnerProps): JSX.Element => {
  const [delayEndTime, setDelayEndTime] = useState<number>(0);
  const [
    showSpinner, setShowSpinner,
  ] = useState<boolean>((loading === true) || (delayEndTime > Date.now()));
  useEffect(() => {
    if (loading && (delayEndTime === 0 && delay !== undefined)) {
      setDelayEndTime(Date.now() + delay);
    } else if (!loading && delayEndTime < Date.now()) {
      setDelayEndTime(0);
    }
  }, [delay, delayEndTime, loading]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (loading || delayEndTime > Date.now()) {
      const interval = setInterval(() => {
        setShowSpinner((loading === true || delayEndTime > Date.now()));
      }, 100);
      return () => clearInterval(interval);
    }
    setShowSpinner(false);
  });

  return (
    showSpinner
      ? (
        <div className="row">
          <div className="col-3 col-md-2 col-xl-1 mt-3 mb-3 mx-auto text-center">
            <LoadingSpinnerSvg />
          </div>
        </div>
      )
      : <>{children}</>
  );
};

export default LoadingSpinner;
