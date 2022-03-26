const Sequelize = require('sequelize');

module.exports = class JapaneseFood extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            sushi: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            ramen: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            } 
        });
    }
    static associate (db) {

    }
}