const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');
const Food = require('./food');
const Select = require('./select');

const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Food = Food;
db.Select = Select;

// 각 객체 실행
User.init(sequelize);
Food.init(sequelize);
Select.init(sequelize);

// 관계 연결
User.associate(db);
Food.associate(db);
Select.associate(db);

module.exports = db;