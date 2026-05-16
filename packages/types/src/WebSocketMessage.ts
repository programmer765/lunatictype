import { ErrorCodes, SuccessCodes, Codes, ErrorCodesType, SuccessCodesType, SocketMsgCodes } from "./Codes";
import { MatchFoundPayload, PositionUpdatePayload, WordListPayload } from "./Payloads";

// This file defines the structure of messages sent over WebSocket connections in the application. It includes both error and success message formats, utilizing the predefined codes from the Codes module.


type SuccessMessage = {
  code: typeof SuccessCodes.MATCH_FOUND;
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


type MatchMessage = {
  code: typeof SocketMsgCodes.POSITION_UPDATE | typeof SocketMsgCodes.OPPONENT_POSITION_UPDATE,
  isError: false,
  payload: PositionUpdatePayload
} | {
  code: typeof SocketMsgCodes.CLIENT_READY | typeof SocketMsgCodes.MATCH_END | typeof SocketMsgCodes.MATCH_START,
  isError: false
} | {
  code: typeof SocketMsgCodes.WORD_LIST,
  isError: false,
  payload: WordListPayload
}


type WebSocketMessage = ErrorMessage | SuccessMessage;
type MatchSocketMessage = ErrorMessage | MatchMessage


export type { WebSocketMessage, MatchSocketMessage };