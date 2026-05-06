import { ErrorCodes } from "@repo/types"
import { WebSocketError } from "@repo/types";

interface setWebSocketErrorProps {
  setError: React.Dispatch<React.SetStateAction<WebSocketError>>,
  error: WebSocketError
}



const setWebSocketError = ({ setError, error }: setWebSocketErrorProps) => {
  const isValidCode = Object.values(ErrorCodes).includes(error.code);
  if (!isValidCode) {
    error.code = ErrorCodes.UNKOWN_ERROR;
    error.message = "Received unknown error code from server";
  }
  const { code, message } = error;

  if (code === ErrorCodes.MATCHMAKING_COOLDOWN || code === ErrorCodes.UNKOWN_ERROR) {
    setError({ isError: true, message, code, home: false, refresh: false });
  } else if (code === ErrorCodes.UNAUTHORIZED || code === ErrorCodes.AUTH_TIMEOUT) {
    setError({ isError: true, message, code, home: true, refresh: false });
  } else {
    setError({ isError: true, message, code, home: false, refresh: true });
  }
}

export default setWebSocketError;