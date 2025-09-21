import { ResourcesService } from '@/features/resources/resources.service';
import { Request, Response } from 'express';
import { DataResponse } from '@/lib/PayloadResponse';
import { ErrorResponse } from '@/lib/ErrorResponse';
import { ResourceCreatePayloadSchema } from '@/lib/ResouceCreatePayloadSchema';
import Logger from '@/core/logger';
import { z } from 'zod';
import { ResourceUpdatePayloadSchema } from '@/lib/ResourceUpdatePayloadSchema';

export class ResourcesController {
  private logger = new Logger(ResourcesController.name);

  constructor(private resourcesService: ResourcesService) {}

  async createResource(req: Request, res: Response) {
    try {
      const resourcePayload = ResourceCreatePayloadSchema.parse(req.body);

      const result = await this.resourcesService.createResource(resourcePayload);

      this.logger.log(`Resource created: ${result.id} ${result.url}`);

      DataResponse.success(result, 'Resource created successfully').send(res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
        if (error instanceof z.ZodError) {
          ErrorResponse.validation().send(res, 400);
          this.logger.error('Validation error', error.message);
        } else {
          this.logger.error(
            'Failed to create resource',
            error instanceof Error ? error.message : 'Unknown error',
          );
          ErrorResponse.internal(
            'Failed to create resource',
            error instanceof Error ? error.message : 'Unknown error',
          ).send(res, 500);
        }
      }
    }
  }

  async updateResource(req: Request, res: Response) {
    try {
      const resourcePayload = ResourceUpdatePayloadSchema.parse(req.body);
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Resource ID is required').send(res, 400);
        return;
      }
      const resource = await this.resourcesService.updateResource(+id, resourcePayload);

      if (!resource) {
        ErrorResponse.notFound('Resource not found').send(res, 404);
        return;
      }

      this.logger.log(`Resource updated: ${resource.id} ${resource.url}`);
      DataResponse.success(resource, 'Resource updated successfully').send(res);
    } catch (error) {
      if (error instanceof z.ZodError) {
        ErrorResponse.validation().send(res, 400);
        this.logger.error('Validation error', error.message);
      } else {
        this.logger.error(
          'Failed to update resource',
          error instanceof Error ? error.message : 'Unknown error',
        );
        ErrorResponse.internal(
          'Failed to update resource',
          error instanceof Error ? error.message : 'Unknown error',
        ).send(res);
      }
    }
  }

  deleteResource(req: Request, res: Response) {
    try {
      const id = req.params['id'];
      if (!id) {
        ErrorResponse.badRequest('Invalid request', 'Resource ID is required').send(res, 400);
        return;
      }
      const resource = this.resourcesService.deleteResource(+id);
      this.logger.log(`Resource deleted: ${id}`);
      DataResponse.success(resource, 'Resource deleted successfully').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to delete resource',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to delete resource',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res);
    }
  }

  async getResources(_req: Request, res: Response) {
    try {
      const resources = await this.resourcesService.getResources();
      this.logger.log(`Resources fetched: ${resources.length}`);
      DataResponse.success(resources, 'Resources fetched successfully').send(res);
    } catch (error) {
      this.logger.error(
        'Failed to get resources',
        error instanceof Error ? error.message : 'Unknown error',
      );
      ErrorResponse.internal(
        'Failed to get resources',
        error instanceof Error ? error.message : 'Unknown error',
      ).send(res);
    }
  }
}
