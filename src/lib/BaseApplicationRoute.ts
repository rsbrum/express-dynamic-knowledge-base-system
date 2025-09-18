import { Router } from "express";
import IApplicationRoute from "@/lib/IApplicationRoute";

export abstract class BaseApplicationRoute implements IApplicationRoute {
	protected router: Router;

	constructor() {
		this.router = Router();
		this.initializeDependencies();
		this.registerRoutes();
	}

	public getRouter(): Router {
		return this.router;
	}

	protected abstract initializeDependencies(): void;
	protected abstract registerRoutes(): void;
}
