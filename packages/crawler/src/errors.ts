export class NoOpenApiServiceKeyProvidedError extends Error {
  constructor() {
    super("No open API service key provided");
  }
}

export class MalformedApiResponseError extends Error {
  constructor(response: string) {
    super(`Expected JSON but got non-JSON response: ${response}`);
  }
}

export class UnsuccessfulApiResponseError extends Error {
  constructor(status: number, body: string) {
    super(`Expected success but got abnormal response (${status}): ${body}`);
  }
}

export class DatabaseInsertError extends Error {
  constructor(error: Error) {
    super(`Error inserting data into DB: ${error}`);
  }
}
