class BaseError extends Error {
  name: string;

  statusCode: number;

  description: string;

  isOperational: boolean;

  constructor(
    name: string,
    statusCode: number,
    description: string,
    isOperational: boolean
  ) {
    super(description);
    // Object.prototype(this, new.target.prototype);
    this.statusCode = statusCode;
    this.name = name;
    this.description = description;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}

export default BaseError;
