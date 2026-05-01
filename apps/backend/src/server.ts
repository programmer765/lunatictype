import http from 'http';
import app from './app';
import { initWebSocketServer } from './ws';
import validateToken from './ws/validateToken';
import { userInfoTokenName } from './env';

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.on('upgrade', async (req, socket, head) => {
  // try {
    console.log('Received upgrade request for:', req.url);
  //   const cookies = req.headers.cookie
  //   if (!cookies) {
  //     throw new Error('No cookies found in the request');
  //   }
  //   const userInfoToken = cookies.split(';').find(cookie => cookie.trim().startsWith(`${userInfoTokenName}=`))?.split('=')[1];
  //   // console.log(`userInfoToken: ${userInfoToken}`);
  //   if (!userInfoToken) {
  //     throw new Error('userInfoToken not found in the cookies');
  //   }

  //   await validateToken(userInfoToken)

  // } catch (error) {
  //   const errorMessage = error instanceof Error ? error.message : 'Internal server error';
  //   console.error('Error handling upgrade request:', errorMessage);
  //   socket.write(`HTTP/1.1 500 ${errorMessage}\r\n\r\n`);
  //   socket.destroy();
  // }
  
});

initWebSocketServer(server);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});