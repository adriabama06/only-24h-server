const { GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const fs = require('fs');
const Joi = require('joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');
const { RedisClient } = require("../global.js");

router.get("/:mediaId", async (req, res, next) => {
    const mediaId = req.params.mediaId;

    if(mediaId === "last") return next();
    if(mediaId === "search") return next();

    const cached = await RedisClient.get(`req:/media/${mediaId}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    await RedisClient.set(`req:/media/${mediaId}`, JSON.stringify({ error: false, data: media }), { EX: 2 * 60, NX: true });

    res.json({
        error: false,
        data: media
    });
});

router.get("/:mediaId/time", async (req, res, next) => {
    const mediaId = req.params.mediaId;

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    const now = new Date();

    const elapsedTime = now - media.createdAt;
    const timeRemaining = media.expirationDate - now;

    res.json({
        error: false,
        data: {
            elapsedTime,
            timeRemaining,
            createdAt: media.createdAt,
            expirationDate: media.expirationDate
        }
    });
});

const schemaLast = Joi.object({
    pageNumber: Joi.number().optional()
});

router.get("/last", async (req, res) => {
    const { error } = schemaLast.validate(req.query);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const resultsPerPage = 50;
    const pageNumber = parseInt(req.query.pageNumber) ?? 1;

    const skipCount = (pageNumber - 1) * resultsPerPage;

    const cached = await RedisClient.get(`req:/media/last/${pageNumber}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    const medias = await Media.find().sort({ "date": -1 }).skip(skipCount).limit(resultsPerPage);

    await RedisClient.set(`req:/media/last/${pageNumber}`, JSON.stringify({ error: false, data: medias }), { EX: 5, NX: true });

    return res.json({
        error: false,
        data: medias
    });
});

router.get("/:mediaId/view", async (req, res) => {
    const mediaId = req.params.mediaId;

    const cached = await RedisClient.get(`req:/media/${mediaId}/view`);

    if(cached) {
        if(fs.existsSync(cached)) {
            return res.sendFile(cached);
        }
    }

    var isMediaExist;
    try {
        isMediaExist = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!isMediaExist) return res.status(400).json({ error: true, data: "Media not found" });

    const media = GetMediaAbsolutePath(mediaId);
    if(!media) return res.status(400).json({ error: true, data: "Media not found in files" });

    await RedisClient.set(`req:/media/${mediaId}/view`, media, { EX: 5, NX: true });

    res.sendFile(media);
});

const schemaSearch = Joi.object({
    q: Joi.string().min(1).max(256).required(),
    pageNumber: Joi.number().optional(),
    sort: Joi.number().optional()
});

router.get("/search", async (req, res) => {
    const { error } = schemaSearch.validate(req.query);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const resultsPerPage = 50;
    const searchTerms = req.query.q;
    const pageNumber = parseInt(req.query.pageNumber) ?? 1;
    const sort = parseInt(req.query.sort) ?? -1;

    const skipCount = (pageNumber - 1) * resultsPerPage;

    const cached = await RedisClient.get(`req:/media/search/${searchTerms}/${pageNumber}/${sort}`);

    if(cached) {
        return res.contentType("application/json; charset=utf-8").send(cached);
    }

    const media = await Media.find({
        $or: [
            { filename: { $regex: searchTerms, $options: "i" } },
            { title: { $regex: searchTerms, $options: "i" } },
            { subtitle: { $regex: searchTerms, $options: "i" } },
            { author: { $regex: searchTerms, $options: "i" } }
        ]
    }).sort({ "date": sort }).skip(skipCount).limit(resultsPerPage);

    await RedisClient.set(`req:/media/search/${searchTerms}/${pageNumber}/${sort}`, JSON.stringify({ error: false, data: media }), { EX: 2 * 60, NX: true });

    return res.json({
        error: false,
        data: media
    });
});

module.exports = router;