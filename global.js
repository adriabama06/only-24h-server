const redis = require("redis");
const crypto = require("crypto");

const RedisClient = redis.createClient({
    host: process.env.REDIS_SERVER,
    port: process.env.REDIS_SERVER_PORT
});

RedisClient.on("connect", () => {
    console.log("Conectado a Redis");
});

RedisClient.connect();

function randomString(len = 16) {
    return crypto.randomBytes(16).toString("hex");
}

module.exports = {
    RedisClient,
    randomString
}