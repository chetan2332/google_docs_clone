const express = require('express')
const mongoose = require("mongoose")
require("dotenv").config()
const cors = require("cors")
const http = require("http")
const authRouter = require("./routes/auth")
const Document = require("./models/document")
const documentRouter = require("./routes/document")
const morgan = require("morgan")

const app = express();
const PORT = process.env.PORT;
var server = app.listen(PORT, "0.0.0.0", () => console.log(`Example app listening on port ${PORT}!`))
var io = require("socket.io")(server);

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(authRouter);
app.use(documentRouter);

mongoose.connect(process.env.MONGO_DB).then(() => {
    console.log("connection successfull!");
}).catch((err) => {
    console.log(err)
})

io.on("connection", (socket) => {
    socket.on("join", (documentId) => {
        socket.join(documentId);
    });

    socket.on("typing", (data) => {
        socket.broadcast.to(data.room).emit("changes", data);
    })

    socket.on("save", (data) => {
        saveData(data);
    })
})

const saveData = async (data) => {
    let document = await Document.findById(data.room);
    document.content = data.delta;
    document.save();
}