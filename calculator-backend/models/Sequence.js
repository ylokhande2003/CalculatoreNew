const mongoose = require('mongoose');

const sequenceSchema = mongoose.Schema({
  _id: String,
  sequence_value: { type: Number, default: 0 }
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
