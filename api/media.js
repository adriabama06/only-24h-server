const { GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:media_id", async (req, res) => {
    const media_id = req.params.media_id;

    if(media_id === "last") {
        const media = await Media.find().sort({ "date": -1 }).limit(25);
    
        return res.json({
            error: null,
            data: media
        });
    }

    var media;
    try {
        media = await Media.findOne({ _id: media_id });
    } catch {}
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
        error: null,
        data: media
    });
});

router.get("/:media_id/view", async (req, res) => {
    const media_id = req.params.media_id;

    var isMediaExist;
    try {
        isMediaExist = await Media.findOne({ _id: media_id });
    } catch {}
    if(!isMediaExist) return res.status(400).json({ error: "Media no encontrada" });

    const media = GetMediaAbsolutePath(media_id);
    if(!media) return res.status(400).json({ error: "Media no encontrada en los archivos" });

    res.sendFile(media);
});

module.exports = router;