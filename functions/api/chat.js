export async function onRequest(context) {
    const upgradeHeader = context.request.headers.get("Upgrade");

    if (!upgradeHeader || upgradeHeader !== "websocket") {
        return new Response("Expected Upgrade: websocket", { status: 426 });
    }

    const [client, server] = new WebSocketPair();

    server.accept();

    context.waitUntil((async () => {
        try {
            server.addEventListener("message", (e) => {
                console.log("Message received: ", e.data);
                server.send(`${e.data}`);
            });

            await new Promise((resolve, reject) => {
                server.addEventListener("close", resolve);
                server.addEventListener("error", reject);
            });
        } catch (err) {
            console.error("Internal Socket Lifecycle Error:", err);
        }
    })());

    return new Response(null, {
        status: 101,
        webSocket: client
    });

}