import { TopicsService } from '@/features/topics/topics.service';
import { TopicTreeResponseDto } from '@/features/topics/topic.dto';
import { Request, Response } from 'express';
import { z } from 'zod';
import { TopicPayloadSchema } from '@/lib/TopicPayloadSchema';

export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  async createTopic(req: Request, res: Response) {
    try {
      const topicPayload = TopicPayloadSchema.parse(req.body);

      const result = await this.topicsService.createTopic(topicPayload);
      res.status(201).json({ message: result });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.issues.map((issue: z.ZodIssue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        });
      } else {
        res.status(500).json({
          error: 'Internal server error',
          message: 'Failed to create topic',
        });
      }
    }
  }

  async getTopics(_req: Request, res: Response) {
    try {
      const topics = await this.topicsService.getTopics();

      const response: TopicTreeResponseDto = {
        message: topics,
      };

      res.json(response);
    } catch (error) {
      res.status(500).json({
        error: 'Internal server error',
        message: 'Failed to get topics',
      });
    }
  }
}
