const { RedisClient, randomString } = require('../global.js');

const router = require('express').Router();
const bcrypt = require("bcrypt");
const Joi = require('joi');

const Users = require('../models/User.js');

const schemaRegister = Joi.object({
    username: Joi.string().min(6).max(64).required(),
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

router.post("/register", async (req, res) => {
    const { error } = schemaRegister.validate(req.body);

    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const isEmailExist = await Users.findOne({ email: req.body.email });
    if (isEmailExist) return res.status(400).json({ error: true, data: "Email already registered" });

    const isUsernameExist = await Users.findOne({ username: req.body.username });
    if (isUsernameExist) return res.status(400).json({ error: true, data: "Username already registered" });

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(req.body.password, salt);

    const user = new Users({
        username: req.body.username,
        email: req.body.email,
        password: password
    });

    try {
        const savedUser = await user.save();

        res.json({
            error: false,
            data: savedUser
        });
    } catch (error) {
        res.status(400).json({ error: true, data: error });
    }
});



const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
});

router.post("/login", async (req, res) => {
    const { error } = schemaLogin.validate(req.body);

    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ error: true, data: "User not found" });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).json({ error: true, data: "Invalid password" });
    
    var token = randomString();

    while((await RedisClient.get(`token:${token}`))) {
        token = randomString();
    }

    await RedisClient.set(`token:${token}`, user._id.toString(), {
        EX: 24 * 60 * 60, NX: true
    });
    // await RedisClient.expire(`token:${token}`, 24 * 60 * 60);
    
    res.header('auth-token', token)
    .json({
        error: false,
        data: {
            token
        }
    });
});

module.exports = router;