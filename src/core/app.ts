import express, { Application } from 'express';
import registerRoutes from '@/core/registerRoutes';
import Logger from '@/core/logger';
import { AppDataSource } from '@/core/database/data-source';
import cors from 'cors';

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
    this.app.use(cors());
  }

  private initializeRoutes() {
    registerRoutes(this.app);
  }

  public async start(port: number) {
    try {
      await AppDataSource.initialize();
      this.logger.log('Database initialized');

      this.app.listen(port, () => {
        this.logger.log(`Server running on port: ${port}`);
      });
    } catch (error) {
      this.logger.error('Error initializing application', error as string);
    }
  }
}
