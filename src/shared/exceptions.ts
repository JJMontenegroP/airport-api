export class BusinessLogicException extends Error {
  constructor(
    public message: string,
    public type: BusinessError,
  ) {
    super(message);
  }
}

export const enum BusinessError {
  BAD_REQUEST = "BAD_REQUEST",
  NOT_FOUND = "NOT_FOUND",
  PRECONDITION_FAILED = "PRECONDITION_FAILED",
}
