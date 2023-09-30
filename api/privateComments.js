const { randomString } = require('../global.js');

const router = require('express').Router();
const path = require('path');
const fs = require("fs");
const Joi = require('joi');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

const schemaPostComment = Joi.object({
    content: Joi.string().min(1).required(),
});

router.post("/:mediaId/comment", async (req, res) => {
    const mediaId = req.params.mediaId;

    const { error } = schemaPostComment.validate(req.body);
    if (error) return res.status(400).json({ error: true, data: error.details[0].message });

    const content = req.body.content;

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    var id = randomString();
    
    while(media.comments.find(c => c.id == id)) {
        id = randomString();
    }

    media.comments.push({
        id,
        author: req.user._id,
        content,
        createdAt: new Date()
    });

    try {
        await media.save();

        res.json({
            error: false,
            data: media.comments
        });
    } catch (error) {
        res.status(400).json({ error: true, data: error });
    }
});

router.delete("/:mediaId/comment/:commentId", async (req, res) => {
    const mediaId = req.params.mediaId;
    const commentId = req.params.commentId;

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    media.comments = media.comments.filter(c => c.id != commentId);

    try {
        await media.save();

        res.json({
            error: false,
            data: media.comments
        });
    } catch (error) {
        res.status(400).json({ error: true, data: error });
    }
});

module.exports = router;