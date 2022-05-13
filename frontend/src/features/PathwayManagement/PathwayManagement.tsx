import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ErrorMessage } from 'nhsuk-react-components';

import CreatePathwayTab from './tabpages/CreatePathwayTab';
import UpdatePathwayTab from './tabpages/UpdatePathwayTab';
import DeletePathwayTab from './tabpages/DeletePathwayTab';

import { getMilestoneTypes } from './__generated__/getMilestoneTypes';
import { getPathways } from './__generated__/getPathways';

export const GET_MILESTONE_TYPES = gql`
  query getMilestoneTypes{
    getMilestoneTypes{
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
      milestoneTypes{
        id
        name
        refName
      }
    }
  }
`;

const PathwayManagementTabSet = (): JSX.Element => {
  const { loading: loadingMilestoneTypes,
    data: dataMilestoneTypes,
    error: errorMilestoneTypes} = useQuery<getMilestoneTypes>(GET_MILESTONE_TYPES);

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
        errorMilestoneTypes?.message
          ? <ErrorMessage>An error occured: {errorMilestoneTypes.message}</ErrorMessage>
          : null
      }
      {
        errorPathways?.message
          ? <ErrorMessage>An error occured: {errorPathways.message}</ErrorMessage>
          : null
      }
      <TabPanel>
        <CreatePathwayTab
          disableForm={ loadingMilestoneTypes }
          refetchPathways={ refetchPathways }
          milestoneTypes={ dataMilestoneTypes?.getMilestoneTypes?.map((mT) => (
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
          disableForm={ loadingMilestoneTypes || loadingPathways }
          refetchPathways={ refetchPathways }
          milestoneTypes={ dataMilestoneTypes?.getMilestoneTypes?.map((mT) => (
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
                milestoneTypes: pW.milestoneTypes?.map((mT) => ({
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
          disableForm={ loadingMilestoneTypes || loadingPathways }
          refetchPathways={ refetchPathways }
          milestoneTypes={ dataMilestoneTypes?.getMilestoneTypes?.map((mT) => (
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
                milestoneTypes: pW.milestoneTypes?.map((mT) => ({
                  id: mT.id,
                  name: mT.name,
                  refName: mT.refName,
                })),
              } : null
            ))
          }
        />
      </TabPanel>
    </Tabs>
  );
};

export default PathwayManagementTabSet;
