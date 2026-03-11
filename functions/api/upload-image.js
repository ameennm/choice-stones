export async function onRequest(context) {
    const { env, request } = context;

    // Reject non-POST requests
    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        // Cloudflare Pages has a read-only filesystem at runtime.
        // Direct file uploads to the public directory are not possible in production.
        // This requires an external storage solution like Cloudflare R2.

        // Return a structured error explaining the situation
        return new Response(JSON.stringify({
            error: "Image upload is currently only supported in local development. For production, please configure Cloudflare R2 storage for persistent image hosting.",
            code: "PRODUCTION_RO_FILESYSTEM"
        }), {
            status: 403, // Using 403 Forbidden because it's a policy/environment restriction
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
