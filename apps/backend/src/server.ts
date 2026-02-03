import http from 'http';
import app from './app';
import { initWebSocketServer } from './ws';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});