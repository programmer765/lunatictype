import { ErrorCodes } from "./ErrorCodes";

export type WebSocketMessageCodeType = typeof ErrorCodes[keyof typeof ErrorCodes];

interface WebSocketMessage {
  code: WebSocketMessageCodeType,
  message: string,
  isError?: boolean
}


export type { WebSocketMessage };