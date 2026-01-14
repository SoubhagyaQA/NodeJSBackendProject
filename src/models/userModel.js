const { required } = require('joi');
const mongoose = require('mongoose');

const userRegisterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone:{ type: String, required: true, unique: true,match: /^[0-9]{10}$/},
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null }
}
);

module.exports = mongoose.model('Users', userRegisterSchema);
