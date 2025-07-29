import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 8080 });

interface Room{
    sockets: WebSocket[];
}

const rooms :Record<string, Room> = {};



wss.on('connection', function connection(ws) {
  ws.on('error', console.error);
  console.log('inside ws connection')
  ws.on('message', function message(data:string) {
      const parsedData = JSON.parse(data);
      if (parsedData.type === 'join') {
          const room = parsedData.roomId;
          if (!rooms[room]) {
              rooms[room] = {
                  sockets: []
              }
          }
          rooms[room].sockets.push(ws);
      }
          if (parsedData.type === 'chat') {
              console.log('Broadcasting to room:', parsedData.roomId, 'message:', data.toString());
              rooms[parsedData.roomId].sockets.map(socket => socket.send(data.toString()))
          }
      })
      
   // ws.send('something');
    
    
});

