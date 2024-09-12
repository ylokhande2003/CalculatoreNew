const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  _id: Number,
  expression: { type: String, required: true },
  isValid: { type: Boolean, required: true },
  output: { type: Number },
  createdOn: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
