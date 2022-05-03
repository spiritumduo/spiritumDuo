import React from 'react';

import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// APP
import { Input, Select, CheckboxBox } from 'components/nhs-style';
import { PathwayContext } from 'app/context';

import PathwayManagementTabSet from 'tabsets/PathwayManagement';
import RoleManagementTabSet from 'tabsets/RoleManagement';

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
