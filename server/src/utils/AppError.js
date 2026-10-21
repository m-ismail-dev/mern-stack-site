class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = 'AppError';
    this.status = status;

    Error.captureStackTrace?.(this, this.constructor);
  }
}

export default AppError;
