const mongoose = require('mongoose')

const threadSchema = mongoose.Schema({
    threadId: String,
    participants: [String],
    createdTime: {
        type: Date,
        default: Date.now
      }
})

module.exports = mongoose.model('threads', threadSchema)