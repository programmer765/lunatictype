const ErrorCodes = {
  UNAUTHORIZED: "UNAUTHORIZED",
  AUTH_TIMEOUT: "AUTH_TIMEOUT",
  MATCHMAKING_COOLDOWN: "MATCHMAKING_COOLDOWN",
  UNKOWN_ERROR: "UNKOWN_ERROR",
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
} as const


export type CodesType = (typeof Codes)[keyof typeof Codes]

export { ErrorCodes }
export { SuccessCodes }
export { Codes }