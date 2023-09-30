require("dotenv").config();

const PORT = process.env.PORT;


const fs = require("fs");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const mongoose = require("mongoose");

const APIauthRoutes = require("./api/auth.js");
const APImediaRoutes = require("./api/media.js");
const APIuserRoutes = require("./api/user.js");

const verifyToken = require("./middleware/verifyToken.js");

const APIPrivateMediaRoutes = require("./api/privateMedia.js");
const APIPrivateCommentsRoutes = require("./api/privateComments.js");



const uri = `mongodb://${process.env.MONGO_SERVER}/?retryWrites=true&w=majority`;
mongoose.connect(uri, {
    dbName: process.env.MONGO_DATABASE,

    user: process.env.MONGO_USERNAME,
    pass: process.env.MONGO_PASSWORD,
    
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=> console.log("Conectado a MongoDB"))
.catch((err) => {
    console.log(err);
    console.log("Error al conectar a mongodb");
    process.exit();
});

const app = express();

app.disable("x-powered-by");

app.use(express.json());

for(const f of fs.readdirSync("tmp")) {
    fs.unlinkSync(path.join("tmp", f));
}

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
    useTempFiles : true,
    tempFileDir : "./tmp",
    safeFileNames: true
}));

app.use("/api/auth", APIauthRoutes);
app.use("/api/media", APImediaRoutes);
app.use("/api/user", APIuserRoutes);

app.use("/api/media", verifyToken, APIPrivateMediaRoutes);
app.use("/api/media", verifyToken, APIPrivateCommentsRoutes);

app.get("/ping", async (req, res) => {
    res.send("pong");
});


app.listen(PORT, () => {
    console.log(`Ready at: ${PORT} version: v${require("./package.json").version}`);
});