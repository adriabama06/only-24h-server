const redis = require("redis");
const crypto = require("crypto");

const RedisClient = redis.createClient({
    host: "192.168.1.153",
    port: 6379
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