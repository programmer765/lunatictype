const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  AUTH_TIMEOUT: "AUTH_TIMEOUT",
  MATCHMAKING_COOLDOWN: "MATCHMAKING_COOLDOWN",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  IN_MATCHMAKING: "IN_MATCHMAKING",
  INVALID_MESSAGE: "INVALID_MESSAGE",
  SERVER_ERROR: "SERVER_ERROR",
  INVALID_MATCH_ID: "INVALID_MATCH_ID",
} as const

const SuccessCodes = {
  SUCCESS: "SUCCESS",
  MATCH_FOUND: "MATCH_FOUND",
  MATCHMAKING_NOT_FOUND: "MATCHMAKING_NOT_FOUND",
} as const


const SocketMsgCodes = {
  CLIENT_READY: "CLIENT_READY",
  WORD_LIST: "WORD_LIST",
  MATCH_START: "MATCH_START",
  MATCH_END: "MATCH_END",
  OPPONENT_POSITION_UPDATE: "OPPONENT_POSITION_UPDATE",
  POSITION_UPDATE: "POSITION_UPDATE",
} as const

const Codes = {
  ...ErrorCodes,
  ...SuccessCodes,
  ...SocketMsgCodes
} as const


type CodesType = (typeof Codes)[keyof typeof Codes]
type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes]
type SuccessCodesType = (typeof SuccessCodes)[keyof typeof SuccessCodes]
type SocketMsgCodesType = (typeof SocketMsgCodes)[keyof typeof SocketMsgCodes]

export type { CodesType, ErrorCodesType, SuccessCodesType, SocketMsgCodesType }
export { ErrorCodes, SuccessCodes, SocketMsgCodes, Codes }