const jwt = require('jsonwebtoken');
const User = require('../models/cuser');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = await User.findById(user.id); // Fetch user by ID from the token
    next();
  });
};

module.exports = authenticateToken;
