import { ErrorCodes, SuccessCodes, ErrorCodesType, SuccessCodesType } from "./Codes";


type WebSocketMessage = {
  code: ErrorCodesType,
  message: string,
  isError: true,
} | {
  code: SuccessCodesType,
  payload: Record<string, unknown>,
  isError: false,
}


export type { WebSocketMessage };