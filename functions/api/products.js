export async function onRequest(context) {
    const { env } = context;
    const db = env.DB || env.CHOICE_DB || env['choice-db'];

    if (!db) {
        return new Response(JSON.stringify({ error: "D1 Database connection not found in environment" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }

    try {
        const { results } = await db.prepare("SELECT id, name, category, subtitle, description, images, price, unit FROM products WHERE name != 'System Settings'").all();

        // Parse images JSON string if necessary
        const processedResults = results.map(p => {
            let imagesArray = [];
            if (typeof p.images === 'string' && p.images.trim()) {
                try {
                    imagesArray = JSON.parse(p.images);
                } catch (e) {
                    // Fallback for malformed strings like [/products/...]
                    let raw = p.images.trim();
                    if (raw.startsWith('[') && raw.endsWith(']')) {
                        raw = raw.slice(1, -1);
                        if (raw) {
                            imagesArray = raw.split(',').map(s => s.trim().replace(/^"|"$/g, ''));
                        }
                    }
                }
            } else if (Array.isArray(p.images)) {
                imagesArray = p.images;
            }
            return { ...p, images: imagesArray };
        });

        return new Response(JSON.stringify(processedResults), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
