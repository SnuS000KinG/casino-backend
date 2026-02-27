// v2/middleware/authV2.middleware.js
const jwt = require('jsonwebtoken');
const UserV2 = require('../models/User'); // <--- ВАЖНО: ссылаемся на  модель

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        return next();
    }
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Auth token is required." });
        }
        
        const token = authHeader.split(' ')[1];
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        // Проверка версии сессии - это отличная практика!
        const userFromDb = await UserV2.findById(decodedData.id).select('sessionTokenVersion roles');
        if (!userFromDb) {
            return res.status(401).json({ message: "User not found." });
        }
        if (userFromDb.sessionTokenVersion !== decodedData.sessionTokenVersion) {
            return res.status(401).json({ message: "Session expired. Please log in again." });
        }
        
        // Прикрепляем к запросу не только декодированные данные, а реальные
        req.user = {
            id: userFromDb._id.toString(),
            roles: userFromDb.roles // <--- Берем актуальные роли из БД
        };
        next();
    } catch (e) {
        console.error("Auth  Error:", e.message);
        return res.status(401).json({ message: "Invalid token." });
    }
};