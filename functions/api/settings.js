export async function onRequest(context) {
    const { env, request } = context;
    const db = env.DB || env.CHOICE_DB || env['choice-db'];

    if (!db) {
        return new Response(JSON.stringify({ error: "D1 Database connection not found" }), { status: 500 });
    }

    if (request.method === 'GET') {
        try {
            const result = await db.prepare("SELECT description FROM products WHERE id = 'settings_document'").first();
            if (result) {
                return new Response(result.description, {
                    headers: { "Content-Type": "application/json" }
                });
            } else {
                return new Response(JSON.stringify({}), { headers: { "Content-Type": "application/json" } });
            }
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    if (request.method === 'POST') {
        try {
            const settings = await request.json();
            const settingsStr = JSON.stringify(settings);

            await db.prepare("INSERT INTO products (id, name, category, description, images) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO UPDATE SET description = excluded.description")
                .bind('settings_document', 'System Settings', 'system_settings', settingsStr, '[]')
                .run();

            return new Response(JSON.stringify({ success: true }), {
                headers: { "Content-Type": "application/json" }
            });
        } catch (e) {
            return new Response(JSON.stringify({ error: e.message }), { status: 500 });
        }
    }

    return new Response("Method not allowed", { status: 405 });
}
