import { CheckboxBox, Input } from 'components/nhs-style';
import { Card, Checkboxes, Container, Select, SummaryList, Table, Textarea } from 'nhsuk-react-components';
import React, { useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

const MDTPatientPage = (): JSX.Element => {
  console.log('test');
  return (
    <Container>
      <div className="col-12 col-lg-6 d-inline-block">
        <SummaryList className="my-2">
          <SummaryList.Row>
            <SummaryList.Key>First name</SummaryList.Key>
            <SummaryList.Value>John</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Last name</SummaryList.Key>
            <SummaryList.Value>Doe</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Hospital number</SummaryList.Key>
            <SummaryList.Value>fMRN123456</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>National number</SummaryList.Key>
            <SummaryList.Value>fNHS12345678</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Address</SummaryList.Key>
            <SummaryList.Value>
              64 Zoo Lane<br />
              Neverland<br />
              Nevershire<br />
              ZO0 7NE
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Telephone number</SummaryList.Key>
            <SummaryList.Value>01234 567890</SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
      </div>
      <div className="col-12 col-lg-6 d-inline-block">
        <SummaryList className="my-2">
          <SummaryList.Row>
            <SummaryList.Key>Occupation</SummaryList.Key>
            <SummaryList.Value>Professional Thing Do-er</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Communication preference</SummaryList.Key>
            <SummaryList.Value>Pigeon mail</SummaryList.Value>
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
