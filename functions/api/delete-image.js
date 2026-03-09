export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB || env.CHOICE_DB || env['choice-db'];

    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { url } = await request.json();

        if (db) {
            // Remove the URL from all products' 'images' lists
            // Note: In SQLite we use JSON_EACH or string replace if needed, but here simple find/replace on the column is easier
            const results = await db.prepare("SELECT id, images FROM products WHERE images LIKE ?").bind(`%${url}%`).all();

            for (const product of results.results) {
                let images = [];
                try {
                    images = JSON.parse(product.images || '[]');
                } catch (e) {
                    if (product.images && product.images.length > 2) {
                        images = product.images.replace(/[\[\]]/g, '').split(',').map(s => s.trim());
                    }
                }

                const updated = images.filter(img => img !== url);
                if (updated.length !== images.length) {
                    await db.prepare("UPDATE products SET images = ? WHERE id = ?").bind(JSON.stringify(updated), product.id).run();
                }
            }
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Successfully removed references. Permanent file deletion on live static storage is not possible at runtime. Please clean up files manually in your source and redeploy."
        }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
