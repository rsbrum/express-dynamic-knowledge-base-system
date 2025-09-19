import { z } from 'zod';
import { EUserRole } from '@/lib/EUserRole';

export const UserUpdatePayloadSchema = z.object({
  name: z.string().min(1, 'Name is required and cannot be empty').trim(),
  email: z.string().email('Invalid email address').trim(),
  role: z.enum(EUserRole, 'Role is not of correct type'),
});
