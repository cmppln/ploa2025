import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    // Cabeçalhos para permitir CORS
    res.setHeader("Access-Control-Allow-Origin", "https://ploa2025.vercel.app");
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
        // Criar token JWT para proteger o link do Power BI
        const secretKey = process.env.SECRET_KEY || "chave_secreta";
        const expiresIn = '5m'; // 5 minutos de validade

        // Criar o payload com o link do Power BI
        const payload = {
            link: process.env.POWER_BI_LINK
        };

        // Gerar o token JWT
        const token = jwt.sign(payload, secretKey, { expiresIn });

        // Responder com HTML ofuscado, com o token JWT
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
                <iframe src="/api/proxy?token=${token}" allowfullscreen></iframe>
            </body>
            </html>
        `);
    } else {
        res.status(401).json({ success: false });
    }
}
