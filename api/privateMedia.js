const { MEDIA_PATH, GetMediaAbsolutePath } = require("../media.js");
const { randomString } = require('../global.js');

const router = require('express').Router();
const path = require('path');
const fs = require("fs");
const Joi = require('joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

const schemaPostNew = Joi.object({
    filename: Joi.string().min(1).max(256).required(),
    title: Joi.string().min(1).max(256).required(),
    subtitle: Joi.string().min(1).max(1024).required()
});

router.post("/new", async (req, res) => {
    const fileMedia = req.files.media;
    if(!fileMedia) return res.status(400).json({ error: true, data: "The post must be a single file, it must be called \"media\"" });
    
    const { error } = schemaPostNew.validate(req.query);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

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
        return res.status(400).json({ error: true, data: error });
    }

    fileMedia.mv(
        path.join(__dirname, "..", MEDIA_PATH, savedMedia._id + path.extname(filename))
    );

    res.json({
        error: false,
        data: savedMedia
    });
});

router.get("/:mediaId/like", async (req, res) => {
    const mediaId = req.params.mediaId;
    const userId = req.user._id.toString();

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    if(media.likes.includes(userId)) return res.status(400).json({ error: true, data: "User already liked this media" });

    media.likes.push(userId);

    try {
        await media.save();

        res.json({
            error: false,
            data: media.likes
        });
    } catch (error) {
        res.status(400).json({ error: true, data: error });
    }
});

router.get("/:mediaId/unlike", async (req, res) => {
    const mediaId = req.params.mediaId;
    const userId = req.user._id.toString();

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    if(!media.likes.includes(userId)) return res.status(400).json({ error: true, data: "User has not liked this media" });

    media.likes = media.likes.filter(id => id != userId);

    try {
        await media.save();

        res.json({
            error: false,
            data: media.likes
        });
    } catch (error) {
        res.status(400).json({ error: true, data: error });
    }
});

router.delete("/:mediaId", async (req, res) => {
    const mediaId = req.params.mediaId;

    var isMedia;
    try {
        isMedia = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!isMedia) return res.status(400).json({ error: true, data: "Media not found" });

    if(isMedia.author != req.user._id) return res.status(400).json({ error: true, data: "You are not the author of the media" });

    try {
        const media = GetMediaAbsolutePath(mediaId);
        if(!media) return res.status(400).json({ error: true, data: "Media not found in files" });

        fs.unlinkSync(media);
    } catch {
        return res.status(400).json({ error: true, data: "Error deleting file" });
    }

    var media;
    try {
        media = await Media.findOneAndDelete({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    res.json({
        error: false,
        data: media
    });
});

module.exports = router;