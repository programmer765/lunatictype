import http from 'http';
import app from './app';
import { initWebSocketServer } from './ws';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.on('upgrade', (req, socket, head) => {
  console.log('Received upgrade request for:', req.url);
});

initWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});