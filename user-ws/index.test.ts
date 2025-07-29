import { WebSocket } from "ws";
const BASE_URL = "ws://localhost:8080";
import { describe, expect, test } from "bun:test"

describe("chat application", () => {
    test('clients can join a room and receive messages', async () => {

        const client1 = new WebSocket(BASE_URL)
        const client2 = new WebSocket(BASE_URL)
        
        console.log('control reaches here1')

        await new Promise<void>((resolve, reject) => {
            let count = 0;
            client1.on('open', () => {
               count= count + 1;
                if (count == 2)
                    resolve()
            })

            client2.on('open', () => {
                count=count + 1;
                if (count == 2)
                    resolve()
            })
        })

        console.log('control reaches here2')
        
     // Both join the same room
        client1.send(JSON.stringify({ type: 'join', roomId: 'test-room' }));
        
        client2.send(JSON.stringify({ type: 'join', roomId: 'test-room' }));
         

        await new Promise<void>((resolve) => {
            client2.onmessage = (data: string) => {
            const parsedData = JSON.parse(data)
            expect(parsedData.type == 'chat')
            expect(parsedData.message == 'hello there')
            resolve()
            }
            client1.send(JSON.stringify({
                type: 'chat', roomId: 'test-room',
                message: 'hello there'
            }));
        })

        
    
    })
})

// function waitForChatMessage(ws) {
//   return new Promise((resolve) => {
//     ws.on('message', (data) => {
//       const msg = data.toString();
//       if (msg.includes('Hello from client1')) {
//         resolve(msg);
//       }
//     });
//   });
// }