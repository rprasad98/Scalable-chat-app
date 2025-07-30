import { WebSocketServer } from 'ws';
import { WebSocket } from 'ws';
const wss = new WebSocketServer({ port: 3001 });

const servers: WebSocket[]=[]


wss.on('connection', function connection(ws) {
    servers.push(ws)
    ws.on('message', function message(data: string) {
        const parsedData = JSON.parse(data);
        servers.map(socket=> socket.send(data))

    })
})