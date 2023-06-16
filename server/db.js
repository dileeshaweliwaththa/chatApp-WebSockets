const mongoose = require('mongoose');

const url = 'mongodb://127.0.0.1:27017/testChat';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB', url);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
};

module.exports = connectToDatabase;
