
import { WebSocketServer } from 'ws';
import { Server } from 'http';
import handleMatchMaking from './handleMatchMaking';
import handleMatch from './handleMatch';

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws, req) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const pathName = url.pathname;

    if (pathName === '/ws/matchmaking') {
      handleMatchMaking(ws, url);
    }
    else if (pathName.startsWith('/ws/match')) {
      handleMatch(ws, url);
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