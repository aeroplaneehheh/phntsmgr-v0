export default {
    async fetch(request, env, ctx) {
        const upgradeHeader = request.headers.get("Upgrade");
        const id = env.CHAT_ROOM.idFromName("global_room_v0");
        const roomStub = env.CHAT_ROOM.get(id);
        return roomStub.fetch(request);
    }
};

export class chatRoom {
    constructor(state, env) {
        this.state = state;
        this.env = env

        this.sql = state.storage.sql;
        this.sql.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                text TEXT NOT NULL
            );
        `)
    }

    async fetch(request) {
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader !== "websocket") {
            const cursor = this.sql.exec("SELECT username, text FROM messages ORDER BY id ASC");
            const results = Array.from(cursor);
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
        });
    }
        const [client, server] = new WebSocketPair();
        this.state.acceptWebSocket(server);
        
        const cursor = this.sql.exec("SELECT username, text FROM messages ORDER BY id ASC");
        for (const row of cursor) {
            server.send(JSON.stringify({username: row.username, text: row.text}));
        }
        return new Response(null, { status: 101, webSocket: client });
    };

    async webSocketMessage(ws, message) {
        let username = "Anonymous";
        let text = message;
        try {
            const data = JSON.parse(message);
            if (data.action === "CLEAR_PERMANENTLY") {
                await this.state.storage.deleteAll();
                this.broadcast(JSON.stringify({ action: "CHAT_CLEARED" }));
                return;
            }
            if (data.username) username = data.username;
            if (data.text) text = data.text;
        } catch(err) {

        }
        this.sql.exec("INSERT INTO messages (username, text) VALUES (?, ?)", username, text);
        const broadcast = JSON.stringify({username, text});
        this.broadcast(broadcast);

    }

    broadcast(message) {
        const allSockets = this.state.getWebSockets();
        for (const socket of allSockets) {
            try {
                socket.send(message);
            } catch (err) {

            }
        }
    }
}