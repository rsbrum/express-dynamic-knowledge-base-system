import { BaseResponse } from "./BaseResponse";
import { Response } from "express";

export class DataResponse<T> extends BaseResponse {
	data!: T;
	constructor(message: string, data: T) {
		super();
		this.message = message;
		this.data = data;
	}

	static success<T>(data: T, message: string = 'Success'): DataResponse<T> {
		return new DataResponse(message, data);
	}

	static created<T>(data: T, message: string = 'Created successfully'): DataResponse<T> {
		return new DataResponse(message, data);
	}

	send(res: Response, statusCode: number = 200): void {
		res.status(statusCode).json(this);
	}
}
