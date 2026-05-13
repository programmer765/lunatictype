import { Codes, CodesType, ErrorCodes, MatchFoundPayload, SuccessCodes, SuccessCodesType } from "@repo/types";
import chalk from "chalk";

const CodesMsg: Record<string, string> = {
  [Codes.UNAUTHORIZED]: 'Please sign in to access matchmaking',
  [Codes.AUTH_TIMEOUT]: 'Authentication timeout. Please try joining matchmaking again',
  [Codes.MATCHMAKING_COOLDOWN]: 'Please wait a few seconds before trying to join matchmaking again',
  [Codes.UNKNOWN_ERROR]: 'An unknown error occurred, Please try again later',
  [Codes.INVALID_MESSAGE]: 'Invalid message received during matchmaking',
  [Codes.IN_MATCHMAKING]: 'You are already in matchmaking',
  [Codes.MATCH_FOUND]: 'A match has been found',
  [Codes.SUCCESS]: 'Success',
  [Codes.MATCHMAKING_NOT_FOUND]: 'No match found within the time limit, please try again',
}

type ErrorCodesType = (typeof ErrorCodes)[keyof typeof ErrorCodes]




export function generateErrorMessage(code: ErrorCodesType) {
  const message = CodesMsg[code];
  // const isError = Object.values(ErrorCodes).includes(code as ErrorCodesType);
  return JSON.stringify({ code, message, isError: true });
}

export function generateSuccessMessage(code: typeof SuccessCodes.SUCCESS): string;
export function generateSuccessMessage(code: typeof SuccessCodes.MATCH_FOUND, payload: MatchFoundPayload): string;
export function generateSuccessMessage(code: typeof SuccessCodes.MATCHMAKING_NOT_FOUND): string;

export function generateSuccessMessage(code: SuccessCodesType, payload?: MatchFoundPayload) {
  const message = CodesMsg[code];

  if (code === Codes.MATCH_FOUND) {
    if (!payload) {
      return generateErrorMessage(Codes.UNKNOWN_ERROR);
    }
    return JSON.stringify({ code, payload, isError: false });
  }

  return JSON.stringify({ code, message, isError: false });
}