const fs = require("fs");
const path = require("path");

const Media = require('./models/Media.js');

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

function DeleteMedia(mediaId) {
    const absolute = GetMediaAbsolutePath(mediaId);

    if(!absolute) return absolute;

    fs.unlinkSync(absolute);
    return absolute;
}

function FilterMedia(media) {
    const currentTime = Date.now();
    var toDelete = [];

    var newMedia = media.filter((m) => {
        if(currentTime - m.createdAt >= m.deleteAfter) {
            toDelete.push(m._id);
            return false;
        }
        return true;
    });

    return [newMedia, toDelete];
}

async function ToDeleteMedia(toDelete) {
    if(toDelete.length > 0) {
        await Promise.all([
            ...toDelete.map(m => DeleteMedia(m)),
            Media.deleteMany({ _id: { $in: toDelete } })
        ]);
    }
}

function CheckTime(media, time = Date.now()) {
    return (time - media.createdAt) > media.deleteAfter
}

module.exports = {
    GetMediaById,
    GetMediaPath,
    GetMediaAbsolutePath,
    DeleteMedia,
    FilterMedia,
    ToDeleteMedia,
    CheckTime,
    MEDIA_PATH
}