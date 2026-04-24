import { WebSocket } from 'ws';
import validateToken from './validateToken';

interface MatchMessage {
  type: string;
  token?: string;
  [key: string]: any; // Allow additional properties
}


export default function handleMatch(ws: WebSocket, url: URL) {
  // Validate that matchId parameter is present
  const matchIdParam = url.searchParams.get('matchId');
  if (!matchIdParam) {
    ws.close(1008, 'Missing matchId parameter');
    console.log('Client attempted to connect without matchId parameter');
    return;
  }

  // Validate that matchId is a valid number
  const matchId = parseInt(matchIdParam, 10);
  if (isNaN(matchId)) {
    ws.close(1008, 'Invalid matchId parameter');
    console.log('Client attempted to connect with invalid matchId parameter:', matchIdParam);
    return;
  }

  

  let authenticated = false;
  let userId : number;

  const authTimeout = setTimeout(() => {
    if (!authenticated) {
      console.log('Authentication timeout for matchId:', matchIdParam);
      ws.close(1008, 'Authentication timeout');
    }
  }, 5000); // 5 seconds to authenticate


  ws.on('message', async (message) => {

    try {
      const msg : MatchMessage = JSON.parse(message.toString());

      if(!authenticated) {
        if (msg.type === 'authenticate') {
          if (!msg.token) {
            throw new Error('Authentication message missing token');
          }
          userId = await validateToken(msg.token)
        }
          
      } else {
        console.log('Client sent non-authentication message before authenticating for matchId:', matchId);
        ws.close(1008, 'Authentication required');
      }

    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Internal server error';
      console.error('Error processing message for matchId:', matchId, 'Error:', errorMessage);
      ws.close(1011, errorMessage);
      return;
    }

  });

}