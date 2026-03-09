export async function onRequest(context) {
    return new Response(JSON.stringify({
        error: "Live image deletion is not supported. Please delete the file from your local folder and redeploy."
    }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
    });
}
