
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import { pool } from '../matchmaking/pool';
import matchMakingRoute from './matchmakingRoute';

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathName = url.pathname;

    if (pathName === '/ws/matchmaking') {
      matchMakingRoute(ws, url);
    }
    else if (pathName === '/ws/') {
      
    }
    else {
      ws.close(1008, 'Invalid path');
      console.log('Client attempted to connect to invalid path:', pathName);
      return;
    }

    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.on('ping', () => {
      console.log('Received ping from client');
    });

    ws.on('close', () => {
      console.log('Client disconnected');
    });

    ws.send('Welcome to the WebSocket server!');
  })
}