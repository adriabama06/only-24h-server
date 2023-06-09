const { GetMediaAbsolutePath } = require("../media.js");

const router = require('express').Router();
const path = require('path');

const Users = require('../models/User.js');
const Media = require('../models/Media.js');

router.get("/:user_id", async (req, res) => {
    const user_id = req.params.user_id;

    var user;
    try {
        user = await Users.findOne({ _id: user_id });
    } catch {}
    if(!user) {
        try {
            user = await Users.findOne({ username: user_id });
        } catch {}
    }

    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    res.json({
        error: null,
        data: user
    });
});

router.get("/:user_id/media", async (req, res) => {
    const user_id = req.params.user_id;

    var user;
    try {
        user = await Users.findOne({ _id: user_id });
    } catch {}
    if(!user) {
        try {
            user = await Users.findOne({ username: user_id });
        } catch {}
    }

    if(!user) return res.status(400).json({ error: "Usuario no encontrado" });

    var media;
    try {
        media = await Media.find({ author: user._id });
    } catch {}

    if(!media || media.length == 0) return res.status(400).json({ error: "Media no encontrada" });

    res.json({
        error: null,
        data: media
    });
});

module.exports = router;