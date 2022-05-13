import React from 'react';
import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// APP
import PathwayManagementTabSet from 'features/PathwayManagement/PathwayManagement';
import RoleManagementTabSet from 'features/RoleManagement/RoleManagement';
import { AdminUser } from 'features/AdminUser';

const AdministrationPage = (): JSX.Element => (
  <Container>
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
        <Tab>Roles management</Tab>
        <Tab>Pathway management</Tab>
      </TabList>
      <TabPanel>
        <AdminUser />
      </TabPanel>
      <TabPanel>
        <RoleManagementTabSet />
      </TabPanel>
      <TabPanel>
        <PathwayManagementTabSet />
      </TabPanel>
    </Tabs>
  </Container>
);

export default AdministrationPage;
