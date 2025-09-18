import { Application } from "express";
import { UsersRoutes } from "@/features/users/users.routes";
import { ResourcesRoutes } from '@/features/resources/resources.routes';
import { TopicsRoutes } from '@/features/topics/topics.routes';

export default function registerRoutes(app: Application) {
  const usersRoutes = new UsersRoutes();
  const resourcesRoutes = new ResourcesRoutes();
  const topicsRoutes = new TopicsRoutes();

  app.use('/users', usersRoutes.getRouter());
  app.use('/resources', resourcesRoutes.getRouter());
  app.use('/topics', topicsRoutes.getRouter());

  app.use('/', (_req, res) => {
    res.json({ message: 'Hello World' });
  });
}
