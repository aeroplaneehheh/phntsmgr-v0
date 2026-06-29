export default {
    async fetch(request, env, ctx) {
        const upgradeHeader = request.headers.get("Upgrade");
        const id = env.CHAT_ROOM.idFromName("global_room");
        const roomStub = env.CHAT_ROOM.get(id);
        return roomStub.fetch(request, env);
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
                text TEXT NOT NULL
            );
        `)
    }

    async fetch(request) {
        const upgradeHeader = request.headers.get("Upgrade");
        if (upgradeHeader !== "websocket") {
            const cursor = this.sql.exec("SELECT text FROM messages ORDER BY id ASC");
            const results = Array.from(cursor);
            return new Response(JSON.stringify(results), {
                headers: { "Content-Type": "application/json" }
        });
    }
        const [client, server] = new WebSocketPair();
        this.state.acceptWebSocket(server);
        
        const cursor = this.sql.exac("SELECT text FROM messages ORDER BY id ASC");
        for (const row of cursor) {
            server.send(row.text);
        }
        return new Response(null, { status: 101, webSocket: client });
    };

    async webSocketMessage(ws, message) {
        this.sql.exac("INSERT INTO messages (text) VALUES (?)", message);

        const allSockets = this.state.getWebSockets();
        for (const socket of allSockets) {
            try {
                socket.send(message);
            } catch (err) {

            }
        }
    }
}