export class CustomError extends Error {
  override readonly message: string;

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
