const fs = require("fs");
const path = require("path");

const MEDIA_PATH = process.env.MEDIA_PATH ?? "data";

function GetMediaById(mediaId) {
    return fs.readdirSync(MEDIA_PATH).find(e => e.startsWith(mediaId)) ?? null;
}

function GetMediaPath(mediaId) {
    const mediaFile = GetMediaById(mediaId);
    if(!mediaFile) return null;
    
    const media = path.join(MEDIA_PATH, mediaFile);

    return fs.existsSync(media) ? media : null;
}

function GetMediaAbsolutePath(mediaId) {
    const relative = GetMediaPath(mediaId);

    if(!relative) return relative;

    return path.join(__dirname, relative);
}

module.exports = {
    GetMediaById,
    GetMediaPath,
    GetMediaAbsolutePath,
    MEDIA_PATH
}