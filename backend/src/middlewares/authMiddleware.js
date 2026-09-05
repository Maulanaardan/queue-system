import jwt from "jsonwebtoken";
import "dotenv/config";
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token tidak ada" });
        return;
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(403).json({ message: "Token tidak valid" });
            return;
        }
        req.user = decoded;
        next();
    });
}
