import { WebSocket } from 'ws';
import { IncomingMessage } from 'node:http';
import validateToken from './validateToken';
import matchStore, { ClientInfo } from '../matchmaking/matchStore';
import { Codes, ErrorCodes, SocketMsgCodesType, SocketMsgCodes } from '@repo/types';
import { generateErrorMessage } from './generateSocketMsg';
import { PlayerInfo } from '@repo/types';

interface MatchMessage {
  type: SocketMsgCodesType;
  token?: string;
  position?: number;
}


function isValidMatchMessageType(type: string): type is SocketMsgCodesType {
  return (Object.values(SocketMsgCodes) as string[]).includes(type);
}


export default async function handleMatch(ws: WebSocket, url: URL, req: IncomingMessage) {

  try {

    // Validate matchId
    const matchId = url.pathname.split('/').pop();
    if (!matchId) {
      throw new Error(generateErrorMessage(ErrorCodes.INVALID_MATCH_ID));
    }
    
    const cookies = req.headers.cookie
    if (!cookies) {
      throw new Error(generateErrorMessage(ErrorCodes.UNAUTHORIZED));
    }
  
    const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith('userInfoToken='))?.split('=')[1];
    if (!userInfoToken) {
      throw new Error(generateErrorMessage(ErrorCodes.UNAUTHORIZED));
    }
  
    const userInfo : PlayerInfo = await validateToken(userInfoToken);
    const userId = userInfo.playerId;
  
    const isValid = matchStore.isValidMatch(matchId, userId);
    if (!isValid) {
      throw new Error(generateErrorMessage(ErrorCodes.INVALID_MATCH_ID));
    }
  
  
    const authenticated = true;


    // Update the user's WebSocket connection in the match store
    matchStore.updateUserWebSocket(matchId, userId, ws);

    // Send the word list to the user
    if (matchStore.allPlayersConnected(matchId)) {
      matchStore.sendWordsListToUsers(matchId);
    }
  
  
    ws.on('message', async (message) => {
  
      try {
        const msg : MatchMessage = JSON.parse(message.toString());
  
        // Validate message type
        if (!msg.type || !isValidMatchMessageType(msg.type)) {
          throw new Error('Invalid message type');
        }


        // Acknowledge the message
        if (msg.type === SocketMsgCodes.CLIENT_READY) {
          matchStore.setClientReady(matchId, userId);
        }

  
        // Update user position and broadcast to opponent
        if (msg.type === SocketMsgCodes.POSITION_UPDATE) {
          if (!msg.position || isNaN(msg.position)) {
            throw new Error('update_user_position message missing position');
          }
          
          const usersInfo : ClientInfo[] = matchStore.getUsersInMatchExceptUser(matchId, userId);
  
          // Broadcast the user's new position to the other user in the match
          usersInfo.forEach(userInfo => {
            if (userInfo.ws && userInfo.ws.readyState === WebSocket.OPEN) {
              userInfo.ws.send(JSON.stringify({ type: SocketMsgCodes.OPPONENT_POSITION_UPDATE, userId, position: msg.position }));
            }
          });
  
        }
  
        // update the user of the opponent's position change
        if (msg.type === SocketMsgCodes.OPPONENT_POSITION_UPDATE) {
          if (!msg.position || isNaN(msg.position)) {
            throw new Error('opponent_position_update message missing position');
          }
  
          ws.send(JSON.stringify({ type: SocketMsgCodes.OPPONENT_POSITION_UPDATE, userId, position: msg.position }));
  
        }
  
      }
      catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        console.error('Error processing message for matchId:', matchId, 'Error:', errorMessage);
        ws.send(JSON.stringify({ type: ErrorCodes.SERVER_ERROR, message: errorMessage }));
        ws.close(1011);
        return;
      }
  
    });
  
    ws.on('close', () => {
      try {
        if (authenticated) {
          matchStore.handleDisconnect(matchId, userId);
          console.log('Client disconnected and match deleted for matchId:', matchId, 'userId:', userId);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Internal server error';
        console.error('Error occurred while handling client close for matchId:', matchId, 'Error:', errorMessage);
      }
  
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : generateErrorMessage(ErrorCodes.UNKNOWN_ERROR);
    console.error('Error in match connection:\n', JSON.parse(errorMessage));
    ws.send(errorMessage);
    ws.close(1011);
  }


}