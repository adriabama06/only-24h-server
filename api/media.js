const { GetMediaAbsolutePath, ToDeleteMedia } = require("../media.js");

const router = require('express').Router();
const path = require('path');
const Joi = require('@hapi/joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:mediaId", async (req, res, next) => {
    const mediaId = req.params.mediaId;

    if(mediaId === "last") return next();
    if(mediaId === "search") return next();

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media no encontrada" });

    if(Date.now() - media.createdAt >= media.deleteAfter) {
        ToDeleteMedia([media._id]);
        return res.status(400).json({ error: true, data: "Media no encontrada" });
    }

    res.json({
        error: false,
        data: media
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

    const media = await Media.find().sort({ "date": -1 }).skip(skipCount).limit(resultsPerPage);

    return res.json({
        error: false,
        data: media
    });
});

router.get("/:mediaId/view", async (req, res) => {
    const mediaId = req.params.mediaId;

    var isMediaExist;
    try {
        isMediaExist = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!isMediaExist) return res.status(400).json({ error: true, data: "Media no encontrada" });

    const media = GetMediaAbsolutePath(mediaId);
    if(!media) return res.status(400).json({ error: true, data: "Media no encontrada en los archivos" });

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

    const media = await Media.find({
        $or: [
            { filename: { $regex: searchTerms, $options: "i" } },
            { title: { $regex: searchTerms, $options: "i" } },
            { subtitle: { $regex: searchTerms, $options: "i" } },
            { author: { $regex: searchTerms, $options: "i" } }
        ]
    }).sort({ "date": sort }).skip(skipCount).limit(resultsPerPage);

    return res.json({
        error: false,
        data: media
    });
});

module.exports = router;