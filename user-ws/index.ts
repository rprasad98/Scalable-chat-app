import { WebSocketServer } from 'ws';
import { WebSocket as WebSocketWs } from 'ws';
import { createClient } from "redis";
const wss = new WebSocketServer({ port: 8082 });

interface Room{
    sockets: WebSocketWs[];
}

const rooms :Record<string, Room> = {};

// const relayServerUrl = "ws://localhost:3001";
// const relaySocket = new WebSocket(relayServerUrl)

//Redis Clients
const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect()
]);


await subClient.subscribe('chat-messages', (message) => {
    
    try {
        const parsedData = JSON.parse(message)
        if (parsedData.type === 'chat' && rooms[parsedData.roomId]) {
            
            rooms[parsedData.roomId].sockets.map(socket => {
                if (socket.readyState === WebSocketWs.OPEN) {
                    socket.send(message)
                }
            });
        }
    }
        catch (error) {
            console.error('Error parsing Redis message:',error)
        }
    }
)


// relaySocket.onmessage = ({data}) => {
//     const parsedData = JSON.parse(data)
//     if (parsedData.type == 'chat') {
//         rooms[parsedData.roomId].sockets.map(socket=>socket.send(data))
//     }
// }
    

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
          pubClient.publish('chat-messages', data)
          //also publish to local
          if (rooms[parsedData.roomId]) {
              rooms[parsedData.roomId].sockets.map(socket => {
                  if (socket.readyState === WebSocketWs.OPEN)
                       socket.send(data);
              })
          }
      
      }
      })  
   // ws.send('something');
     
});
