import crypto from "crypto";

export default function handler(req, res) {
    // Cabeçalhos para permitir CORS
    res.setHeader("Access-Control-Allow-Origin", "https://cmppln.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Método OPTIONS para requisições de pré-voo (CORS)
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const { username, password } = req.body;

    // Credenciais válidas no backend
    const validUser = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    if (username === validUser && password === validPassword) {
        // Criar token temporário para proteger o link do Power BI
        const secretKey = process.env.SECRET_KEY || "chave_secreta";
        const expiresIn = 5 * 60 * 1000; // 5 minutos de validade
        const timestamp = Date.now() + expiresIn;
        const token = crypto
            .createHmac("sha256", secretKey)
            .update(String(timestamp))
            .digest("hex");

        const linkPowerBI = `${process.env.POWER_BI_LINK}?token=${token}&expires=${timestamp}`;

        // Responder com HTML ofuscado
        res.setHeader("Content-Type", "text/html");
        res.status(200).send(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0">
                <title>Relatório Power BI</title>
                <style>
                    html, body {
                        margin: 0;
                        padding: 0;
                        width: 100%;
                        height: 100%;
                        overflow: hidden;
                    }
                    iframe {
                        width: 100%;
                        height: 100%;
                        border: none;
                    }
                </style>
            </head>
            <body>
                <iframe src="${linkPowerBI}" allowfullscreen></iframe>
            </body>
            </html>
        `);
    } else {
        res.status(401).json({ success: false });
    }
}
