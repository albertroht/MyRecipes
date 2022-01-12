const jwt = require('jsonwebtoken');
require('dotenv').config();

// authentification middleware
module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'no token, authorization denied' });
  }

  try {
    // verify token with jsonwebtoken
    const decoded_payload = jwt.verify(token, process.env.jwtSecret);
    // add user to req
    req.user = decoded_payload.user;
    // call next at the end of middleware if successfull
    next();
  } catch (error) {
    res.status(401).json({ msg: 'token not valid' });
  }
};
