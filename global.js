const redis = require("redis");
const crypto = require("crypto");

const RedisClient = redis.createClient({
    url: `redis://${process.env.REDIS_SERVER}:${process.env.REDIS_SERVER_PORT}`
});

RedisClient.on("connect", () => {
    console.log("Conectado a Redis");
});

RedisClient.connect();

function randomString(len = 16) {
    return crypto.randomBytes(len).toString("hex");
}

module.exports = {
    RedisClient,
    randomString
}