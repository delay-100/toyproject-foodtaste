const Sequelize = require('sequelize');

module.exports = class Food extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            name: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            category: {
                type: Sequelize.STRING(8),
                allowNull: false,
                unique: false,
            },
        }, { // super.init의 두 번째 인수: 테이블 자체에 대한 설정(테이블 옵션)
            sequelize, // static init 메서드의 매개변수와 연결되는 옵션, db.sequelize 객체를 넣어야 함 -> 추후에 models/index.js에서 연결
            timestamps: true, // true: Sequelize가 자동으로 createdAt과 updatedAt, deletedAt 컬럼을 추가
            underscored: false, // true: create_at같이(스네이크 케이스), false: createdAt같이(캐멀 케이스) 
            modelName: 'Food',
            tableName: 'foods',
            paranoid: false, // 컬럼을 지워도 완전히 지워지지 않고 deletedAt이라는 컬럼이 생김(지운 시각이 기록됨)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        
    }
}