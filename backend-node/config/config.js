require('dotenv').config();

module.exports = {
  development: {
    username: process.env.user_name,
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'foodtaste',
    host: '127.0.0.1',
    dialect: 'mysql',
  },
  test: {
    username: process.env.user_name,
    password: process.env.SEQUELIZE_PASSWORD,
    database: "foodtaste_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.user_name,
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'foodtaste',
    host: '127.0.0.1',
    dialect: 'mysql',
    logging: false,
  },
};
  