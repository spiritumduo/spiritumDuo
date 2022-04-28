import React, { useContext, useState } from 'react';

// LIBRARIES
import { Button, Checkboxes, Container, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Row, Col, Modal } from 'react-bootstrap';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// APP
import { Input, Select, CheckboxBox } from 'components/nhs-style';
import { PathwayContext } from 'app/context';
import CreateRoleTab from 'components/CreateRoleTab';
import UpdateRoleTab from 'components/UpdateRoleTab';
import DeleteRoleTab from 'components/DeleteRoleTab';

export type CreateUserReturnUser = {
  username: string;
  firstName: string;
  lastName: string;
  department: string;
  defaultPathwayId: number;
  isActive: boolean;
};

export type CreateUserReturnData = {
  error: string | null;
  user: CreateUserReturnUser | null;
};

export interface NewUserInputs {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  isActive: boolean;
  defaultPathwayId: string;
}

type CreateUserSubmitHook = [
  boolean,
  any,
  CreateUserReturnData | undefined,
  (variables: NewUserInputs) => void
];

export function useCreateUserSubmit(setShowModal: (arg0: boolean) => void): CreateUserSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<CreateUserReturnData | undefined>(undefined);

  async function createUser(variables: NewUserInputs) {
    setLoading(true);
    setData(undefined);
    setError(undefined);

    try {
      const { location } = window;
      const uriPrefix = `${location.protocol}//${location.host}`;
      const response = await window.fetch(`${uriPrefix}/api/rest/createuser`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(variables),
      });
      if (!response.ok) {
        setError(`Error: Response ${response.status} ${response.statusText}`);
        throw new Error(`Error: Response ${response.status} ${response.statusText}`);
      }
      const decoded: CreateUserReturnData = await response.json();
      if (decoded.error) {
        setError({ message: decoded.error });
      } else {
        setData(decoded);
        setShowModal(true);
      }
    } catch (err) {
      setError(err);
      setData(undefined);
    }
    setLoading(false);
  }
  return [loading, error, data, createUser];
}

const AdministrationPage = (): JSX.Element => {
  const { pathwayOptions } = useContext(PathwayContext);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [loading, error, data, createUser] = useCreateUserSubmit(setShowModal);

  const newUserInputSchema = yup.object({
    username: yup.string().required('Username is a required field'),
    password: yup.string().required('Password is a required field'),
    firstName: yup.string().required('First name is a required field'),
    lastName: yup.string().required('Last is a required field'),
    department: yup.string().required('Department is a required field'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<NewUserInputs>({ resolver: yupResolver(newUserInputSchema) });

  const jsxPathways = pathwayOptions?.map((item) => (
    <option key={ item.id } value={ item.id }>{item.name}</option>
  ));

  return (
    <Container>
      <Tabs>
        <TabList>
          <Tab>Create user</Tab>
          <Tab>Roles management</Tab>
        </TabList>
        <TabPanel>
          <Form
            onSubmit={ handleSubmit( () => {
              createUser(getValues());
            } ) }
          >
            {
              error?.message ? <ErrorMessage>{error?.message}</ErrorMessage> : ''
            }
            <Fieldset disabled={ loading }>
              <Row>
                <Col xs="12" md="6">
                  <Input role="textbox" id="username" label="First name" error={ errors.firstName?.message } { ...register('firstName', { required: true }) } />
                </Col>
                <Col xs="12" md="6">
                  <Input role="textbox" id="password" label="Last name" error={ errors.lastName?.message } { ...register('lastName', { required: true }) } />
                </Col>
              </Row>
            </Fieldset>
            <Fieldset disabled={ loading }>
              <Row>
                <Col xs="12" md="6">
                  <Input label="Username" autoCapitalize="off" autoCorrect="username" error={ errors.username?.message } { ...register('username', { required: true }) } />
                </Col>
                <Col xs="12" md="6">
                  <Input label="Password" autoCapitalize="off" autoCorrect="password" type="password" error={ errors.password?.message } { ...register('password', { required: true }) } />
                </Col>
              </Row>
            </Fieldset>
            <Fieldset disabled={ loading }>
              <Row>
                <Col xs="12" md="6">
                  <Input label="Department" error={ errors.department?.message } { ...register('department', { required: true }) } />
                </Col>
                <Col xs="12" md="6">
                  <Select className="w-100" label="Default pathway" { ...register('defaultPathwayId') }>
                    {jsxPathways}
                  </Select>
                </Col>
              </Row>
            </Fieldset>
            <Fieldset disabled={ loading }>
              <Row>
                <Col xs="12" md="6">
                  <Checkboxes>
                    {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                    <CheckboxBox { ...register('isActive') }>
                      Active
                    </CheckboxBox>
                  </Checkboxes>
                </Col>
              </Row>
            </Fieldset>
            <Fieldset disabled={ loading }>
              <Row>
                <Col sm="12">
                  <Button className="float-end">Create user</Button>
                </Col>
              </Row>
            </Fieldset>
          </Form>
          <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
            <Modal.Header>
              <Modal.Title>User created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>First name</SummaryList.Key>
                  <SummaryList.Value>{data?.user?.firstName}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Last name</SummaryList.Key>
                  <SummaryList.Value>{data?.user?.lastName}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Username</SummaryList.Key>
                  <SummaryList.Value>{data?.user?.username}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Password</SummaryList.Key>
                  <SummaryList.Value>Hidden</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Department</SummaryList.Key>
                  <SummaryList.Value>{data?.user?.department}</SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={ (() => setShowModal(false)) }>Close</Button>
            </Modal.Footer>
          </Modal>
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
};

export default AdministrationPage;
