export class CustomError extends Error {
  readonly message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
