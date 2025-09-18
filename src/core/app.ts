import express, { Application } from 'express';
import registerRoutes from '@/core/registerRoutes';

export class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares() {
    this.app.use(express.json());
  }

  private initializeRoutes() {
    registerRoutes(this.app);
  }

  public listen(port: number) {
    this.app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
    });
  }
}
