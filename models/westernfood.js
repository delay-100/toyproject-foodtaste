const Sequelize = require('sequelize');

module.exports = class WesternFood extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            pizza : { 
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            pasta : { 
                type: Sequelize.BOOLEAN,
                allowNull: false,
            } 
        });
    }
    static associate (db) {

    }
}