const { instrument } = require("@socket.io/admin-ui")

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
var server = http.createServer(app)
var io = require("socket.io")(server, {
    origins: ["https://admin.socket.io/", "http://localhost:3000"]
});

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
    // console.log("connected" + socket.id);
    socket.on("join", (documentId) => {
        console.log("joined");
        socket.join(documentId);
    });

    socket.on("typing", (data) => {
        // console.log(data);
        socket.broadcast.to(data.room).emit("changes", data);
    })

    socket.on("save", (data) => {
        // console.log(data);
        saveData(data);
    })
})

const saveData = async (data) => {
    let document = await Document.findById(data.room);
    document.content = data.delta;
    document.save();
}

server.listen(PORT, "0.0.0.0", () => console.log(`Example app listening on port ${PORT}!`))

instrument(io, {
    auth: false,
    mode: "development",
})