export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB || env.CHOICE_DB || env['choice-db'];

    if (!db) {
        return new Response(JSON.stringify({ error: "D1 Database connection not found" }), { status: 500 });
    }

    if (request.method !== 'POST') {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        const { oldFileName, productId } = await request.json();

        if (!productId || productId === 'unassigned') {
            return new Response(JSON.stringify({
                success: true,
                message: "Reference removed (Filesystem remains static on live site)."
            }), { headers: { "Content-Type": "application/json" } });
        }

        const imageUrl = `/products/unassigned/${oldFileName}`;

        // Get current product images
        const product = await db.prepare("SELECT images FROM products WHERE id = ?").bind(productId).first();
        if (!product) throw new Error("Product not found");

        let currentImages = [];
        try {
            currentImages = JSON.parse(product.images || '[]');
        } catch (e) {
            if (product.images && product.images.length > 2) {
                currentImages = product.images.replace(/[\[\]]/g, '').split(',').map(s => s.trim());
            }
        }

        if (!currentImages.includes(imageUrl)) {
            currentImages.push(imageUrl);
        }

        await db.prepare("UPDATE products SET images = ? WHERE id = ?").bind(JSON.stringify(currentImages), productId).run();

        return new Response(JSON.stringify({
            success: true,
            message: "Assigned successfully in database! Note: File renaming omitted on live site. Original file path used."
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
