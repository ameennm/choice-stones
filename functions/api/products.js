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

        // Robust parsing for production Worker
        const processedResults = results.map(p => {
            let imagesArray = [];
            const raw = (p.images || '').trim();
            if (raw) {
                try {
                    const parsed = JSON.parse(raw);
                    imagesArray = Array.isArray(parsed) ? parsed : [parsed];
                } catch (e) {
                    if (raw.startsWith('[') && raw.endsWith(']')) {
                        const inner = raw.slice(1, -1).trim();
                        imagesArray = inner ? inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, '')) : [];
                    } else {
                        imagesArray = [raw];
                    }
                }
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
