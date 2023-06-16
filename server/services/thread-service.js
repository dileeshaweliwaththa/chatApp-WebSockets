const Thread = require('../models/thread-model');

async function updateThreadParticipants(threadId, participants) {
    try {
      await Thread.findOneAndUpdate(
        { threadId },
        { participants, createdTime: Date.now() },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error updating thread participants:', error);
    }
  }

  module.exports = { updateThreadParticipants };
  