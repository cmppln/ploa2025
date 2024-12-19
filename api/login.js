export default function handler(req, res) {
    // Configurar os cabeçalhos de CORS
    res.setHeader("Access-Control-Allow-Origin", "https://ploa2025.vercel.app");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Responder a requisições OPTIONS (pré-voo do CORS)
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    // Verificar o método POST
    if (req.method !== "POST") {
        res.status(405).json({ success: false, message: "Método não permitido" });
        return;
    }

    const { username, password } = req.body;

    // Credenciais válidas
    const validUser = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    if (username === validUser && password === validPassword) {
        const token = Math.random().toString(36).substring(2); // Token temporário simples
        const linkPowerBI = process.env.POWER_BI_LINK;

        res.status(200).json({ success: true, token, link: linkPowerBI });
    } else {
        res.status(401).json({ success: false, message: "Usuário ou senha inválidos" });
    }
}
