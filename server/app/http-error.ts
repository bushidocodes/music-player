// A typed Error that carries an HTTP status code. Thrown by the route handlers
// and read by the error-handling middleware in app/index.ts.
export class HttpError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
  }
}
