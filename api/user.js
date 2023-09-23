const { GetMediaAbsolutePath, DeleteMedia, FilterMedia, ToDeleteMedia } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:userId", async (req, res, next) => {
    const userId = req.params.userId;

    if(req.query.u) return next();

    var user;
    try {
        user = await Users.findOne({ _id: userId });
    } catch {}

    if(!user) return res.status(400).json({ error: true, data: "Usuario no encontrado" });

    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    res.json({
        error: false,
        data: filter_data
    });
});

router.get("/username", async (req, res) => {
    const username = req.query.u;

    if(!username) return res.status(400).json({ error: true, data: "En la query falta username como \"u\"" });

    var user;
    try {
        user = await Users.findOne({ username });
    } catch {}
    

    if(!user) return res.status(400).json({ error: true, data: "Usuario no encontrado" });

    
    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    res.json({
        error: false,
        data: filter_data
    });
});

router.get("/:user_id/media", async (req, res) => {
    const user_id = req.params.user_id;

    var user;
    try {
        user = await Users.findOne({ _id: user_id });
    } catch {}

    if(!user) return res.status(400).json({ error: true, data: "Usuario no encontrado" });

    var media;
    try {
        media = await Media.find({ author: user._id });
    } catch {}

    if(!media) return res.status(400).json({ error: true, data: "Media no encontrada" });

    var [newMedia, toDelete] = FilterMedia(media);

    res.json({
        error: false,
        data: newMedia
    });

    ToDeleteMedia(toDelete);
});

module.exports = router;