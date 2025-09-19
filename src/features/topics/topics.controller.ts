import { TopicsService } from '@/features/topics/topics.service';
import { Request, Response } from 'express';
import { z } from 'zod';
import { TopicCreatePayloadSchema } from '@/lib/TopicCreatePayloadSchema';
import { TopicUpdatePayloadSchema } from '@/lib/TopicUpdatePayloadSchema';
import Logger from '@/core/logger';
import { ErrorResponse } from '@/lib/ErrorResponse';
import { DataResponse } from '@/lib/PayloadResponse';

export class TopicsController {
  private logger = new Logger(TopicsController.name);
  constructor(private topicsService: TopicsService) {}

  async createTopic(req: Request, res: Response) {
    try {
      const topicPayload = TopicCreatePayloadSchema.parse(req.body);

      const result = await this.topicsService.createTopic(topicPayload);

      this.logger.log(`Topic created: ${result.id} ${result.name}`);

      DataResponse.created(result, 'Topic created').send(res, 201);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
        this.logger.error(
          'Failed to create topic',
          error instanceof Error ? error.message : 'Unknown error',
        );
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

      this.logger.log(`Topics fetched: ${topics.length}`);
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
      const topicPayload = TopicUpdatePayloadSchema.parse(req.body);
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Topic ID is required').send(res, 400);
        return;
      }

      const topic = await this.topicsService.updateTopic(+id, topicPayload);

      this.logger.log(`Topic updated: ${topic.id} ${topic.name}`);

      DataResponse.success(topic, 'Topic updated successfully').send(res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
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

      this.logger.log(`Topic fetched: ${topic.id}`);

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

  async getTopicByVersion(req: Request, res: Response) {
    try {
      const topicId = req.params['id'];
      const version = req.params['version'];

      if (!topicId || !version) {
        ErrorResponse.badRequest('Invalid request', 'Topic ID and version are required').send(
          res,
          400,
        );
        return;
      }

      const topic = await this.topicsService.getTopicByVersion(+topicId, +version);

      if (!topic) {
        ErrorResponse.notFound('Topic not found').send(res, 404);
        return;
      }

      this.logger.log(`Topic fetched: ${topic?.id}`);

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

      const result = await this.topicsService.deleteTopic(+id);
      if (!result) {
        ErrorResponse.notFound('Topic not found').send(res, 404);
        return;
      }

      this.logger.log(`Topic deleted: ${id}`);
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
