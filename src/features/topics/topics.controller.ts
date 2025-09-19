import { TopicsService } from '@/features/topics/topics.service';
import { Request, Response } from 'express';
import { z } from 'zod';
import { TopicPayloadSchema } from '@/lib/TopicPayloadSchema';
import Logger from '@/core/logger';
import { ErrorResponse } from '@/lib/ErrorResponse';
import { DataResponse } from '@/lib/PayloadResponse';
import { Topic } from '@/features/topics/topic.entity';

export class TopicsController {
  private logger = new Logger(TopicsController.name);
  constructor(private topicsService: TopicsService) {}

  async createTopic(req: Request, res: Response) {
    try {
      const topicPayload = TopicPayloadSchema.parse(req.body);

      const result = await this.topicsService.createTopic(topicPayload);

      this.logger.log(`Topic created: ${result.id} ${result.name}`);

      DataResponse.created(result, 'Topic created').send(res, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
      } else {
        ErrorResponse.internal(
          'Failed to create topic',
          error instanceof Error ? error.message : 'Unknown error',
        ).send(res, 500);
      }
    }
  }

  async getTopics(_req: Request, res: Response) {
    try {
      const topics = await this.topicsService.getTopics();

      DataResponse.success(topics, 'Topics fetched').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to get topics',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to get topics',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res, 500);
    }
  }

  async updateTopic(req: Request, res: Response) {
    try {
      const topicPayload = TopicPayloadSchema.parse(req.body);
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Topic ID is required').send(res, 400);
        return;
      }

      const topic = await this.topicsService.updateTopic(+id, topicPayload);

      DataResponse.success(topic, 'Topic updated successfully').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to update topic',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to update topic',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res, 500);
    }
  }

  async getTopic(req: Request, res: Response) {
    try {
      const id = req.params['id'];

      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Topic ID is required').send(res, 400);
        return;
      }

      const topic = await this.topicsService.getTopic(+id);

      if (!topic) {
        ErrorResponse.notFound('Topic not found').send(res, 404);
        return;
      }

      DataResponse.success(topic, 'Topic fetched successfully').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to get topic',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to get topic',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res, 500);
    }
  }

  async deleteTopic(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Topic ID is required').send(res, 400);
        return;
      }
      await this.topicsService.deleteTopic(+id);
      DataResponse.success(null, 'Topic deleted successfully').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to delete topic',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to delete topic',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res, 500);
    }
  }
}
