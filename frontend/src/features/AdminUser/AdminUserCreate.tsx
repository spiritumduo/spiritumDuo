import React from 'react';
import { gql, useQuery } from '@apollo/client';
import AdminUserForm, { GET_ROLES_FRAGMENT, GET_PATHWAYS_FRAGMENT } from './components/AdminUserForm';
import { userAdminGetRolesWithPathways } from './__generated__/userAdminGetRolesWithPathways';

export const USER_ADMIN_GET_ROLES_WITH_PATHWAYS_QUERY = gql`
  ${GET_ROLES_FRAGMENT}
  ${GET_PATHWAYS_FRAGMENT}
  query userAdminGetRolesWithPathways {
    getRoles {
      ...RoleParts
    }
    getPathways{
      ...PathwayParts
    }
  }
`;

export const AdminUserCreate = (): JSX.Element => {
  const { data } = useQuery<userAdminGetRolesWithPathways>(
    USER_ADMIN_GET_ROLES_WITH_PATHWAYS_QUERY,
  );
  return <AdminUserForm roles={ data?.getRoles } pathways={ data?.getPathways } />;
};
