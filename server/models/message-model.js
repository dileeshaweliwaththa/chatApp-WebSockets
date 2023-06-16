const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    threadId: String,
    senderId: String,
    senderName: String,
    content: String,
    createdTime: Date,
    readList: [String]
})

module.exports = mongoose.model('messages', messageSchema)