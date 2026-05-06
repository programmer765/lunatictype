import { ErrorCodes } from "./ErrorCodes";

export type ErrorCodesType = typeof ErrorCodes[keyof typeof ErrorCodes];

interface WebSocketError {
  isError: boolean,
  message: string,
  code: ErrorCodesType,
  home: boolean,
  refresh: boolean
}


export type { WebSocketError };