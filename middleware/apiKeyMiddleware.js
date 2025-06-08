const config = require('../utils/config');

function apiKeyMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization header' });
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || token !== config.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
}

module.exports = apiKeyMiddleware; 