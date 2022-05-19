import React, { useState, useEffect } from 'react';

import LoadingSvg from 'static/i/loading.svg';

interface LoadingSpinnerProps{
    loading: boolean;
    setLoadingSpinnerShown?: (arg0: boolean) => void;
}

const LoadingSpinner = ({
  loading, setLoadingSpinnerShown,
}: LoadingSpinnerProps): JSX.Element => {
  const [showSpinner, setShowSpinner] = useState<boolean>(false);
  const [delayPassed, setDelayPassed] = useState<boolean>(false);
  const [delayTimeout, setDelayTimeout] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;
    if (loading) {
      setShowSpinner(true);
      if (setLoadingSpinnerShown) {
        setLoadingSpinnerShown(true);
      }
      setDelayPassed(false);
      setDelayTimeout(setTimeout(() => isMounted && setDelayPassed(true), 500));
    } else if (delayPassed) {
      setShowSpinner(false);
      if (isMounted && setLoadingSpinnerShown) {
        setLoadingSpinnerShown(false);
      }
    } else {
      setTimeout(() => {
        if (delayTimeout) {
          clearTimeout(delayTimeout);
        }
        if (isMounted) { setShowSpinner(false); }
        if (isMounted && setLoadingSpinnerShown) {
          setLoadingSpinnerShown(false);
        }
      }, 500);
    }
    return () => {
      isMounted = false;
      if (delayTimeout) {
        clearTimeout(delayTimeout);
      }
    };
  }, [delayPassed, loading, setLoadingSpinnerShown]);

  return (
    showSpinner
      ? (
        <div className="row">
          <div className="col-3 col-md-2 col-xl-1 mx-auto text-center">
            <object
              type="image/svg+xml"
              className="mt-4 mb-4"
              data={ LoadingSvg }
            >
              Loading animation
            </object>
          </div>
        </div>
      )
      : <></>
  );
};

export default LoadingSpinner;
