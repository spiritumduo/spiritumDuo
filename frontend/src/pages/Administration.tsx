import React from 'react';

import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { AdminUser } from 'features/AdminUser';

const AdministrationPage = (): JSX.Element => (
  <Container>
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
      </TabList>
      <TabPanel>
        <AdminUser />
      </TabPanel>
    </Tabs>
  </Container>
);

export default AdministrationPage;
