export default function handler(req, res) {
    // Cabeçalhos para permitir CORS
    res.setHeader("Access-Control-Allow-Origin", "https://cmppln.github.io");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    // Método OPTIONS para lidar com requisições de pré-voo (CORS)
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }

    const { username, password } = req.body;

    // Credenciais válidas no backend
    const validUser = process.env.USERNAME;
    const validPassword = process.env.PASSWORD;

    // Validação das credenciais
    if (username === validUser && password === validPassword) {
        // Responder com HTML para um iframe do Power BI ao invés do link diretamente
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
                <iframe src="${process.env.POWER_BI_LINK}" allowfullscreen></iframe>
            </body>
            </html>
        `);
    } else {
        res.status(401).json({ success: false });
    }
}
