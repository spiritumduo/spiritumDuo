import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ErrorMessage } from 'nhsuk-react-components';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

import CreatePathwayTab from './tabpages/CreatePathwayTab';
import UpdatePathwayTab from './tabpages/UpdatePathwayTab';
import DeletePathwayTab from './tabpages/DeletePathwayTab';

import { getClinicalRequestTypes } from './__generated__/getClinicalRequestTypes';
import { getPathways } from './__generated__/getPathways';

export const GET_CLINICALREQUEST_TYPES = gql`
  query getClinicalRequestTypes{
    getClinicalRequestTypes{
      id
      name
      refName
    }
  }
`;

export const GET_PATHWAYS = gql`
  query getPathways{
    getPathways{
      id
      name
      clinicalRequestTypes{
        id
        name
        refName
      }
    }
  }
`;

const PathwayManagementTabSet = (): JSX.Element => {
  const { loading: loadingClinicalRequestTypes,
    data: dataClinicalRequestTypes,
    error: errorClinicalRequestTypes} = useQuery<getClinicalRequestTypes>(GET_CLINICALREQUEST_TYPES);

  const { loading: loadingPathways,
    data: dataPathways,
    error: errorPathways,
    refetch: refetchPathways } = useQuery<getPathways>(GET_PATHWAYS);

  return (
    <Tabs>
      <TabList>
        <Tab>Create pathway</Tab>
        <Tab>Update pathway</Tab>
        <Tab>Delete pathway</Tab>
      </TabList>
      {
        errorClinicalRequestTypes?.message
          ? <ErrorMessage>An error occured: {errorClinicalRequestTypes.message}</ErrorMessage>
          : null
      }
      {
        errorPathways?.message
          ? <ErrorMessage>An error occured: {errorPathways.message}</ErrorMessage>
          : null
      }
      <LoadingSpinner loading={ loadingClinicalRequestTypes || loadingPathways }>
        <TabPanel>
          <CreatePathwayTab
            disableForm={ loadingClinicalRequestTypes }
            refetchPathways={ refetchPathways }
            clinicalRequestTypes={ dataClinicalRequestTypes?.getClinicalRequestTypes?.map((mT) => (
              {
                id: mT.id,
                name: mT.name,
                refName: mT.refName,
              }
            )) }
          />
        </TabPanel>
        <TabPanel>
          <UpdatePathwayTab
            disableForm={ loadingClinicalRequestTypes || loadingPathways }
            refetchPathways={ refetchPathways }
            clinicalRequestTypes={ dataClinicalRequestTypes?.getClinicalRequestTypes?.map((mT) => (
              {
                id: mT.id,
                name: mT.name,
                refName: mT.refName,
              }
            )) }
            pathways={
              dataPathways?.getPathways?.map((pW) => (
                pW ? {
                  id: pW.id,
                  name: pW.name,
                  clinicalRequestTypes: pW.clinicalRequestTypes?.map((mT) => ({
                    id: mT.id,
                    name: mT.name,
                    refName: mT.refName,
                  })),
                } : null
              ))
            }
          />
        </TabPanel>
        <TabPanel>
          <DeletePathwayTab
            disableForm={ loadingClinicalRequestTypes || loadingPathways }
            refetchPathways={ refetchPathways }
            clinicalRequestTypes={ dataClinicalRequestTypes?.getClinicalRequestTypes?.map((mT) => (
              {
                id: mT.id,
                name: mT.name,
                refName: mT.refName,
              }
            )) }
            pathways={
              dataPathways?.getPathways?.map((pW) => (
                pW ? {
                  id: pW.id,
                  name: pW.name,
                  clinicalRequestTypes: pW.clinicalRequestTypes?.map((mT) => ({
                    id: mT.id,
                    name: mT.name,
                    refName: mT.refName,
                  })),
                } : null
              ))
            }
          />
        </TabPanel>
      </LoadingSpinner>
    </Tabs>
  );
};

export default PathwayManagementTabSet;
