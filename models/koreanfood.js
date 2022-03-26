const Sequelize = require('sequelize');

module.exports = class KoreanFood extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            bibimbap: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            kimchi: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            } 
        });
    }
    static associate (db) {

    }
}