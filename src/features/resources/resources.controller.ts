import { ResourcesService } from '@/features/resources/resources.service';
import { Request, Response } from 'express';

export class ResourcesController {
  constructor(private resourcesService: ResourcesService) {}

  getResources(_req: Request, res: Response) {
    res.json({ message: this.resourcesService.getResources() });
  }
}
