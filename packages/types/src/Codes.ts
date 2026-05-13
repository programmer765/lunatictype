const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  AUTH_TIMEOUT: "AUTH_TIMEOUT",
  MATCHMAKING_COOLDOWN: "MATCHMAKING_COOLDOWN",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
  IN_MATCHMAKING: "IN_MATCHMAKING",
  INVALID_MESSAGE: "INVALID_MESSAGE",
  SERVER_ERROR: "SERVER_ERROR",
} as const

const SuccessCodes = {
  SUCCESS: "SUCCESS",
  MATCH_FOUND: "MATCH_FOUND",
  MATCHMAKING_NOT_FOUND: "MATCHMAKING_NOT_FOUND",
} as const

const Codes = {
  ...ErrorCodes,
  ...SuccessCodes,
} as const


type CodesType = (typeof Codes)[keyof typeof Codes]
type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes]
type SuccessCodesType = (typeof SuccessCodes)[keyof typeof SuccessCodes]

export type { CodesType, ErrorCodesType, SuccessCodesType }
export { ErrorCodes, SuccessCodes, Codes }