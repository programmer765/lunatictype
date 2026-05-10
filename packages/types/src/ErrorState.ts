import { ErrorCodes, ErrorCodesType } from "./Codes";


interface ErrorState {
  showAlert: boolean;
  message: string,
  code: ErrorCodesType,
  home: boolean,
  refresh: boolean
}


export type { ErrorState };