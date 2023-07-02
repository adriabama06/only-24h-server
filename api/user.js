const { GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;

    var user;
    try {
        user = await Users.findOne({ _id: userId });
    } catch {}
    if(!user) {
        try {
            user = await Users.findOne({ username: userId });
        } catch {}
    }

    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    res.json({
        error: null,
        data: filter_data
    });
});

router.get("/username", async (req, res) => {
    const username = req.query.u;

    if(!username) return res.status(400).json({ error: "En la query falta username como \"u\"" });

    var user;
    try {
        user = await Users.findOne({ username });
    } catch {}
    

    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    
    var filter_data = {
        username: user.username,
        date: user.date,
        id: user._id
    };

    res.json({
        error: null,
        data: filter_data
    });
});

router.get("/:user_id/media", async (req, res) => {
    const user_id = req.params.user_id;

    var user;
    try {
        user = await Users.findOne({ _id: user_id });
    } catch {}

    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    var media;
    try {
        media = await Media.find({ author: user._id });
    } catch {}

    if(!media) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
        error: null,
        data: media
    });
});

module.exports = router;