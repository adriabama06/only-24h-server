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

router.post("/:media_id/comment", async (req, res) => {
    const media_id = req.params.media_id;

    const { error } = schemaPostComment.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const content = req.body.content;

    var media;
    try {
        media = await Media.findOne({ _id: media_id });
    } catch {}
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

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
    if(!isMediaUpdated) return res.status(400).json({ error: "Error al añadir el comentario" });

    res.json({
        error: null,
        data: media
    });
});

router.delete("/:media_id/comment/:comment_id", async (req, res) => {
    const media_id = req.params.media_id;
    const comment_id = req.params.comment_id;

    var media;
    try {
        media = await Media.findOne({ _id: media_id });
    } catch {}
    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    media.comments = media.comments.filter(c => c.id != comment_id);

    var isMediaUpdated;
    try {
        isMediaUpdated = await Media.updateOne({ _id: media._id }, { comments: media.comments });
    } catch {}
    if(!isMediaUpdated) return res.status(400).json({ error: "Error al borrar el comentario" });

    res.json({
        error: null,
        data: media
    });
});

module.exports = router;