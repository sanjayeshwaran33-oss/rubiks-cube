const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6
    },
    college: {
      type: String,
      default: 'SRM Valliammai Engineering College'
    },
    role: {
      type: String,
      enum: ['delegate', 'coordinator', 'admin'],
      default: 'delegate'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
