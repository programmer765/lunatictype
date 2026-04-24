import { WebSocket } from "ws";
import { pool } from "../matchmaking/pool";


export default function handleMatchMaking(ws: WebSocket, url: URL) {

  // Validate that userId parameter is present
  const userIdParam = url.searchParams.get('userId');
  if (!userIdParam) {
    ws.close(1008, 'Missing userId parameter');
    console.log('Client attempted to connect without userId parameter');
    return;
  }

  // Validate that userId is a valid number
  const userId = parseInt(userIdParam, 10);
  if (isNaN(userId)) {
    ws.close(1008, 'Invalid userId parameter');
    console.log('Client attempted to connect with invalid userId parameter:', userIdParam);
    return;
  }

  // Set a timeout for matchmaking
  const timeOut = setTimeout(() => {
    console.log(`Matchmaking timed out for User ${userId}`);
    ws.send(JSON.stringify({ type: 'match_timeout' }));
    pool.cancelUser(userId);
    ws.close(1000, 'Matchmaking timed out');
  }, 30000);

  // Add user to matchmaking pool
  pool.join(userId, (match, matchId) => {
    clearTimeout(timeOut);
    console.log(`Match found for User ${userId}: User ${match[0]} vs User ${match[1]}`);    
    ws.send(JSON.stringify({ type: 'match_found', users: match, matchId: matchId }));
    ws.close(1000, 'Match found');
  });
  console.log(`User ${userId} added to matchmaking pool`);

  ws.on('close', () => {
    clearTimeout(timeOut);
    pool.cancelUser(userId);
    console.log(`User ${userId} disconnected and removed from matchmaking pool`);
  });

}