import React from 'react';

import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { AdminUser } from 'features/AdminUser';
import CreateRoleTab from 'components/CreateRoleTab';
import UpdateRoleTab from 'components/UpdateRoleTab';
import DeleteRoleTab from 'components/DeleteRoleTab';

const AdministrationPage = (): JSX.Element => (
  <Container>
    <Tabs>
      <TabList>
        <Tab>Users</Tab>
        <Tab>Roles management</Tab>
      </TabList>
      <TabPanel>
        <AdminUser />
      </TabPanel>
      <TabPanel>
        <Tabs>
          <TabList>
            <Tab>Create role</Tab>
            <Tab>Update role</Tab>
            <Tab>Delete role</Tab>
          </TabList>
          <TabPanel>
            <CreateRoleTab />
          </TabPanel>
          <TabPanel>
            <UpdateRoleTab />
          </TabPanel>
          <TabPanel>
            <DeleteRoleTab />
          </TabPanel>
        </Tabs>
      </TabPanel>
    </Tabs>
  </Container>
);

export default AdministrationPage;
