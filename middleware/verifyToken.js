const { RedisClient } = require('../global.js');
const User = require('../models/User.js');

// middleware to validate token (rutas protegidas)
const verifyToken = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) return res.status(401).json({ error: true, data: "Token is needed in the 'auth-token' header" });

    const userId = await RedisClient.get(`token:${token}`);

    if(!userId) return res.status(400).json({ error: true, data: "Token is invalid" });

    await RedisClient.expire(`token:${token}`, 24 * 60 * 60);

    var isUserExist = undefined;
    try {
        isUserExist = await User.findOne({ _id: userId });
    } catch {
        return res.status(400).json({ error: true, data: "Token is invalid or expired" });
    }
    
    req.user = isUserExist;

    next();
}

module.exports = verifyToken;