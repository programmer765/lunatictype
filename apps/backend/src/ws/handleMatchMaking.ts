import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";
import validateToken from "./validateToken";
import { IncomingMessage } from "node:http";

function generateSocketMessage(code: string, message: string) {
  return JSON.stringify({ code, message, isError: true });
}



export default async function handleMatchMaking(ws: WebSocket, url: URL, req: IncomingMessage) {

  try {
    const validateUserTimeout = setTimeout(() => {
      console.log('User failed to validate in time for matchmaking');
      ws.send(generateSocketMessage('validation_timeout', 'Validation timeout'));
      ws.close(1008, 'Validation timeout');
    }, 5000); // 5 seconds to validate
  
    const cookies = req.headers.cookie
    if (!cookies) {
      throw new Error(generateSocketMessage('unauthorized', 'Please sign in to access matchmaking'));
    }

    const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith('userInfoToken='))?.split('=')[1];
    if (!userInfoToken) {
      throw new Error(generateSocketMessage('unauthorized', 'Please sign in to access matchmaking'));
    }
    
    const userId = await validateToken(userInfoToken);
    clearTimeout(validateUserTimeout);

    // Set a timeout for matchmaking
    const timeOut = setTimeout(() => {
      console.log(`Matchmaking timed out for User ${userId}`);
      pool.cancelUser(userId);
      ws.send(generateSocketMessage('matchmaking_timeout', 'Matchmaking timeout'));
      ws.close(1000);
    }, 30000);

    // Add user to matchmaking pool
    const joinResult = pool.join(userId, (match, matchId) => {
      clearTimeout(timeOut);
      console.log(`Match found for User ${userId}: User ${match[0]} vs User ${match[1]}`);
      ws.send(JSON.stringify({ code: 'match_found', users: match, matchId: matchId }));
      ws.close(1000, 'Match found, closing connection');
    });

    if (!joinResult) {
      clearTimeout(timeOut);
      throw new Error(generateSocketMessage('matchmaking_cooldown', 'Please wait a few seconds before trying to join matchmaking again'));
    }

    console.log(`User ${userId} added to matchmaking pool`);

    ws.on('close', () => {
      clearTimeout(timeOut);
      pool.cancelUser(userId);
      console.log(`User ${userId} disconnected and removed from matchmaking pool`);
    });
  
    ws.on('message', (message) => {
      ws.send(generateSocketMessage('invalid_message', 'Invalid message received during matchmaking'));
      ws.close(1008)
  
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : generateSocketMessage('unknown_error', 'An unknown error occurred');
    console.error('Error in matchmaking connection:\n', JSON.parse(errorMessage));
    ws.send(errorMessage);
    ws.close(1011);
  }


}