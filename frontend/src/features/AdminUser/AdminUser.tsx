import React, { useCallback, useState } from 'react';
import { Container } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Modal } from 'react-bootstrap';
import { AdminUserCreate } from 'features/AdminUser/AdminUserCreate';
import { AdminUserUpdate } from 'features/AdminUser/AdminUserUpdate';
import { UserList } from 'features/AdminUser/components/UserList';

// eslint-disable-next-line import/prefer-default-export
export const AdminUser = (): JSX.Element => {
  const [selectedUserId, setSelectedUserId] = useState<string>();

  const userListOnClick = useCallback((id: string) => {
    setSelectedUserId(id);
  }, [setSelectedUserId]);

  const closeCallback = useCallback(() => {
    setSelectedUserId(undefined);
  }, [setSelectedUserId]);

  return (
    <>
      <Container>
        <Tabs>
          <TabList>
            <Tab>All</Tab>
            <Tab>Create user</Tab>
          </TabList>
          <TabPanel>
            <UserList userOnClick={ userListOnClick } />
          </TabPanel>
          <TabPanel>
            <AdminUserCreate />
          </TabPanel>
        </Tabs>
      </Container>
      {
        selectedUserId
          ? (
            <Modal show onHide={ closeCallback }>
              <Modal.Header closeButton>
                <Modal.Title>
                  Edit User
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <AdminUserUpdate updateUserId={ selectedUserId } />
              </Modal.Body>
            </Modal>
          )
          : undefined
      }
    </>
  );
};
