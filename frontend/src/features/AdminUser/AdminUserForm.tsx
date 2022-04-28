import React, { useContext, useEffect, useReducer, useState } from 'react';

// LIBRARIES

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons';

import { Button, ErrorMessage, Fieldset, SummaryList, Form } from 'nhsuk-react-components';
import { Row, Col, Modal } from 'react-bootstrap';
import { Input, Select, CheckboxBox } from 'components/nhs-style';
import { gql } from '@apollo/client';

// APP
import { PathwayContext } from 'app/context';
import useRESTSubmit from 'app/hooks/rest-submit';
import User from 'types/Users';
import Role from 'types/Role';

import './adminuserform.css';

export type CreateUserReturnUser = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  defaultPathwayId: number;
  isActive: boolean;
  roles: Role[];
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
    defaultPathwayId
    isActive
    roles {
      id
      name
    }
  }
`;

export type UserReturnData = {
  error?: string; // user error
  detail?: string; // api exception
  user?: CreateUserReturnUser;
};

interface UserRestFields {
  roles: string[];
}

interface UserFormFields {
  availableRoles: string[];
  selectedRoles: string[];
}

interface UserInputFields {
  id?: string;
  username?: string;
  password?: string;
  email: string;
  firstName: string;
  lastName: string;
  department: string;
  isActive: boolean;
  defaultPathwayId: string;
}

export type UserFormInput = UserInputFields & UserFormFields;
export type UserRestInput = UserRestFields & UserFormFields;

interface AdminUserFormProps {
  roles?: Role[];
  editUser?: User;
}

const AdminUserForm = ({ editUser, roles }: AdminUserFormProps) => {
  const url = editUser !== undefined
    ? '/api/rest/updateuser/'
    : '/api/rest/createuser/';
  const { pathwayOptions } = useContext(PathwayContext);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Add / remove user role state
  // We are using a set of Role['id'] (i.e. string) because JS doesn't properly support deep object
  // equality in sets.
  const roleReducer = (state: Set<Role['id']>, action: {
    add?: Role['id'];
    delete?: Role['id'];
  }): Set<Role['id']> => {
    const newState: Set<Role['id']> = new Set(Array.from(state));
    if (action.delete) newState.delete(action.delete);
    if (action.add) newState.add(action.add);
    return newState;
  };
  const [selectedRoleIds, dispatchSelectedRoleIds] = useReducer<typeof roleReducer>(
    roleReducer,
    new Set<Role['id']>(),
  );

  const [loading, error, data, createUser] = useRESTSubmit<UserReturnData, UserRestInput>(url);

  const initSchema = {
    email: yup.string().required('Email is a required field'),
    firstName: yup.string().required('First name is a required field').default(editUser?.firstName),
    lastName: yup.string().required('Last is a required field'),
    department: yup.string().required('Department is a required field'),
    isActive: yup.boolean().required(),
    roles: yup.array().of(yup.string()),
  };

  const schema = editUser
    ? {
      ...initSchema, // if we are editing a user
      id: yup.string().required('ID is a required field'),
      password: yup.string().optional(),
    }
    : {
      ...initSchema, // if we're creating a user
      username: yup.string().required('Username is a required field'),
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
      department: editUser?.department,
      defaultPathwayId: editUser?.defaultPathwayId,
      isActive: editUser?.isActive,
    }),
    [editUser, reset],
  );

  useEffect(() => {
    if (data?.user) setShowModal(true);
  }, [data]);

  useEffect(() => {
    if (editUser?.roles) {
      editUser.roles.forEach((r) => dispatchSelectedRoleIds({ add: r.id }));
    }
  }, [editUser]);

  // Because we are overriding the behaviour of the select / option list to move roles back and
  // forth, we have to get the values from selectedRoleIds

  const removeRoleOnClick = () => {
    const ids = getValues().selectedRoles;
    ids.forEach((i) => dispatchSelectedRoleIds({ delete: i }));
  };
  const addRoleOnClick = () => {
    const ids = getValues().availableRoles;
    ids.forEach((i) => dispatchSelectedRoleIds({ add: i }));
  };

  return (
    <>
      <Form
        onSubmit={ handleSubmit( () => {
          const values = getValues();
          const newValues = { ...values, roles: Array.from(selectedRoleIds) };
          createUser(newValues);
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
            {
              editUser
                ? false
                : (
                  <Col>
                    <Input
                      label="Username"
                      autoCapitalize="off"
                      autoCorrect="username"
                      error={ errors.username?.message }
                      { ...register('username') }
                    />
                  </Col>
                )
            }
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
                error={ errors.department?.message }
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
            <Col>
              <Select className="w-100" label="Default pathway" { ...register('defaultPathwayId') } defaultValue={ editUser?.defaultPathwayId }>
                {
                  pathwayOptions?.map((item) => (
                    <option
                      key={ `pathway-option-${item.id}` }
                      value={ item.id }
                    >
                      {item.name}
                    </option>
                  ))
                }
              </Select>
            </Col>
          </Row>
          <Row xs="3" className="admin-user-flex">
            <Col>
              <Select
                size="40"
                multiple
                className="user-roles-select"
                label="Available Roles"
                { ...register('availableRoles') }
              >
                {
                  roles?.filter((r) => !selectedRoleIds.has(r.id)).map((r) => (
                    <option
                      key={ `role-option-${r.id}` }
                      value={ r.id }
                    >
                      {r.name}
                    </option>
                  ))
                }
              </Select>
            </Col>
            <Col>
              <Row className="user-role-arrow">
                <button
                  type="button"
                  onClick={ removeRoleOnClick }
                >
                  <ArrowLeft size={ 50 } />
                  <span className="nhsuk-u-visually-hidden">Remove Roles</span>
                </button>
              </Row>
              <Row className="user-role-arrow">
                <button
                  type="button"
                  onClick={ addRoleOnClick }
                >
                  <ArrowRight size={ 50 } />
                  <span className="nhsuk-u-visually-hidden">Add Roles</span>
                </button>
              </Row>
            </Col>
            <Col>
              <Select
                size="40"
                multiple
                className="user-roles-select"
                label="Selected Roles"
                { ...register('selectedRoles') }
              >
                {
                  roles?.filter((r) => selectedRoleIds.has(r.id)).map((r) => (
                    <option
                      key={ `selected-role-option-${r.id}` }
                      value={ r.id }
                    >
                      {r.name}
                    </option>
                  ))
                }
              </Select>
            </Col>
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
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
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
                  {data?.user?.roles.map((r) => <li key={ `role-result-${r.id}` }>{r.name}</li>)}
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
