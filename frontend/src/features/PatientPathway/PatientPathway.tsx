import React, { useMemo } from 'react';
import PathwayVisualisation, { PatientVisData, patientToVisData, PATIENT_PARTS_FOR_GRP } from 'components/PathwayVisualisation';
import { gql, useQuery } from '@apollo/client';
import { ParentSize } from '@visx/responsive';

import { getPatientWithReferrals } from './__generated__/getPatientWithReferrals';

export const GET_PATIENT_WITH_REFERRALS_QUERY = gql`
  ${PATIENT_PARTS_FOR_GRP}
  query getPatientWithReferrals($hospitalNumber: String!) {
    getPatient(hospitalNumber: $hospitalNumber) {
      ...GrpPatientFields
    }
  }
`;

export interface PatientPathwayProps {
  hospitalNumber: string;
  showName?: boolean;
  showNationalNumber?: boolean;
  maxDays?: number;
}

const PatientPathway = (
  { hospitalNumber, maxDays = 70, showName, showNationalNumber }: PatientPathwayProps,
): JSX.Element => {
  const {
    loading, error, data,
  } = useQuery<getPatientWithReferrals>(
    GET_PATIENT_WITH_REFERRALS_QUERY,
    { variables: { hospitalNumber } },
  );

  const patientData: PatientVisData | undefined = useMemo(() => {
    if (data?.getPatient) {
      return patientToVisData(data.getPatient);
    }
    return undefined;
  }, [data]);

  if (patientData) {
    return (
      <ParentSize debounceTime={ 0 }>
        {({ width: parentWidth }) => (
          <PathwayVisualisation
            showName={ showName }
            axisBottom
            showNationalNumber={ showNationalNumber }
            maxDays={ maxDays }
            backgroundColor="white"
            data={ [patientData] }
            width={ parentWidth }
            margin={ { top: 0, right: 10, bottom: 0, left: 10 } }
          />
        )}
      </ParentSize>
    );
  }
  return <h1>Loading!</h1>;
};

export default PatientPathway;
