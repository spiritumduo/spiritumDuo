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

export type CreateUserReturnUser = {
  username: string;
  firstName: string;
  lastName: string;
  department: string;
  defaultPathwayId: number;
  isActive: boolean;
};

export type CreateUserReturnData = {
  error: string;
  user: CreateUserReturnUser;
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
  CreateUserReturnUser | undefined,
  (variables: NewUserInputs) => void
];

export function useCreateUserSubmit(setShowModal: (arg0: boolean) => void): CreateUserSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<CreateUserReturnUser | undefined>(undefined);

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
        setError(`${response.status} ${response.statusText}`);
        throw new Error(`Error: Response ${response.status} ${response.statusText}`);
      }
      const decoded: CreateUserReturnData = await response.json();
      if (decoded.error) {
        setError(decoded.error);
        setData(undefined);
      } else {
        setData(decoded.user);
        setError(decoded.error);
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
    username: yup.string().required('This is a required field'),
    password: yup.string().required('This is a required field'),
    firstName: yup.string().required('This is a required field'),
    lastName: yup.string().required('This is a required field'),
    department: yup.string().required('This is a required field'),
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
        </TabList>
        <TabPanel>
          <Form
            onSubmit={ handleSubmit( () => {
              createUser(getValues());
            } ) }
          >
            {
              error
                ? (
                  <ErrorMessage>
                    An error occured: {error.message ? error.message : error}
                  </ErrorMessage>
                )
                : <></>
            }
            <Fieldset disabled={ loading }>
              <Row>
                <Col xs="12" md="6">
                  <Input label="First name" error={ errors.firstName?.message } { ...register('firstName', { required: true }) } />
                </Col>
                <Col xs="12" md="6">
                  <Input label="Last name" error={ errors.lastName?.message } { ...register('lastName', { required: true }) } />
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
          <Modal show={ showModal } closeButton onHide={ (() => setShowModal(false)) }>
            <Modal.Header closeButton>
              <Modal.Title>User created</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <SummaryList>
                <SummaryList.Row>
                  <SummaryList.Key>First name</SummaryList.Key>
                  <SummaryList.Value>{data?.firstName}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Last name</SummaryList.Key>
                  <SummaryList.Value>{data?.lastName}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Username</SummaryList.Key>
                  <SummaryList.Value>{data?.username}</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Password</SummaryList.Key>
                  <SummaryList.Value>Hidden</SummaryList.Value>
                </SummaryList.Row>
                <SummaryList.Row>
                  <SummaryList.Key>Department</SummaryList.Key>
                  <SummaryList.Value>{data?.department}</SummaryList.Value>
                </SummaryList.Row>
              </SummaryList>
            </Modal.Body>
          </Modal>
        </TabPanel>
      </Tabs>
    </Container>
  );
};

export default AdministrationPage;
