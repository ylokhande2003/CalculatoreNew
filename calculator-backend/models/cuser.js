const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true, minlength: 3, maxlength: 15 },
  lastName: { type: String, maxlength: 15 },
  email: { type: String, required: true, unique: true, minlength: 5, maxlength: 50 },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true, min: 10, max: 115 },
  homeAddress: { type: String, required: true, minlength: 10, maxlength: 100 },
  primaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
  secondaryColor: { type: String, required: true, minlength: 3, maxlength: 10 },
  logo: { type: String, required:false, minlength: 10, maxlength: 500 },
}, { timestamps: true });

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
