addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {

    if (request.method === "POST") {

        // Issue(?) with "wrangler dev":
        // Expected: Send a POST request with an empty body or a body that has invalid JSON -> catch and return 400 with no errors reported
        // Reality: Send a POST request with an empty body or a body that has invalid JSON -> reports "X [ERROR] Uncaught SyntaxError: Unexpected end of JSON input" in the console, AND returns the 400
        // Post request is sent via Postman

        let invalidBody = false;
        const { item1, item2 } = await request.json().catch(() => {
            invalidBody = true;
            return {};
        });

        if (invalidBody) return new Response("invalidBody is true, meaning request.json() failed.", { headers: { "Content-Type": "text/plain" }, status: 400 });

        return new Response(JSON.stringify({ item1, item2 }), { headers: { "Content-Type": "application/json" }, status: 200 });
    }

    if (request.method === "GET") return new Response("I see your GET.", { headers: { "Content-Type": "text/plain" }, status: 200 });
}