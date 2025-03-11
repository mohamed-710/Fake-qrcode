import jwt from "jsonwebtoken";
import User from "../model/User.js"; 

export const verifyToken = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select("-password"); 

            if (!req.user) {
                return res.status(404).json({ statusCode: 404, message: "User not found." });
            }

            next();
        } else {
            res.status(401).json({ statusCode: 401, message: "Unauthorized access." });
        }
    } catch (error) {
        res.status(401).json({ statusCode: 401, message: "Invalid token." });
    }
};
