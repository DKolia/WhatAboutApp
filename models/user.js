const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


// This is User Schemas
const UserScema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  name: {
    type: String
  },
  facebook: {
    type: String
  },
  twitter: {
    type: String
  },
  instagram: {
    type: String
  },
  youtube: {
    type: String
  },
  linkedin: {
    type: String
  },
  googleplus: {
    type: String
  },
  pinterest: {
    type: String
  },
  tumblr: {
    type: String
  },
  snapchat: {
    type: String
  },
  reddit: {
    type: String
  },
  flickr: {
    type: String
  },
  misc1: {
    type: String
  },
  misc2: {
    type: String
  },
  misc3r: {
    type: String
  }
});

const User = module.exports = mongoose.model('User', UserScema);

// Methods for User Schema including create, finding by username, by ID and checking passwords
module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.getUserByUsername = function(username, callback){
  const query = {username: username};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if(err) throw err;
    callback(null, isMatch);
  });
}
