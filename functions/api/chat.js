export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeheader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426});
    }

    const [client, server] = Object.create(WebSocketPair);

    server.accept();

    server.addEventListener("message", (event) => {
        console.log("Message received: ", event.data);
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