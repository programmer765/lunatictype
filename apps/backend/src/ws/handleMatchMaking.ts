import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";
import validateToken from "./validateToken";

const MatchMessageTypes = {
  validateToken: 'validate_token'
} as const

type MatchMessageTypesType = (typeof MatchMessageTypes)[keyof typeof MatchMessageTypes];
interface MatchMessage {
  type: MatchMessageTypesType;
  token: string;
}



export default function handleMatchMaking(ws: WebSocket, url: URL) {

  const validateUserTimeout = setTimeout(() => {
    console.log('User failed to validate in time for matchmaking');
    ws.send(JSON.stringify({ type: 'validation_timeout' }));
    ws.close(1008, 'Validation timeout');
  }, 5000); // 5 seconds to validate

  ws.on('message', async (message) => {
    try {

      const msg : MatchMessage = JSON.parse(message.toString());
      let userId : number;
      if (msg.type === MatchMessageTypes.validateToken) {
        userId = await validateToken(msg.token);
        clearTimeout(validateUserTimeout);
      }
      else {
        throw new Error('Invalid message type');
      }

      // Set a timeout for matchmaking
      const timeOut = setTimeout(() => {
        console.log(`Matchmaking timed out for User ${userId}`);
        pool.cancelUser(userId);
        ws.close(1000, JSON.stringify({ type: 'match_timeout' }));
      }, 30000);

      // Add user to matchmaking pool
      pool.join(userId, (match, matchId) => {
        clearTimeout(timeOut);
        console.log(`Match found for User ${userId}: User ${match[0]} vs User ${match[1]}`);
        ws.close(1000, JSON.stringify({ type: 'match_found', users: match, matchId: matchId }));
      });
      console.log(`User ${userId} added to matchmaking pool`);

      ws.on('close', () => {
        clearTimeout(timeOut);
        pool.cancelUser(userId);
        console.log(`User ${userId} disconnected and removed from matchmaking pool`);
      });

    }
    catch (error) {
      clearTimeout(validateUserTimeout);
      console.error('Error handling matchmaking message:', error);
      ws.close(1011, JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : 'Unknown error' }));
    }


  });

}