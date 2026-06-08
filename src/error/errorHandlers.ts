export class AppError extends Error {
  constructor(public message: string, public code: string = 'BAD_REQUEST') {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'UNAUTHENTICATED');
  }
}