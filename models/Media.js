const mongoose = require("mongoose");

const mediaSchema = mongoose.Schema({
    filename: {
        type: String,
        required: true,
        max: 256
    },
    title: {
        type: String,
        required: true,
        max: 256
    },
    subtitle: {
        type: String,
        required: true,
        max: 1024
    },
    author: {
        type: String,
        required: true,
        max: 64
    },
    likes: {
        type: Array,
        required: true,
        default: []
    },
    comments: {
        type: Array,
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => new Date()
    },
    expirationDate: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
    }
}, {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret.__v;
            delete ret._id;
        }
    }
});

module.exports = mongoose.model("Media", mediaSchema, "media");