import { WebSocketServer } from 'ws';
import { WebSocket as WebSocketWs} from 'ws';
const wss = new WebSocketServer({ port: 8081 });

interface Room{
    sockets: WebSocketWs[];
}

const rooms :Record<string, Room> = {};

const relayServerUrl = "ws://localhost:3001";
const relaySocket=new WebSocket(relayServerUrl)

relaySocket.onmessage = ({data}) => {
    const parsedData = JSON.parse(data)
    if (parsedData.type == 'chat') {
        rooms[parsedData.roomId].sockets.map(socket=>socket.send(data))
    }
}
    



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
          relaySocket.send(data)
      }
      })
      
   // ws.send('something');
    
    
});

