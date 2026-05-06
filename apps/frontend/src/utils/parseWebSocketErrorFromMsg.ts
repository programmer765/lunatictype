import { ErrorCodes, WebSocketError, WebSocketMessage } from "@repo/types";


export function parseWebSocketErrorFromMsg(error: unknown) : WebSocketError {
  const genError : WebSocketError = { 
    isError: true, 
    message: "", 
    code: ErrorCodes.UNKOWN_ERROR, 
    home: false, 
    refresh: false 
  };

  if (error instanceof Error) {
    genError.code = ErrorCodes.UNAUTHORIZED;
    genError.message = error.message;
  } 
  
  if (typeof error === "string") {
    try {
      const errorMsg = JSON.parse(error) as WebSocketMessage;
      const isValidCode = Object.values(ErrorCodes).includes(errorMsg.code);
      if (!isValidCode) {
        throw new Error("Invalid error code received from server");
      }
      genError.code = errorMsg.code;
      genError.message = errorMsg.message;

    } catch (parseError) {
      genError.code = ErrorCodes.UNKOWN_ERROR;
      genError.message = error;
    }
  }

  return genError;
}