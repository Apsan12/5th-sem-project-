import jwt from "jsonwebtoken";
export default function verifyToken(req, res, next) {
    const token = req.headers.authorization ?? "";
    if (!token || token === "")
        return res.status(404).json({ message: "Token is missing" });
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(403).json({ message: err.message });
        }
        req.userId = decoded;
        next();
    });
}
//# sourceMappingURL=jwtVerify.js.map