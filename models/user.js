const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            id: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(8),
                allowNull: false,
                unique: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: false,
            }
        });
    }
    static associate(db) {
        
    }
}