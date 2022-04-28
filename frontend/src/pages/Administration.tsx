import React from 'react';

import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import AdminUserCreate from 'features/AdminUserCreate';
import AdminUserUpdate from 'features/AdminUserUpdate';

const AdministrationPage = (): JSX.Element => (
  <Container>
    <Tabs>
      <TabList>
        <Tab>Create user</Tab>
        <Tab>Update User</Tab>
      </TabList>
      <TabPanel>
        <AdminUserCreate />
      </TabPanel>
      <TabPanel>
        <AdminUserUpdate updateUserId="50" />
      </TabPanel>
    </Tabs>
  </Container>
);

export default AdministrationPage;
