import { gql, useQuery } from '@apollo/client';
import { CheckboxBox, Input } from 'components/nhs-style';
import { Breadcrumb, Card, Checkboxes, Container, ErrorMessage, Select, SummaryList, Table, Textarea } from 'nhsuk-react-components';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import { getPatientForMdt } from './__generated__/getPatientForMdt';

const GET_PATIENT_QUERY = gql`
  query getPatientForMdt($id: ID!, $mdtId: ID!){
    getPatient(id: $id){
      id
      firstName
      lastName
      hospitalNumber
      nationalNumber
      telephoneNumber
      occupation
      sex
      dateOfBirth
      communicationMethod
      address{
        line
        city
        district
        postalCode
        country
      }
      onMdts(id: $mdtId){
        id
      }
    }
  }
`;

const MDTPatientPage = (): JSX.Element => {
  const { patientId, mdtId } = useParams();

  console.log(mdtId, patientId);

  const { loading, error, data } = useQuery<getPatientForMdt>(
    GET_PATIENT_QUERY, {
      variables: {
        id: patientId,
        mdtId: mdtId,
      },
    },
  );

  if (!data?.getPatient?.onMdts?.[0]) {
    return (
      <Container className="my-4">
        <ErrorMessage>ERROR: this patient does not exist on this MDT</ErrorMessage>
      </Container>
    );
  }

  return (
    <Container>
      <Breadcrumb style={ { backgroundColor: 'transparent' } }>
        <Breadcrumb.Item href="../../mdt">MDTs</Breadcrumb.Item>
        <Breadcrumb.Item href={ `../${mdtId}` }>Patient list</Breadcrumb.Item>
        <Breadcrumb.Item href="">Patient</Breadcrumb.Item>
      </Breadcrumb>
      <div className="col-12 col-lg-6 d-inline-block">
        <SummaryList className="my-2">
          <SummaryList.Row>
            <SummaryList.Key>First name</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.firstName}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Last name</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.lastName}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Hospital number</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.hospitalNumber}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>National number</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.nationalNumber}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Address</SummaryList.Key>
            <SummaryList.Value>
              {data?.getPatient?.address.line}<br />
              {data?.getPatient?.address.city}<br />
              {data?.getPatient?.address.district}<br />
              {data?.getPatient?.address.postalCode}<br />
              {data?.getPatient?.address.country}
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Telephone number</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.telephoneNumber}</SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
      </div>
      <div className="col-12 col-lg-6 d-inline-block">
        <SummaryList className="my-2">
          <SummaryList.Row>
            <SummaryList.Key>Occupation</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.occupation}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Communication preference</SummaryList.Key>
            <SummaryList.Value>{data?.getPatient?.communicationMethod}</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Send patient information video</SummaryList.Key>
            <SummaryList.Value>
              <Checkboxes>
                <Checkboxes.Box value="sendPiv"> </Checkboxes.Box>
              </Checkboxes>
            </SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
      </div>
      <Tabs>
        <TabList>
          <Tab>Referrals</Tab>
          <Tab>Investigations</Tab>
          <Tab>Follow up</Tab>
          <Tab>DVLA</Tab>
        </TabList>
        <TabPanel>
          Thing
        </TabPanel>
        <TabPanel>
          Thing
        </TabPanel>
        <TabPanel>
          Thing
        </TabPanel>
        <TabPanel>
          Thing
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default MDTPatientPage;
