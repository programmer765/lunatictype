import { ErrorCodes } from "./Codes";

export type ErrorCodesType = typeof ErrorCodes[keyof typeof ErrorCodes];

interface ErrorState {
  showAlert: boolean;
  message: string,
  code: ErrorCodesType,
  home: boolean,
  refresh: boolean
}


export type { ErrorState };