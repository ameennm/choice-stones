export async function onRequest(context) {
    // On the live site, we can't easily list local unassigned files 
    // without a pre-generated manifest.
    // For now, return an empty array to prevent the UI from crashing.
    return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" }
    });
}
