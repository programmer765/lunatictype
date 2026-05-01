import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";
import validateToken from "./validateToken";
import { IncomingMessage } from "node:http";



export default async function handleMatchMaking(ws: WebSocket, url: URL, req: IncomingMessage) {

  try {
    const validateUserTimeout = setTimeout(() => {
      console.log('User failed to validate in time for matchmaking');
      ws.send(JSON.stringify({ type: 'validation_timeout' }));
      ws.close(1008, 'Validation timeout');
    }, 5000); // 5 seconds to validate
  
    const cookies = req.headers.cookie
    if (!cookies) {
      throw new Error('No cookies found in the request');
    }

    const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith('userInfoToken='))?.split('=')[1];
    if (!userInfoToken) {
      throw new Error('userInfoToken not found in the cookies');
    }
    
    const userId = await validateToken(userInfoToken);
    clearTimeout(validateUserTimeout);

    // Set a timeout for matchmaking
    const timeOut = setTimeout(() => {
      console.log(`Matchmaking timed out for User ${userId}`);
      pool.cancelUser(userId);
      ws.send(JSON.stringify({ type: 'matchmaking_timeout' }));
      ws.close(1000);
    }, 30000);

    // Add user to matchmaking pool
    pool.join(userId, (match, matchId) => {
      clearTimeout(timeOut);
      console.log(`Match found for User ${userId}: User ${match[0]} vs User ${match[1]}`);
      ws.send(JSON.stringify({ type: 'match_found', users: match, matchId: matchId }));
      ws.close(1000, 'Match found, closing connection');
    });
    console.log(`User ${userId} added to matchmaking pool`);

    ws.on('close', () => {
      clearTimeout(timeOut);
      pool.cancelUser(userId);
      console.log(`User ${userId} disconnected and removed from matchmaking pool`);
    });
  
    ws.on('message', (message) => {
      ws.send(JSON.stringify({ type: 'UNAUTHORIZED', message: 'You are not authorized to send messages in matchmaking' }));
      ws.close(1008)
  
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in matchmaking connection:', errorMessage);
    ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
    ws.close(1011);
  }


}