function apiKeyMiddleware (req, res, next) {
  const auth = req.headers['authorization']
  if (auth !== 'Bearer aSuperSecretKey') {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

module.exports = apiKeyMiddleware 