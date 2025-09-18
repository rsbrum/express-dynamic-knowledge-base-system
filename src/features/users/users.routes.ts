import { Router } from 'express';
import { UsersController } from '@/features/users/users.controller';
import { UsersService } from '@/features/users/users.service';

export class UsersRoutes {
	private router: Router;
	private usersService!: UsersService;
	private usersController!: UsersController;

	constructor() {
		this.router = Router();
		this.initializeDependencies();
		this.registerRoutes();
	}

	private initializeDependencies(): void {
		this.usersService = new UsersService();
		this.usersController = new UsersController(this.usersService);
	}

	private registerRoutes(): void {
		this.router.get('/', (req, res) => this.usersController.getUsers(req, res));
	}

	public getRouter(): Router {
		return this.router;
	}
}
