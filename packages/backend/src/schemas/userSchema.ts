import { z } from 'zod';
import { UserRole , UserStatus} from '../../../../types/users';

export const userSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name is too short").optional(),
  phone: z.string().regex(/^\+?[0-9]\d{1,14}$/, "Invalid phone number format"),
  role: z.nativeEnum(UserRole),
  status: z.nativeEnum(UserStatus),
  profileImageUrl: z.string().url().optional(),
  created_at: z.string().optional(),
  lastLogin: z.string().optional(),
});
