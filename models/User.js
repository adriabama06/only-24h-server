const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        min: 6,
        max: 64
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    date: {
        type: Date,
        default: Date.now
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

module.exports = mongoose.model("User", userSchema, "users");