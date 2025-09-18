import { Router } from "express";
import IApplicationRoute from "@/lib/IApplicationRoute";

export abstract class BaseApplicationRoute implements IApplicationRoute {
  protected router: Router;
  private initialized: boolean = false;

  constructor() {
    this.router = Router();
  }

  private initialize(): void {
    if (!this.initialized) {
      this.initializeDependencies();
      this.registerRoutes();
      this.initialized = true;
    }
  }

  public getRouter(): Router {
    this.initialize();
    return this.router;
  }

  protected abstract initializeDependencies(): void;
  protected abstract registerRoutes(): void;
}
