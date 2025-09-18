import express, { Application } from 'express';
import registerRoutes from '@/core/registerRoutes';
import Logger from '@/core/Logger';

export class App {
  public app: Application;
  private logger: Logger;

  constructor() {
    this.app = express();
    this.logger = new Logger(App.name);
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
      this.logger.log(`Server running on port: ${port}`);
    });
  }
}
