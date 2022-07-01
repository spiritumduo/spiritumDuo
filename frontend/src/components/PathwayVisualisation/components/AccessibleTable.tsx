import React from 'react';

import { friendlyNames, ResultPeriod, PatientVisData, PatientPeriod, RequestPeriod } from '../util';

interface PeriodElementProps {
  period: PatientPeriod;
}

const PeriodElement = ({ period }: PeriodElementProps) => {
  let requests: JSX.Element[];
  if ((period as RequestPeriod).requests) {
    requests = (period as RequestPeriod).requests.map(
      (r) => <React.Fragment key={ r }>{r} <br /></React.Fragment>,
    );
  } else {
    requests = [<React.Fragment key="0">-</React.Fragment>];
  }

  let results: JSX.Element[];
  if ((period as ResultPeriod).results) {
    results = (period as ResultPeriod).results.map(
      (r) => <React.Fragment key={ r }>{r} <br /></React.Fragment>,
    );
  } else {
    results = [<React.Fragment key="0">-</React.Fragment>];
  }
  return (
    <>
      <td headers="pt">{friendlyNames[period.type]}</td>
      <td>{requests}</td>
      <td>{results}</td>
    </>
  );
};

export interface AccessibleTableProps {
  id?: string;
  data: PatientVisData[];
  onClick?: (data: PatientVisData) => void;
  className?: string;
  sortedKeys: string[];
}

export const AccessibleTable = ({
  id, data, sortedKeys, className, onClick,
}: AccessibleTableProps) => (
  <div className={ className } id={ id }>
    <table aria-label="Pathway Table">
      <thead>
        <tr>
          <th id="tname" scope="col" rowSpan={ 2 }>Name</th>
          <th id="thosp" scope="col" rowSpan={ 2 }>Hospital Number</th>
          <th id="tdob" scope="col" rowSpan={ 2 }>Date Of Birth</th>
          <th colSpan={ 4 } scope="colgroup" style={ { textAlign: 'center' } }>Periods</th>
        </tr>
        <tr>
          <th id="pt" scope="colgroup">Period Type</th>
          <th id="pt" scope="colgroup">Duration</th>
          <th id="preq" scope="colgroup">Outstanding Requests</th>
          <th id="pres" scope="colgroup">Awaiting Results</th>
        </tr>
      </thead>
      <tbody>
        {data.map((d) => (
          <React.Fragment key={ d.id }>
            <tr>
              <th
                id={ `rowname-${d.id}` }
                headers="tname"
                scope="rowgroup"
                rowSpan={ Object.keys(d.periods).length }
                role="rowheader"
              >
                <button
                  type="button"
                  tabIndex={ 0 }
                  onClick={ onClick ? () => onClick(d) : undefined }
                  role="link"
                >
                  {d.name}
                </button>
              </th>
              <td headers={ `thosp rowname-${d.id}` }>{d.hospitalNumber}</td>
              <td headers={ `tdob rowname-${d.id}` }>{d.dateOfBirth.toLocaleDateString()}</td>
              {
                d.periods[sortedKeys[0]] !== undefined
                  ? (
                    <PeriodElement period={ d.periods[sortedKeys[0]] } />
                  )
                  : null
              }
            </tr>
            {
              Object.keys(d.periods).length > 1
                ? sortedKeys.map((k, index) => (
                  d.periods[k] !== undefined && index !== 0
                    ? (
                      // The array index is stable in this case
                      // eslint-disable-next-line react/no-array-index-key
                      <tr key={ `period-${d.id}-${index}` }>
                        <td>-</td>
                        <td>-</td>
                        <PeriodElement period={ d.periods[k] } />
                      </tr>
                    )
                    : null
                ))
                : null
            }
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);
