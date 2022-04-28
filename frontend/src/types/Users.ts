import Role from './Role';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    defaultPathwayId: string;
    username?: string;
    email?: string;
    lastAccess?: Date;
    roles: Role[];
    token?: string;
    isActive?: boolean;
}

export default User;
