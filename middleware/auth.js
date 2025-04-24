const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req, res, next) => {
  const auth = req.get('Authorization');
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ error: 'token missing' });
  try {
    const { id } = jwt.verify(auth.slice(7), process.env.JWT_SECRET, { maxAge: '60m' });
    req.user = await User.findById(id);
    next();
  } catch (err) { next(err); }
};