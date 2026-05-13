import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";
import validateToken from "./validateToken";
import { IncomingMessage } from "node:http";
import { Codes, MatchFoundPayload, PlayerInfo } from "@repo/types";
import { generateErrorMessage, generateSuccessMessage } from "./generateSocketMsg";



export default async function handleMatchMaking(ws: WebSocket, url: URL, req: IncomingMessage) {

  try {
    const validateUserTimeout = setTimeout(() => {
      console.log('User failed to validate in time for matchmaking');
      ws.send(generateErrorMessage(Codes.AUTH_TIMEOUT));
      ws.close();
    }, 5000); // 5 seconds to validate
  
    const cookies = req.headers.cookie
    if (!cookies) {
      throw new Error(generateErrorMessage(Codes.UNAUTHORIZED));
    }

    const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith('userInfoToken='))?.split('=')[1];
    if (!userInfoToken) {
      throw new Error(generateErrorMessage(Codes.UNAUTHORIZED));
    }
    
    const userInfo : PlayerInfo = await validateToken(userInfoToken);
    clearTimeout(validateUserTimeout);
    const userId = userInfo.playerId;

    // Set a timeout for matchmaking
    const timeOut = setTimeout(() => {
      console.log(`Matchmaking timed out for User ${userInfo.playerId}`);
      pool.cancelUser(userInfo.playerId);
      ws.send(generateSuccessMessage(Codes.MATCHMAKING_NOT_FOUND));
      ws.close(1000);
    }, 30000);

    // Add user to matchmaking pool
    const joinCode = pool.join(userInfo, (match, matchId) => {
      clearTimeout(timeOut);

      const payload: MatchFoundPayload = {
        players: match,
        matchId: matchId,
      }

      console.log(payload)

      ws.send(generateSuccessMessage(Codes.MATCH_FOUND, payload));
      ws.close();
    });

    if (joinCode !== Codes.SUCCESS) {
      clearTimeout(timeOut);
      throw new Error(generateErrorMessage(joinCode));
    }

    console.log(`User ${userId} added to matchmaking pool`);

    ws.on('close', () => {
      clearTimeout(timeOut);
      pool.cancelUser(userId);
      console.log(`User ${userId} disconnected and removed from matchmaking pool`);
    });
  
    ws.on('message', (message) => {
      ws.send(generateErrorMessage(Codes.INVALID_MESSAGE));
      ws.close(1008)
  
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : generateErrorMessage(Codes.UNKNOWN_ERROR);
    console.error('Error in matchmaking connection:\n', JSON.parse(errorMessage));
    ws.send(errorMessage);
    ws.close(1011);
  }


}