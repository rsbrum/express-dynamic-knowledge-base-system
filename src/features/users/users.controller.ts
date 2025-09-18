import { UsersService } from "./users.service";
import { Request, Response } from "express";

export class UsersController {
	constructor(private usersService: UsersService) {}

	async getUsers(_req: Request, res: Response) {

		res.json({ message: this.usersService.getUsers() });
	//	const users = await this.usersService.getUsers();
	//	res.json(users);
	}


}
