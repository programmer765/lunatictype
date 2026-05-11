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
} as const

const Codes = {
  ...ErrorCodes,
  ...SuccessCodes,
  MATCHMAKING_NOT_FOUND: "MATCHMAKING_NOT_FOUND",
} as const


export type CodesType = (typeof Codes)[keyof typeof Codes]
export type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes]
export type SuccessCodesType = (typeof SuccessCodes)[keyof typeof SuccessCodes]

export { ErrorCodes }
export { SuccessCodes }
export { Codes }