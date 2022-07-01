import React from 'react';

export interface TooltipContentsProps {
  requests?: string[];
  results?: string[];
}

export const TooltipContents = ({ requests, results }: TooltipContentsProps) => (
  <div>
    <div>
      {
      results !== undefined
        ? (
          <>
            <div>
              <h5><span>Awaiting Acknowledgement</span></h5>
            </div>
            {results.map((r) => (
              <div key={ `${String(Symbol(r))}` } role="cell">
                {r}
              </div>
            ))}
          </>
        )
        : false
      }
    </div>
    <div>
      {
      requests !== undefined
        ? (
          <>
            <div>
              <h5><span>Outstanding Requests</span></h5>
            </div>
            {requests.map((r) => (
              <div key={ `${String(Symbol(r))}` } role="cell">
                {r}
              </div>
            ))}
          </>
        )
        : false
      }
    </div>
  </div>
);
