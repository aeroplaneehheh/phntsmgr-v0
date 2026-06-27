export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = new WebSocketPair();

    server.accept();

    server.addEventListener("message", (e) => {
        console.log("Message received: ", e.data);
        server.send(`Echo: ${event.data}`);
    });

    server.addEventListener("close", () => {
        console.log("A user has disconnected.");
    });

    return new Response(null, {
        status: 101,
        webSocket: client
    });

}