import { Buffer } from 'node:buffer';

export async function onRequest(context) {
    const message = 'yooooo this is from node.js';
    const encoded = Buffer.from(message).toString(base64);

    return new Response(JSON.stringify({
        original: message,
        base64: encoded
    }), {
        headers: { "content-type": "application/json" }
    });
}