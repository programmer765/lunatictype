import { ErrorCodes, SuccessCodes, Codes, ErrorCodesType, SuccessCodesType } from "./Codes";
import { MatchFoundPayload } from "./SuccesCodesPayloads";

// This file defines the structure of messages sent over WebSocket connections in the application. It includes both error and success message formats, utilizing the predefined codes from the Codes module.


type SuccessMessage = {
  code: typeof Codes.MATCH_FOUND;
  isError: false;
  payload: MatchFoundPayload;
} | {
  code: typeof SuccessCodes.SUCCESS;
  isError: false;
  payload: Record<string, unknown>;
} | {
  code: typeof SuccessCodes.MATCHMAKING_NOT_FOUND;
  isError: false;
}


type ErrorMessage = {
  code: ErrorCodesType;
  isError: true;
  message: string;
}


type WebSocketMessage = ErrorMessage | SuccessMessage;


export type { WebSocketMessage };