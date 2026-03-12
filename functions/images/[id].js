export async function onRequest(context) {
    const { env, request, params } = context;

    const fileName = params.id;
    if (!fileName) {
        return new Response("Not found", { status: 404 });
    }

    if (!env.IMAGES) {
        return new Response("Storage not configured.", { status: 500 });
    }

    try {
        const object = await env.IMAGES.get(fileName);

        if (object === null) {
            return new Response("Image not found", { status: 404 });
        }

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("etag", object.httpEtag);
        
        // Cache the images in the browser for 1 year
        headers.set('Cache-Control', 'public, max-age=31536000, immutable');

        return new Response(object.body, {
            headers,
        });
    } catch (e) {
        return new Response(e.message, { status: 500 });
    }
}
