import { WebSocketError, WebSocketMessageCodeType } from "@repo/types";
import { ErrorCodes } from "@repo/types"


const generateWebSocketErrorMsg = (code: WebSocketMessageCodeType, message: string) : string => {
  const codes = Object.values(ErrorCodes) as WebSocketMessageCodeType[];
  const validateCode = codes.includes(code);
  const errorMsg : WebSocketError = {
    isError: true,
    code: validateCode ? code : ErrorCodes.UNAUTHORIZED,
    message: validateCode ?  message || "An error occurred" : "Received unknown error code from server",
    home: false,
    refresh: false
  }

  if (errorMsg.code === ErrorCodes.UNAUTHORIZED || errorMsg.code === ErrorCodes.AUTH_TIMEOUT) {
    errorMsg.home = true
  }

  const stringifiedErrorMsg = JSON.stringify(errorMsg);

  return stringifiedErrorMsg;

}

export default generateWebSocketErrorMsg;