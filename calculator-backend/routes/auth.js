const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/cuser');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Register new user

// Register new user
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password, age, homeAddress, primaryColor, secondaryColor, logo } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object with the provided logo URL
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      homeAddress,
      primaryColor,
      secondaryColor,
      logo, // Save the URL directly as the logo field
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      _id: savedUser._id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      email: savedUser.email,
      age: savedUser.age,
      homeAddress: savedUser.homeAddress,
      primaryColor: savedUser.primaryColor,
      secondaryColor: savedUser.secondaryColor,
      logo: savedUser.logo, // Return the logo URL
      token: jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});
// Authenticate user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    const user = await User.findOne({ email });
    console.log(email,password);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      age: user.age,
      homeAddress: user.homeAddress,
      primaryColor: user.primaryColor,
      secondaryColor: user.secondaryColor,
      logo: user.logo,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in user', error });
  }
});

module.exports = router;
