export class HttpsException extends Error {
  message: string;
  errorCode: ErrorCode;
  statusCode: number;
  errors: any;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXIST = 1002,
  INCORRECT_PASSWORD = 1003,
  INTERNAL_ERROR = 5004,
  UNAUTHORIZED = 4001,
  BAD_REQUEST = 4002,
  NOT_FOUND = 1004
}

/*
200 OK: The request was successful.
201 Created: The request was successful and a resource was created.
400 Bad Request: The request could not be understood or was missing required parameters.
401 Unauthorized: Authentication failed or user does not have permissions for the desired action.
403 Forbidden: Authentication succeeded but authenticated user does not have access to the resource.
404 Not Found: The requested resource could not be found.
500 Internal Server Error: An error occurred on the server.
*/
