var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  active: Boolean,
  verified: Boolean,
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  groups: [String],
  createdOn: {
    type: Date,
    default: Date.now
  },
  deleted: {
    type: Boolean,
    default: false
  },
  deletedOn: Date,
  lastLogin: Date,
  verifyToken: String,
  verifyTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  jwtTokenPassword: String,
  salt: String,
  hash: String
});

UserSchema.index({
  'email': 1
});

module.exports = UserSchema;
