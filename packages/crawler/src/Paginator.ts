const DEFAULT_PAGE = 1;
const DEFAULT_SIZE = 100;

export class Paginator {
  readonly page: number;
  readonly size: number;

  constructor(source?: Partial<Paginator>) {
    this.page = source?.page ?? DEFAULT_PAGE;
    this.size = source?.size ?? DEFAULT_SIZE;
  }

  next(): Paginator {
    return new Paginator({
      ...this,
      page: this.page + 1,
    });
  }
}
