const cors = require('cors');

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

module.exports = cors({
  origin: process.env.NODE_ENV === 'production' ? '*' : allowedOrigins,
  credentials: true
});
