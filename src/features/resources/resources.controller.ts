import { ResourcesService } from '@/features/resources/resources.service';
import { Request, Response } from 'express';
import { DataResponse } from '@/lib/PayloadResponse';

export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  getResources(_req: Request, res: Response) {
    const resources = this.resourcesService.getResources();
    DataResponse.success(resources, 'Resources fetched successfully').send(res);
  }
}
