export async function onRequest(context) {
    return new Response(JSON.stringify({
        error: "Live image assignment is not supported. Please use the local development environment for mapping new images and then deploy."
    }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
    });
}
