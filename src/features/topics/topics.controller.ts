import { TopicsService } from '@/features/topics/topics.service';
import { Request, Response } from 'express';

export class TopicsController {
  constructor(private topicsService: TopicsService) {}

  getTopics(_req: Request, res: Response) {
    res.json({ message: this.topicsService.getTopics() });
  }
}
