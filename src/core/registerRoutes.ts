import { Application } from "express";
import { UsersRoutes } from "@/features/users/users.routes";

export default function registerRoutes(app: Application) {
	const usersRoutes = new UsersRoutes();

	app.use('/users', usersRoutes.getRouter());

	app.use('/', (_req, res) => {
		res.json({ message: 'Hello World' });
	});

}
