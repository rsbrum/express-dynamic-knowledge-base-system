import { BaseResponse } from "@/lib/BaseResponse";
import { Response } from "express";

export class ErrorResponse extends BaseResponse {
	constructor(message: string, error: string) {
		super();
		this.message = message;
		this.error = error;
	}
	error!: string;

	static badRequest(message: string, error: string = 'Bad Request'): ErrorResponse {
		return new ErrorResponse(message, error);
	}

	static notFound(message: string = 'Resource not found', error: string = 'Not Found'): ErrorResponse {
		return new ErrorResponse(message, error);
	}

	static internal(message: string = 'Internal server error', error: string = 'Internal Server Error'): ErrorResponse {
		return new ErrorResponse(message, error);
	}

	static validation(message: string = 'Validation failed', error: string = 'One or more fields are invalid'): ErrorResponse {
		return new ErrorResponse(message, error);
	}

	send(res: Response, statusCode: number = 500): void {
		res.status(statusCode).json(this);
	}
}
