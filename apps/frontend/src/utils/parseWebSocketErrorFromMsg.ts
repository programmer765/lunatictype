import { ErrorCodes, ErrorState, WebSocketMessage } from "@repo/types";


export function parseWebSocketErrorFromMsg(error: unknown) : ErrorState {
  const genError : ErrorState = { 
    showAlert: true, 
    message: "", 
    code: ErrorCodes.UNKOWN_ERROR, 
    home: false, 
    refresh: false 
  };

  if (error instanceof Error) {
    try {
      const msg = error.message;
      const errorMsg = JSON.parse(msg) as WebSocketMessage;

      if (!errorMsg.isError) {
        throw new Error("Received success message when error was expected");
      }

      const isValidCode = Object.values(ErrorCodes).includes(errorMsg.code);
      if (!isValidCode) {
        throw new Error("Invalid error code received from server");
      }
      genError.code = errorMsg.code;
      genError.message = errorMsg.message;

    } catch (parseError) {
      genError.code = ErrorCodes.UNKOWN_ERROR;
      genError.message = parseError instanceof Error ? parseError.message : "Wrong error format received";
    }
  
  } 
  if (typeof error === "string") {
    genError.code = ErrorCodes.UNAUTHORIZED;
    genError.message = error;
  }

  return genError;
}