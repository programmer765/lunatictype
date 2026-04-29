import { WebSocket } from 'ws';
import validateToken from './validateToken';
import matchStore from '../matchmaking/matchStore';

const MatchMessageTypes = {
  authenticate: 'authenticate',
  updateUserPosition: 'update_user_position',
  opponentPositionUpdate: 'opponent_position_update'
} as const

type MatchMessageTypesType = (typeof MatchMessageTypes)[keyof typeof MatchMessageTypes];

interface MatchMessage {
  type: MatchMessageTypesType;
  token?: string;
  position?: number;
}


function isValidMatchMessageType(type: string): type is MatchMessageTypesType {
  return (Object.values(MatchMessageTypes) as string[]).includes(type);
}


export default function handleMatch(ws: WebSocket, url: URL) {
  // Validate that matchId parameter is present
  const matchId = url.searchParams.get('matchId');
  if (!matchId) {
    ws.close(1008, 'Missing matchId parameter');
    console.log('Client attempted to connect without matchId parameter');
    return;
  }

  let authenticated = false;
  let userId : number;

  const authTimeout = setTimeout(() => {
    if (!authenticated) {
      console.log('Authentication timeout for matchId:', matchId);
      ws.close(1008, 'Authentication timeout');
    }
  }, 5000); // 5 seconds to authenticate


  ws.on('message', async (message) => {

    try {
      const msg : MatchMessage = JSON.parse(message.toString());

      // Validate message type
      if (!isValidMatchMessageType(msg.type)) {
        throw new Error('Invalid message type');
      }

      // authenticate user first
      if(!authenticated) {
        if (msg.type === MatchMessageTypes.authenticate) {
          if (!msg.token) {
            throw new Error('Authentication message missing token');
          }
          userId = await validateToken(msg.token)
          authenticated = true;

          if (!matchStore.isValidMatch(matchId, userId)) {
            throw new Error('Invalid matchId');
          }

          matchStore.updateUserWebSocket(matchId, userId, ws)

          clearTimeout(authTimeout);
          console.log('Client authenticated successfully and has been added to the match for matchId:', matchId, 'userId:', userId);
          
          return;
        } else {
          throw new Error('First message must be authentication');
        }
          
      } 

      // If the user is authenticated, they should not be sending authentication messages again
      if (authenticated && msg.type === MatchMessageTypes.authenticate) {
        throw new Error('Client is already authenticated');
      }

      // Update user position and broadcast to opponent
      if (msg.type === MatchMessageTypes.updateUserPosition) {
        if (!msg.position || isNaN(msg.position)) {
          throw new Error('update_user_position message missing position');
        }
        
        const usersInfo = matchStore.getUsersInMatchExceptUser(matchId, userId);

        // Broadcast the user's new position to the other user in the match
        usersInfo.forEach(userInfo => {
          if (userInfo.ws && userInfo.ws.readyState === WebSocket.OPEN) {
            userInfo.ws.send(JSON.stringify({ type: 'opponent_position_update', userId, position: msg.position }));
          }
        });

      }

      // Broadcast opponent position update to the user
      if (msg.type === MatchMessageTypes.opponentPositionUpdate) {
        if (!msg.position || isNaN(msg.position)) {
          throw new Error('opponent_position_update message missing position');
        }

        ws.send(JSON.stringify({ type: 'opponent_position_update', userId, position: msg.position }));

      }

    }
    catch (error) {
      clearTimeout(authTimeout);
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Error processing message for matchId:', matchId, 'Error:', errorMessage);
      ws.send(JSON.stringify({ type: 'error', message: errorMessage }));
      ws.close(1011);
      return;
    }

  });

  ws.on('close', () => {
    try {
      if (authenticated) {
        matchStore.deleteMatch(matchId);
        console.log('Client disconnected and match deleted for matchId:', matchId, 'userId:', userId);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Error occurred while handling client close for matchId:', matchId, 'Error:', errorMessage);
    }

  });

}