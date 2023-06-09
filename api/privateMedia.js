const { MEDIA_PATH, GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const path = require('path');
const fs = require("fs");

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.post("/new", async (req, res) => {
    const file_media = req.files.media;
    const filename = req.query.filename;
    const title = req.query.title;
    const subtitle = req.query.subtitle;

    if(!file_media) return res.status(400).json({ error: "El post tiene que ser de un solo archivo, tiene que llamarse media" });
    if(!title) return res.status(400).json({ error: "Falta title en query" });
    if(!subtitle) return res.status(400).json({ error: "Falta subtitle en query" });
    if(!filename) return res.status(400).json({ error: "Falta filename en query" });

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

    try {
        const media = GetMediaAbsolutePath(media_id);
        if(!media) return res.status(400).json({ error: "Media no encontrada en los archivos" });

        fs.unlinkSync(media);
    } catch {
        return res.status(400).json({ error: "Error eliminando el archivo" });
    }

    const media = await Media.findOneAndDelete({ _id: media_id });
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
        error: null,
        data: media
    });
});

module.exports = router;