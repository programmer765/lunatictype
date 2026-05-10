import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";
import validateToken from "./validateToken";
import { IncomingMessage } from "node:http";
import { Codes } from "@repo/types";
import generateSocketMessage from "./generateSocketMsg";



export default async function handleMatchMaking(ws: WebSocket, url: URL, req: IncomingMessage) {

  try {
    const validateUserTimeout = setTimeout(() => {
      console.log('User failed to validate in time for matchmaking');
      ws.send(generateSocketMessage(Codes.AUTH_TIMEOUT));
      ws.close();
    }, 5000); // 5 seconds to validate
  
    const cookies = req.headers.cookie
    if (!cookies) {
      throw new Error(generateSocketMessage(Codes.UNAUTHORIZED));
    }

    const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith('userInfoToken='))?.split('=')[1];
    if (!userInfoToken) {
      throw new Error(generateSocketMessage(Codes.UNAUTHORIZED));
    }
    
    const userId = await validateToken(userInfoToken);
    clearTimeout(validateUserTimeout);

    // Set a timeout for matchmaking
    const timeOut = setTimeout(() => {
      console.log(`Matchmaking timed out for User ${userId}`);
      pool.cancelUser(userId);
      ws.send(generateSocketMessage(Codes.MATCHMAKING_COOLDOWN));
      ws.close(1000);
    }, 30000);

    // Add user to matchmaking pool
    const joinCode = pool.join(userId, (match, matchId) => {
      clearTimeout(timeOut);
      console.log(`Match found for User ${userId}: User ${match[0]} vs User ${match[1]}`);
      ws.send(JSON.stringify({ code: Codes.MATCH_FOUND, users: match, matchId: matchId }));
      ws.close();
    });

    if (joinCode !== Codes.SUCCESS) {
      clearTimeout(timeOut);
      throw new Error(generateSocketMessage(joinCode));
    }

    console.log(`User ${userId} added to matchmaking pool`);

    ws.on('close', () => {
      clearTimeout(timeOut);
      pool.cancelUser(userId);
      console.log(`User ${userId} disconnected and removed from matchmaking pool`);
    });
  
    ws.on('message', (message) => {
      ws.send(generateSocketMessage(Codes.INVALID_MESSAGE));
      ws.close(1008)
  
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : generateSocketMessage(Codes.UNKNOWN_ERROR);
    console.error('Error in matchmaking connection:\n', JSON.parse(errorMessage));
    ws.send(errorMessage);
    ws.close(1011);
  }


}