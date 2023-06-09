const fs = require("fs");
const path = require("path");

const MEDIA_PATH = process.env.MEDIA_PATH ?? "data";

function GetMediaById(media_id) {
    return fs.readdirSync(MEDIA_PATH).find(e => e.startsWith(media_id)) ?? null;
}

function GetMediaPath(media_id) {
    const media_f = GetMediaById(media_id);
    if(!media_f) return null;
    
    const media = path.join(MEDIA_PATH, media_f);

    return fs.existsSync(media) ? media : null;
}

function GetMediaAbsolutePath(media_id) {
    const relative = GetMediaPath(media_id);

    if(!relative) return relative;

    return path.join(__dirname, relative);
}

module.exports = {
    GetMediaById,
    GetMediaPath,
    GetMediaAbsolutePath,
    MEDIA_PATH
}