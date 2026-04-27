import { WebSocket } from 'ws';
import validateToken from './validateToken';
import matchStore from '../matchmaking/matchStore';

const MatchMessageTypes = {
  authenticate: 'authenticate',
  addUserToMatch: 'add_user_to_match',
  updateUserPosition: 'update_user_position'
} as const

type MatchMessageTypesType = (typeof MatchMessageTypes)[keyof typeof MatchMessageTypes];

interface MatchMessage {
  type: MatchMessageTypesType;
  token?: string;
  [key: string]: any; // Allow additional properties
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
  let hasAddedToMatch = false;

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

          clearTimeout(authTimeout);
          console.log('Client authenticated successfully for matchId:', matchId, 'userId:', userId);
        } else {
          throw new Error('First message must be authentication');
        }
          
      } 

      // If the user is authenticated, they should not be sending authentication messages again
      if (authenticated && msg.type === MatchMessageTypes.authenticate) {
        throw new Error('Client is already authenticated');
      }

      // After authentication, the first message must be add_user_to_match to add the user to the match
      if (!hasAddedToMatch) {
        if (msg.type === MatchMessageTypes.addUserToMatch) {
          matchStore.updateUserWebSocket(matchId, userId, ws)
          hasAddedToMatch = true;
        } else {
          throw new Error('First message after authentication must be add_user_to_match');
        }
      }

      // If the user has already been added to the match, they should not be sending add_user_to_match messages again
      if (hasAddedToMatch && msg.type === MatchMessageTypes.addUserToMatch) {
        throw new Error('User has already been added to match');
      }

      // If the user is authenticated and has been added to the match, they can only send update_user_position messages
      if (msg.type === MatchMessageTypes.updateUserPosition) {
        if (!msg.position) {
          throw new Error('update_user_position message missing position');
        }
      }

    }
    catch (error) {
      clearTimeout(authTimeout);
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Error processing message for matchId:', matchId, 'Error:', errorMessage);
      ws.close(1011, errorMessage);
      return;
    }

  });

}