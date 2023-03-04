const mongoose = require("mongoose");

const documentSchema = mongoose.Schema({
    uid: {
        required: true,
        type: String,
    },
    createdAt: {
        required: true,
        type: Number,
    },
    title: {
        type: String,
        required: true,
        trum: true
    },
    content: {
        type: Array,
        default: [],
    }
})

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;