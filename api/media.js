const { GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:mediaId", async (req, res) => {
    const usersPerPage = 50;

    const mediaId = req.params.mediaId;
    const pageNumber = req.query.pageNumber ?? 1;

    if(mediaId === "last") {
        const skipCount = (pageNumber - 1) * usersPerPage;

        const media = await Media.find().sort({ "date": -1 }).skip(skipCount).limit(usersPerPage);
    
        return res.json({
            error: null,
            data: media
        });
    }

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
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