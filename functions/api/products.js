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
        const processedResults = results.map(p => ({
            ...p,
            images: typeof p.images === 'string' ? JSON.parse(p.images || '[]') : (p.images || [])
        }));

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
