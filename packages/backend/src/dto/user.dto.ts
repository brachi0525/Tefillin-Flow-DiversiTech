import { UserRole,UserStatus } from '../../../../types/users';
export interface UserDto {
    email: string;
    name?: string;
    phone?: string;
    profileImageUrl?: string;
    role: UserRole;
    status: UserStatus;
    locationId?: string;
    lastLogin?: Date;  
}

