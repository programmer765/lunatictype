
import { WebSocketServer } from 'ws';
import { Server } from 'http';

export function initWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws'});

  wss.on('connection', (ws) => {
    ws.on('message', (message) => {
      console.log('received: %s', message);
    });

    ws.on('ping', () => {
      console.log('Received ping from client');
    });

    ws.send('Welcome to the WebSocket server!');
  })
}