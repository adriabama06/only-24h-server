const { MEDIA_PATH, GetMediaAbsolutePath } = require("../media.js");
const { randomString } = require('../global.js');

const router = require('express').Router();
const path = require('path');
const fs = require("fs");
const Joi = require('@hapi/joi');

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

    if(Date.now() - media.createdAt >= media.deleteAfter) {
        ToDeleteMedia([media._id]);
        return res.status(400).json({ error: true, data: "Media not found" });
    }

    var comments = media.comments;
    var id = randomString();
    
    while(comments.find(c => c.id == id)) {
        id = randomString();
    }

    comments.push({
        id,
        author: req.user._id,
        content,
        createdAt: new Date()
    });

    var isMediaUpdated;
    try {
        isMediaUpdated = await Media.updateOne({ _id: media._id }, { comments });
    } catch {}
    if(!isMediaUpdated) return res.status(400).json({ error: true, data: "Error adding comment" });

    res.json({
        error: false,
        data: media
    });
});

router.delete("/:mediaId/comment/:commentId", async (req, res) => {
    const mediaId = req.params.mediaId;
    const commentId = req.params.commentId;

    var media;
    try {
        media = await Media.findOne({ _id: mediaId });
    } catch {}
    if(!media) return res.status(400).json({ error: true, data: "Media not found" });

    if(Date.now() - media.createdAt >= media.deleteAfter) {
        ToDeleteMedia([media._id]);
        return res.status(400).json({ error: true, data: "Media not found" });
    }

    media.comments = media.comments.filter(c => c.id != commentId);

    var isMediaUpdated;
    try {
        isMediaUpdated = await Media.updateOne({ _id: media._id }, { comments: media.comments });
    } catch {}
    if(!isMediaUpdated) return res.status(400).json({ error: true, data: "Error deleting comment" });

    res.json({
        error: false,
        data: media
    });
});

module.exports = router;