import { z } from 'zod';

export const TopicUpdatePayloadSchema = z.object({
  name: z.string().min(1, 'Name is required and cannot be empty').trim(),
  content: z.string().min(1, 'Content is required and cannot be empty').trim(),
  parentTopicId: z.number().int().positive('ParentTopicId must be a positive integer').nullable(),
  id: z.number().int().positive('ID must be a positive integer'),
	version: z.number().int().positive('Version must be a positive integer'),
	topicId: z.number().int().positive('TopicId must be a positive integer'),
});
