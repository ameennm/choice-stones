export async function onRequest(context) {
    const { env } = context;
    const envKeys = Object.keys(env);
    return new Response(JSON.stringify({
        message: "Debug Info",
        envKeys: envKeys,
        hasDB: envKeys.includes('DB') || envKeys.includes('CHOICE_DB')
    }), {
        headers: { "Content-Type": "application/json" }
    });
}
