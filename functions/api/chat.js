// export async function onRequest(context) {
//     const upgradeHeader = context.request.headers.get("Upgrade");

//     if (!upgradeHeader || upgradeHeader !== "websocket") {
//         try {
//             const { results } = await context.env.DB.prepare(
//                 "SELECT text FROM messages ORDER BY id ASC" 
//             ).all();
//             return new Response(JSON.stringify(results), {
//                 headers: { "Content-Type": "application/json" }
//             });
//         } catch(err){
//             return new Response("Expected Upgrade: websocket", { status: 426 });
//         }
//     }

//     const [client, server] = new WebSocketPair();

//     server.accept();

//     context.waitUntil((async () => {
//         try {
//             const { results } = await context.ev.DB.prepare(
//                 "SELECT text FROM messages ORDER BY id ASC"
//             ).all();

//             for (const row of results) {
//                 server.send(row.text);
//             }

//             server.addEventListener("message", (e) => {
//                 const incomingText = e.data;
//                 console.log("Message received: ", e.data);
                
//                 await context.ev.DB.prepare(
//                     "INSERT INTO messages (text) values (?)"
//                 ).bind(incomingText).run();
//                 server.send(`${incomingText}`);
//             });

//             await new Promise((resolve, reject) => {
//                 server.addEventListener("close", resolve);
//                 server.addEventListener("error", reject);
//             });
//         } catch (err) {
//             console.error("Internal Socket Lifecycle Error:", err);
//         }
//     })());

//     return new Response(null, {
//         status: 101,
//         webSocket: client
//     });

// }

export default {
    async fetch(request, env, ctx) {
        const upgradeHeader = context.request.headers.get("Upgrade");
    
    if (!upgradeHeader || upgradeHeader !== "websocket") {
        const { results } = await context.env.DB.prepare(
            "SELECT text FROM messages ORDER BY id ASC" 
        ).all();
        return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
        });
    }
    const id = env.CHAT_ROOM.idFromName("global_room");
    const roomStub = env.CHAT_ROOM.get(id);
    return roomStub.fetch(request, env);
    }
};

export class chatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env
    }

    async fetch(request) {
        const [client, server] = new WebSocketPair();
        this.state.acceptWebSocket(server);
        const { results } = await this.env.DB.prepare(
            "SELECT text FROM messages ORDER BY id ASC"
        ).all();
        for (const row of results) {
            server.send(row.text);
        }

        return new Response(null, { status: 101, webSocket: client });
    };

    async webSocketMessage(ws, message) {
        await this.env.DB.prepare("INSERT INTO messages (text) VALUES (?)")
        .bind(message)
        .run();

        const allSockets = this.state.getWebSockets();
        for (const socket of allSockets) {
            try {
                socket.send(message);
            } catch (err) {

            }
        }
    }
}