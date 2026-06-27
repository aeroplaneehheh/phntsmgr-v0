export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = new WebSocketPair();

    server.accept();

    ccontext.waitUntil((async () => {
        try {
            server.addEventListener("message", (e) => {
                console.log("Message received on edge: ", e.data);
                server.send(`Echo: ${e.data}`);
            });

            // Keep the connection registered until a clean close or crash event occurs
            await new Promise((resolve, reject) => {
                server.addEventListener("close", resolve);
                server.addEventListener("error", reject);
            });
        } catch (err) {
            console.error("Internal Socket Lifecycle Error:", err);
        }
    })());

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