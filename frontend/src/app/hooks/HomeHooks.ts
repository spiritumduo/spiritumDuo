import { useState } from 'react';
import { ApolloError, gql, useMutation, useQuery } from '@apollo/client';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import User from 'types/Users';
import { PatientListDataFn } from 'components/PatientList';
import { HomePageProps } from 'pages/HomePage';
import Patient from 'types/Patient';

export default function DefaultHomePageProps(): HomePageProps {
  const patientsPerPage = 20;
  const updateTriage = (selectedItem: { selected: number; }): void => {
    const x = 1;
  };

  const updateClinic = (selectedItem: { selected: number; }): void => {
    const x = 1;
  };

  const triageData: Patient[] = [];
  const clinicData: Patient[] = [];

  return { updateTriage, patientsPerPage, updateClinic, triageData, clinicData };
}
