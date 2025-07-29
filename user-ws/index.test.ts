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
            client2.onmessage = (event) => {
                // event.data may be a Buffer or string depending on ws version/environment
                let dataStr: string;
                console.log(typeof(event.data))
                 if (typeof event.data === "string") {
                    dataStr = event.data;
                } else if (event.data instanceof Buffer) {
                    dataStr = event.data.toString();
                } else if (event.data instanceof ArrayBuffer) {
                    dataStr = Buffer.from(event.data).toString();
                } else {
                    // fallback for other types
                    dataStr = String(event.data);
                }
                console.log(dataStr);
                const parsedData = JSON.parse(dataStr);
                expect(parsedData.type).toBe('chat');
                expect(parsedData.message).toBe('hello there');
                resolve();
            }
            client1.send(JSON.stringify({
                type: 'chat', roomId: 'test-room',
                message: 'hello there'
            }));
        })

        
    
    })
})
