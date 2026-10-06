require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/orkestrim',
  JWT_SECRET: process.env.JWT_SECRET || 'orkestrim_jwt_secret_default'
};
