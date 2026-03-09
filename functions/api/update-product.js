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
        const product = await request.json();
        const { id, name, category, subtitle, description, price, unit, inStock, featured, images } = product;

        if (!id) throw new Error("Product ID is required");

        const imagesStr = Array.isArray(images) ? JSON.stringify(images) : (images || '[]');

        // Convert boolean to integer for SQLite if necessary, but D1 handles boolean fine
        await db.prepare(`
      UPDATE products 
      SET 
        name = ?, 
        category = ?, 
        subtitle = ?, 
        description = ?, 
        price = ?, 
        unit = ?, 
        inStock = ?, 
        featured = ?,
        images = ?
      WHERE id = ?
    `).bind(
            name,
            category,
            subtitle || '',
            description || '',
            price || 0,
            unit || 'sq.ft',
            inStock ? 1 : 0,
            featured ? 1 : 0,
            imagesStr,
            id
        ).run();

        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
