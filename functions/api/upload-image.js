export async function onRequest(context) {
    const { env, request } = context;

    // Reject non-POST requests
    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    // Check if the R2 bucket binding exists
    if (!env.IMAGES) {
        return new Response(JSON.stringify({
            error: "R2 Bucket binding 'IMAGES' not found. Please bind it in your Cloudflare dashboard or wrangler.toml."
        }), { status: 500, headers: { "Content-Type": "application/json" } });
    }

    try {
        const body = await request.json();
        const { name, base64Data, productId, productName } = body;

        if (!name || !base64Data) {
            return new Response(JSON.stringify({ error: "Missing name or base64Data" }), {
                status: 400, headers: { "Content-Type": "application/json" }
            });
        }

        // Convert Base64 back to binary data
        const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

        // Generate a safe unique filename based on the product name/id
        let baseFilename = safeName;
        if (productName) {
            baseFilename = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        } else if (productId) {
            baseFilename = productId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const safeOriginalName = name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const extensionMatch = safeOriginalName.match(/\.[0-9a-z]+$/i);
        const extension = extensionMatch ? extensionMatch[0] : '';
        
        // Append random string to prevent overwriting existing product images
        const randomStr = Math.random().toString(36).substring(2, 8);
        const uniqueFileName = `${baseFilename}-${randomStr}${extension}`;

        // Determine correct Content-Type from extension
        let contentType = 'image/jpeg';
        if (uniqueFileName.toLowerCase().endsWith('.png')) contentType = 'image/png';
        if (uniqueFileName.toLowerCase().endsWith('.webp')) contentType = 'image/webp';
        if (uniqueFileName.toLowerCase().endsWith('.gif')) contentType = 'image/gif';

        // Upload to Cloudflare R2
        await env.IMAGES.put(uniqueFileName, binaryData.buffer, {
            httpMetadata: { contentType: contentType }
        });

        // Return the new URL (we will create a route at /images/ to serve these)
        return new Response(JSON.stringify({
            success: true,
            url: `/images/${uniqueFileName}`
        }), {
            status: 200,
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
        });

    } catch (e) {
        console.error("Upload error:", e);
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
