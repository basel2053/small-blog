import BaseError from './Error';

class APIError extends BaseError {
	constructor(
		name: string,
		statusCode: number,
		description: string,
		isOperational: boolean
	) {
		super(name, statusCode, description, isOperational);
	}
}

export default APIError;
