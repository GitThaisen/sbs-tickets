const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoHost: process.env.MONGO_HOST,
};