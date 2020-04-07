const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongoHost: process.env.MONGO_HOST,
  mongoDatabase: process.env.MONGO_DATABASE,
};