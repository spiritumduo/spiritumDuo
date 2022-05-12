import Role from './Role';
import PathwayOption from './PathwayOption';

interface User {
    id: string;
    firstName: string;
    lastName: string;
    department: string;
    defaultPathway?: PathwayOption;
    username?: string;
    email?: string;
    lastAccess?: Date;
    roles: Role[];
    token?: string;
    isActive?: boolean;
    pathways: PathwayOption[];
}

export default User;
