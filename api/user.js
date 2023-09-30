const { GetMediaAbsolutePath, DeleteMedia, FilterMedia, ToDeleteMedia } = require("../media.js");

const router = require('express').Router();
const path = require('path');
const Joi = require('joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');
const { RedisClient } = require("../global.js");

router.get("/:userId", async (req, res, next) => {
    const userId = req.params.userId;

    if(req.query.u) return next();

    const cached = await RedisClient.get(`req:/user/${userId}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    var user;
    try {
        user = await Users.findOne({ _id: userId });
    } catch {}

    if(!user) return res.status(400).json({ error: true, data: "User not found" });

    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    await RedisClient.set(`req:/user/${userId}`, JSON.stringify({ error: false, data: filter_data }), { EX: 2 * 60, NX: true });

    res.json({
        error: false,
        data: filter_data
    });
});

const schemaUsername = Joi.object({
    u: Joi.string().min(1).max(256).required(),
});

router.get("/username", async (req, res) => {
    const { error } = schemaUsername.validate(req.query);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const username = req.query.u;

    const cached = await RedisClient.get(`req:/user/username/${username}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    var user;
    try {
        user = await Users.findOne({ username: { $regex: username, $options: "i" } });
    } catch {}
    

    if(!user) return res.status(400).json({ error: true, data: "User not found" });

    
    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    await RedisClient.set(`req:/user/username/${username}`, JSON.stringify({ error: false, data: filter_data }), { EX: 2 * 60, NX: true });

    res.json({
        error: false,
        data: filter_data
    });
});

const schemaSearch = Joi.object({
    u: Joi.string().min(1).max(256).required(),
    pageNumber: Joi.number().optional(),
    sort: Joi.number().optional()
});

router.get("/search", async (req, res) => {
    const { error } = schemaSearch.validate(req.query);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const resultsPerPage = 50;
    const username = req.query.u;
    const pageNumber = parseInt(req.query.pageNumber) ?? 1;
    const sort = parseInt(req.query.sort) ?? -1;

    const skipCount = (pageNumber - 1) * resultsPerPage;

    const cached = await RedisClient.get(`req:/user/search/${username}/${pageNumber}/${sort}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    var users = await Users.find({
        username: { $regex: username, $options: "i" }
    }).sort({ "date": sort }).skip(skipCount).limit(resultsPerPage);
    

    var filter_data = users.map(u => {
        return {
            username: u.username,
            date: u.date,
            id: u._id
        }
    });

    await RedisClient.set(`req:/user/search/${username}/${pageNumber}/${sort}`, JSON.stringify({ error: false, data: filter_data }), { EX: 2 * 60, NX: true });

    res.json({
        error: false,
        data: filter_data
    });
});

router.get("/:userId/media", async (req, res) => {
    const userId = req.params.userId;

    const cached = await RedisClient.get(`req:/user/${userId}/media`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    var user;
    try {
        user = await Users.findOne({ _id: userId });
    } catch {}

    if(!user) return res.status(400).json({ error: true, data: "User not found" });

    var media;
    try {
        media = await Media.find({ author: user._id });
    } catch {}

    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    var [newMedia, toDelete] = FilterMedia(media);

    await RedisClient.set(`req:/user/${userId}/media`, JSON.stringify({ error: false, data: newMedia }), { EX: 2 * 60, NX: true });

    res.json({
        error: false,
        data: newMedia
    });

    ToDeleteMedia(toDelete);
});

module.exports = router;