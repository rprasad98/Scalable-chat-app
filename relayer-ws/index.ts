// import { WebSocketServer } from 'ws';
// // import { WebSocket } from 'ws';
// // const wss = new WebSocketServer({ port: 3001 });

// const servers: WebSocket[]=[]


// wss.on('connection', function connection(ws) {
//     servers.push(ws)
//     ws.on('message', function message(data: string) {
//         const parsedData = JSON.parse(data);
//         servers.map(socket=> socket.send(data))

//     })
// })

import { Server } from "socket.io";
import { createClient } from "redis";
import { createShardedAdapter } from "@socket.io/redis-adapter";

const pubClient = createClient({ url: "redis://localhost:6379" });
const subClient = pubClient.duplicate();

await Promise.all([
  pubClient.connect(),
  subClient.connect()
]);

// Subscribe to chat messages
await subClient.subscribe('chat-messages', (message) => {
  console.log('Received message from Redis:', message);
  // Broadcast to all connected servers (if needed)
});

console.log('Redis pub-sub relay service running');
//console.log(subClient);
// const io = new Server({
//   adapter: createShardedAdapter(pubClient, subClient)
// });

// io.listen(3000);