import { z } from 'zod';

export const TopicPayloadSchema = z.object({
  name: z.string().min(1, 'Name is required and cannot be empty').trim(),
  content: z.string().min(1, 'Content is required and cannot be empty').trim(),
  parentTopicId: z.number().int().positive('ParentTopicId must be a positive integer').nullable(),
});
