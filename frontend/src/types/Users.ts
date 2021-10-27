import Role from './Role';

interface User {
    id: number;
    firstName: string;
    lastName: string;
    department: string;
    lastAccess?: Date;
    roles: Role[];
}

export default User;
