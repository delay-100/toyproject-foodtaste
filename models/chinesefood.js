const Sequelize = require('sequelize');

module.exports = class ChineseFood extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            sweetandsourpork: { // 탕수육
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            hotpot : { // 훠궈
                type: Sequelize.BOOLEAN,
                allowNull: false,
            } 
        });
    }
    static associate (db) {

    }
}