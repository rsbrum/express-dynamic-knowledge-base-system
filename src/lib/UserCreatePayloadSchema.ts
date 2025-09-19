import { z } from 'zod';

export const UserCreatePayloadSchema = z.object({
  name: z.string().min(1, 'Name is required and cannot be empty').trim(),
  email: z.string().email('Invalid email address').trim(),
  role: z.string().min(1, 'Role is required and cannot be empty').trim(),
});
