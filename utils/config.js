const config = {
  API_KEY: 'aSuperSecretKey',
  API_URL: 'https://echo-serv.tbxnet.com/v1/secret',
  CORS_ORIGINS: ['http://localhost:3001', 'https://toolboxfront.vercel.app'],
  PORT: process.env.PORT || 3000
}

module.exports = config; 