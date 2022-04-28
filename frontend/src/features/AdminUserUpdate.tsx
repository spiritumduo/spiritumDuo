import React from 'react';

import { useQuery, gql } from '@apollo/client';
import { userAdminGetUserWithRoles } from 'features/__generated__/userAdminGetUserWithRoles';
import AdminUserForm, { GET_ROLES_FRAGMENT, GET_USER_FRAGMENT } from './AdminUser/AdminUserForm';

export const USER_ADMIN_GET_USER_WITH_ROLES_QUERY = gql`
  ${GET_USER_FRAGMENT}
  ${GET_ROLES_FRAGMENT}
  query userAdminGetUserWithRoles($id: ID!) {
    getUser(id: $id) {
      ...UserParts
    }
    getRoles {
      ...RoleParts
    }
  }
`;

export interface AdminUserUpdateProps {
  updateUserId: string;
}

const AdminUserUpdate = ({ updateUserId }: AdminUserUpdateProps): JSX.Element => {
  const { loading, error, data } = useQuery<userAdminGetUserWithRoles>(
    USER_ADMIN_GET_USER_WITH_ROLES_QUERY, {
      variables: {
        id: updateUserId,
      },
    },
  );
  return (
    <AdminUserForm
      editUser={ data?.getUser ? data.getUser : undefined }
      roles={ data?.getRoles }
    />
  );
};

export default AdminUserUpdate;
