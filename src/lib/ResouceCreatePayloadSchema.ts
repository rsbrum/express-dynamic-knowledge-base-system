import { z } from 'zod';

export const ResourceCreatePayloadSchema = z.object({
  url: z.string().min(1, 'URL is required and cannot be empty').trim(),
  description: z.string().min(1, 'Description is required and cannot be empty').trim(),
  type: z.string().min(1, 'Type is required and cannot be empty').trim(),
  topicId: z.number().int().positive('TopicId must be a positive integer'),
});
