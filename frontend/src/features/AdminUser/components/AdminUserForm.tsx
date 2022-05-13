import React, { useEffect, useState } from 'react';

// LIBRARIES
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, ErrorMessage, Fieldset, SummaryList, Form } from 'nhsuk-react-components';
import { Row, Col, Modal } from 'react-bootstrap';
import { Input, CheckboxBox } from 'components/nhs-style';
import { gql } from '@apollo/client';

// APP
import useRESTSubmit from 'app/hooks/rest-submit';
import User from 'types/Users';
import Role from 'types/Role';

import SdSelect from 'components/SdSelect/SdSelect';
import CheckboxOption from 'components/SdSelect/CheckboxOption';
import './adminuserform.css';
import PathwayOption from 'types/PathwayOption';

export type CreateUserReturnUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  isActive: boolean;
  roles: Role[];
  pathways: PathwayOption[];
};

export const GET_ROLES_FRAGMENT = gql`
  fragment RoleParts on Role {
    id
    name
  }
`;

export const GET_USER_FRAGMENT = gql`
  fragment UserParts on User {
    id
    username
    firstName
    lastName
    email
    department
    isActive
    defaultPathway{
      id
      name
    }
    roles {
      id
      name
    }
    pathways { 
      id
      name
    }
  }
`;

export const GET_PATHWAYS_FRAGMENT = gql`
  fragment PathwayParts on Pathway {
    id
    name
  }
`;

export type UserReturnData = {
  error?: string; // user error
  detail?: string; // api exception
  user?: CreateUserReturnUser;
};

export interface UserFormInput {
  id?: string;
  username?: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  isActive: boolean;
  roles: string[];
  pathways: string[];
}

interface AdminUserFormProps {
  roles?: Role[];
  editUser?: User;
  pathways?: PathwayOption[];
}

const AdminUserForm = ({ editUser, roles, pathways }: AdminUserFormProps) => {
  const url = editUser !== undefined
    ? '/api/rest/updateuser/'
    : '/api/rest/createuser/';

  const [showModal, setShowModal] = useState<boolean>(false);

  const [loading, error, data, createUser] = useRESTSubmit<UserReturnData, UserFormInput>(url);

  const initSchema = {
    email: yup.string().required('Email is a required field'),
    firstName: yup.string().required('First name is a required field').default(editUser?.firstName),
    lastName: yup.string().required('Last is a required field'),
    username: yup.string().required('Username is a required field'),
    department: yup.string().required('Department is a required field'),
    isActive: yup.boolean().required(),
    roles: yup.array().of(yup.string()),
    pathways: yup.array().of(yup.string()),
  };

  const schema = editUser
    ? {
      ...initSchema, // if we are editing a user
      id: yup.string().required('ID is a required field'),
      password: yup.string().optional(),
    }
    : {
      ...initSchema, // if we're creating a user
      password: yup.string().required('Password is a required field'),
    };

  const newUserInputSchema = yup.object(schema).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
  } = useForm<UserFormInput>({ resolver: yupResolver(newUserInputSchema) });

  // We do this here to silence warnings from React about controlled vs uncontrolled components.
  // Also default checkbox state is set on first render, so we'd have to do this anyway
  useEffect(
    () => reset({
      firstName: editUser?.firstName,
      lastName: editUser?.lastName,
      email: editUser?.email,
      username: editUser?.username,
      department: editUser?.department,
      isActive: editUser?.isActive,
    }),
    [editUser, reset],
  );

  useEffect(() => {
    if (data?.user) setShowModal(true);
  }, [data]);
  const currentRoles = new Set(editUser?.roles.map((r) => r.id));
  const currentPathways = new Set(editUser?.pathways.map((p) => p.id));
  return (
    <>
      <Form
        onSubmit={ handleSubmit( () => {
          const values = getValues();
          createUser(values);
        } ) }
      >
        {
          error ? <ErrorMessage>{error.message}</ErrorMessage> : ''
        }
        {
          editUser
            ? <input type="hidden" value={ editUser.id } { ...register('id') } />
            : false
        }
        <Fieldset disabled={ loading }>
          <Row xs="1" md="2" className="admin-user-flex">
            <Col>
              <Input
                role="textbox"
                label="First name"
                error={ errors.firstName?.message }
                { ...register('firstName') }
              />
            </Col>
            <Col>
              <Input
                role="textbox"
                label="Last name"
                error={ errors.lastName?.message }
                { ...register('lastName') }
              />
            </Col>
            <Col>
              <Input
                label="Username"
                autoCapitalize="off"
                autoCorrect="username"
                error={ errors.username?.message }
                { ...register('username') }
              />
            </Col>
            <Col>
              <Input
                label={ editUser ? 'Update Password' : 'Password' }
                autoCapitalize="off"
                autoCorrect="password"
                type="password"
                error={ errors.password?.message }
                { ...register('password') }
              />
            </Col>
            <Col>
              <Input
                label="Email"
                type="email"
                error={ errors.email?.message }
                { ...register('email') }
              />
            </Col>
            <Col>
              <Input
                label="Department"
                error={ errors.department?.message }
                { ...register('department') }
              />
            </Col>
          </Row>
          <Row xs="3" md="2" className="admin-user-flex">
            <SdSelect label="Roles" { ...register('roles') }>
              {roles?.map((r) => (
                <CheckboxOption
                  key={ r.id }
                  value={ r.id }
                  label={ r.name }
                  defaultChecked={ currentRoles.has(r.id) }
                />
              ))}
            </SdSelect>
          </Row>
          <Row xs="3" md="2" className="admin-user-flex">
            <SdSelect label="Pathways" { ...register('pathways') }>
              {pathways?.map((p) => (
                <CheckboxOption
                  key={ p.id }
                  value={ p.id }
                  label={ p.name }
                  defaultChecked={ currentPathways.has(p.id) }
                />
              ))}
            </SdSelect>
          </Row>
          <Row xs="1" md="2" className="admin-user-flex">
            <Col>
              <CheckboxBox { ...register('isActive') }>
                Active
              </CheckboxBox>
            </Col>
            <Col>
              <Button className="float-end">
                {
                  editUser
                    ? 'Update User'
                    : 'Create User'
                }
              </Button>
            </Col>
          </Row>
        </Fieldset>
      </Form>
      <Modal size="lg" show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>
            {
              editUser
                ? 'User updated'
                : 'User created'
            }
          </Modal.Title>
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
              <SummaryList.Key>Email</SummaryList.Key>
              <SummaryList.Value>{data?.user?.email}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Password</SummaryList.Key>
              <SummaryList.Value>Hidden</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Department</SummaryList.Key>
              <SummaryList.Value>{data?.user?.department}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Roles</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {data?.user?.roles?.map((r) => <li key={ `role-result-${r.id}` }>{r.name}</li>)}
                </ul>
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Pathways</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {data?.user?.pathways?.map((p) => <li key={ `role-result-${p.id}` }>{p.name}</li>)}
                </ul>
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ (() => setShowModal(false)) }>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminUserForm;
