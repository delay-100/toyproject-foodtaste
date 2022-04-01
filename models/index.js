const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

const User = require('./user');

const Koreanfood = require('./koreanfood');
const Chinesefood = require('./chinesefood');
const Japanesefood = require('./japanesefood');
const Westernfood = require('./westernfood');

const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.Koreanfood = Koreanfood;
db.Chinesefood = Chinesefood;
db.Japanesefood = Japanesefood;
db.Westernfood = Westernfood;

// 각 객체 실행
User.init(sequelize);
Koreanfood.init(sequelize);
Chinesefood.init(sequelize);
Japanesefood.init(sequelize);
Westernfood.init(sequelize);

// 관계 연결
// User.associate(db);

module.exports = db;