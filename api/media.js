const { GetMediaAbsolutePath, ToDeleteMedia } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:mediaId", async (req, res, next) => {
    const mediaId = req.params.mediaId;

    if(mediaId === "last") return next();

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

router.get("/last", async (req, res) => {
    const usersPerPage = 50;
    const pageNumber = req.query.pageNumber ?? 1;

    const skipCount = (pageNumber - 1) * usersPerPage;

    const media = await Media.find().sort({ "date": -1 }).skip(skipCount).limit(usersPerPage);

    return res.json({
        error: null,
        data: media
    });
});

router.get("/:mediaId/view", async (req, res) => {
    const mediaId = req.params.mediaId;

    var isMediaExist;
    try {
        isMediaExist = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!isMediaExist) return res.status(400).json({ error: "Media no encontrada" });

    const media = GetMediaAbsolutePath(mediaId);
    if(!media) return res.status(400).json({ error: "Media no encontrada en los archivos" });

    res.sendFile(media);
});

module.exports = router;