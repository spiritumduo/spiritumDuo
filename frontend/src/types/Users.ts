import Role from "./Role";
export default interface User {
    id: number;
    firstName: string;
    lastName: string;
    department: string;
    lastAccess?: Date;
    roles: Role[];
}