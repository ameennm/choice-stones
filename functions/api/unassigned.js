export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    // Construct URL to the manifest file based on current origin
    const manifestUrl = `${url.origin}/unassigned-manifest.json`;

    try {
        const res = await fetch(manifestUrl);
        if (res.ok) {
            const files = await res.json();
            return new Response(JSON.stringify(files), {
                headers: { "Content-Type": "application/json" }
            });
        }
    } catch (e) {
        console.error('Error reading manifest:', e);
    }

    return new Response(JSON.stringify([]), {
        headers: { "Content-Type": "application/json" }
    });
}
