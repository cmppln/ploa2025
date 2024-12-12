import jwt from 'jsonwebtoken';

export default function handler(req, res) {
    const { token } = req.query;

    // Chave secreta para verificar o token
    const secretKey = process.env.SECRET_KEY || "chave_secreta";

    try {
        // Verificar e decodificar o token
        const decoded = jwt.verify(token, secretKey);
        
        // Redirecionar para o Power BI
        res.redirect(decoded.link);
    } catch (error) {
        res.status(401).json({ success: false, message: "Token inválido ou expirado" });
    }
}
