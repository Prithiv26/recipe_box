module.exports = (err, req, res, next) => {
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    if (['JsonWebTokenError','TokenExpiredError'].includes(err.name)) return res.status(401).json({ error: err.message });
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  };