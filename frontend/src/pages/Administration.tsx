import React, { useContext, useState } from 'react';

// LIBRARIES
import { Button, Checkboxes, Container, Form, Select } from 'nhsuk-react-components';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { Row, Col } from 'react-bootstrap';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';

// APP
import User from 'types/Users';
import { Input } from 'components/nhs-style';
import { yupResolver } from '@hookform/resolvers/yup';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AdministrationPageProps {
  user?: User
}

export type CreateUserReturnData = {
  firstName?: string;
};

export interface NewUserInputs {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
  isActive: boolean;
  isAdmin: boolean;
  pathwayId: boolean;
}

export function useCreateUserSubmit() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<CreateUserReturnData | undefined>(undefined);

  async function createUser(variables: NewUserInputs) {
    setLoading(true);
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
        throw new Error(`Error: Response ${response.status} ${response.statusText}`);
      }
      const decoded: CreateUserReturnData = await response.json();
      setData(decoded);
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }
  return [loading, error, data, createUser];
}

// eslint-disable-next-line arrow-body-style
const AdministrationPage = ({ user }: AdministrationPageProps): JSX.Element => {
  const [loading, error, data, createUser] = useCreateUserSubmit();

  const newUserInputSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    department: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<NewUserInputs>({ resolver: yupResolver(newUserInputSchema)});
  return (
    <Container>
      <Tabs>
        <TabList>
          <Tab>Create user</Tab>
        </TabList>
        <TabPanel>
          <Form onSubmit={ handleSubmit( () => {
            createUser(getValues());
          } ) }
          >
            <Row>
              <Col xs="12" md="6">
                <Input label="First name" error={ errors.firstName?.message } { ...register('firstName', { required: true }) } />
              </Col>
              <Col xs="12" md="6">
                <Input label="Last name" error={ errors.lastName?.message } { ...register('lastName', { required: true }) } />
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6">
                <Input label="Username" autoCapitalize="off" autoCorrect="username" error={ errors.username?.message } { ...register('username', { required: true }) } />
              </Col>
              <Col xs="12" md="6">
                <Input label="Password" autoCapitalize="off" autoCorrect="password" type="password" error={ errors.password?.message } { ...register('password', { required: true }) } />
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6">
                <Input label="Department" error={ errors.department?.message } { ...register('department', { required: true }) } />
              </Col>
              <Col xs="12" md="6">
                <Select className="w-100" label="Default pathway">
                  <Select.Option>Test</Select.Option>
                </Select>
              </Col>
            </Row>
            <Row>
              <Col xs="12" md="6">
                <Checkboxes>
                  <Checkboxes.Box>Active</Checkboxes.Box>
                </Checkboxes>
              </Col>
              <Col xs="12" md="6">
                <Checkboxes>
                  <Checkboxes.Box>Administrator</Checkboxes.Box>
                </Checkboxes>
              </Col>
            </Row>
            <Row>
              <Col sm="12">
                <Button className="float-end">Create user</Button>
              </Col>
            </Row>
          </Form>
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default AdministrationPage;
