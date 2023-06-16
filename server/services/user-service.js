const User = require('../models/user-model');

async function createUser(personName) {
    try {
      const user = new User({
        name: personName
      });

      const savedUser = await user.save();
      console.log('User created:', savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
  
  module.exports = { createUser };