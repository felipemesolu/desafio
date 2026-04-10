export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        // Chave única para este projeto dentro do desafio 30/30
        const data = await env.PRODUCTS_KV.get("jullya_catalog");
        return new Response(data || "[]", {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Erro ao ler banco de dados KV" }), { status: 500 });
    }
}

export async function onRequestPost(context) {
    const { env, request } = context;
    
    try {
        const products = await request.json();
        
        // Salva com a chave exclusiva da Jullya
        await env.PRODUCTS_KV.put("jullya_catalog", JSON.stringify(products));
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { "Content-Type": "application/json" }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: "Erro ao salvar no banco de dados KV" }), { status: 500 });
    }
}
