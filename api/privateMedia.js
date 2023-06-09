const { MEDIA_PATH, GetMediaAbsolutePath } = require("../media.js");
const { randomString } = require('../global.js');

const router = require('express').Router();
const path = require('path');
const fs = require("fs");
const Joi = require('@hapi/joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

const schemaPostNew = Joi.object({
    filename: Joi.string().min(1).required(),
    title: Joi.string().min(1).required(),
    subtitle: Joi.string().min(1).required()
});

router.post("/new", async (req, res) => {
    const file_media = req.files.media;
    if(!file_media) return res.status(400).json({ error: "El post tiene que ser de un solo archivo, tiene que llamarse \"media\"" });
    
    const { error } = schemaPostNew.validate(req.query);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const filename = req.query.filename;
    const title = req.query.title;
    const subtitle = req.query.subtitle;

    const media = new Media({
        filename,
        title,
        subtitle,
        author: req.user._id.toString()
    });

    var savedMedia;
    try {
        savedMedia = await media.save();
    } catch (error) {
        return res.status(400).json({ error });
    }

    file_media.mv(
        path.join(
            __dirname,
            "..",
            MEDIA_PATH,
            savedMedia._id + path.extname(filename)
        )
    );

    res.json({
        error: null,
        data: savedMedia
    });
});

router.delete("/:media_id", async (req, res) => {
    const media_id = req.params.media_id;

    var isMedia;
    try {
        isMedia = await Media.findOne({ _id: media_id });
    } catch {}
    if(!isMedia) return res.status(400).json({ error: "Media no encontrada" });

    if(isMedia.author != req.user._id) return res.status(400).json({ error: "No eres el autor del media" });

    try {
        const media = GetMediaAbsolutePath(media_id);
        if(!media) return res.status(400).json({ error: "Media no encontrada en los archivos" });

        fs.unlinkSync(media);
    } catch {
        return res.status(400).json({ error: "Error eliminando el archivo" });
    }

    var media;
    try {
        media = await Media.findOneAndDelete({ _id: media_id });
    } catch {}
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
        error: null,
        data: media
    });
});

module.exports = router;