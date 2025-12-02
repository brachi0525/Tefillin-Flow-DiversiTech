import { User, UserRole, UserStatus } from "../../features/user/userTypes";


export const defaultUser: User = {
  name: 'Guest',
  email: 'guest@gmail.com',
  phone: '0525555888',
  id: '',
  role: UserRole.SYSTEM_ADMIN,
  status: UserStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};
