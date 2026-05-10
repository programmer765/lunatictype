import { Codes, CodesType, ErrorCodes } from "@repo/types";
import chalk from "chalk";

const CodesMsg: Record<string, string> = {
  [Codes.UNAUTHORIZED]: 'Please sign in to access matchmaking',
  [Codes.AUTH_TIMEOUT]: 'Authentication timeout. Please try joining matchmaking again',
  [Codes.MATCHMAKING_COOLDOWN]: 'Please wait a few seconds before trying to join matchmaking again',
  [Codes.UNKNOWN_ERROR]: 'An unknown error occurred',
  [Codes.INVALID_MESSAGE]: 'Invalid message received during matchmaking',
  [Codes.IN_MATCHMAKING]: 'You are already in matchmaking',
  [Codes.MATCH_FOUND]: 'A match has been found',
  [Codes.SUCCESS]: 'Success',
  [Codes.MATCHMAKING_NOT_FOUND]: 'No match found within the time limit, please try again',
}

type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes]


export default function generateSocketMessage(code: CodesType) {
  const message = CodesMsg[code];
  const isError = Object.values(ErrorCodes).includes(code as ErrorCodesType);
  return JSON.stringify({ code, message, isError });
}