const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init (sequelize) {
        return super.init({
            localId: {
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
        }, { // super.init의 두 번째 인수: 테이블 자체에 대한 설정(테이블 옵션)
            sequelize, // static init 메서드의 매개변수와 연결되는 옵션, db.sequelize 객체를 넣어야 함 -> 추후에 models/index.js에서 연결
            timestamps: true, // true: Sequelize가 자동으로 createdAt과 updatedAt, deletedAt 컬럼을 추가
            underscored: false, // true: create_at같이(스네이크 케이스), false: createdAt같이(캐멀 케이스) 
            modelName: 'User',
            tableName: 'users',
            paranoid: false, // 컬럼을 지워도 완전히 지워지지 않고 deletedAt이라는 컬럼이 생김(지운 시각이 기록됨)
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }
    static associate(db) {
        db.User.hasMany(db.Select, { foreignKey: 'userSelected', sourceKey: 'id'});
        db.User.belongsToMany(db.User, { 
            foreignKey: 'followingId', // user1에게 생기는 following
            as: 'Followers', // 생성된 Follow라는 테이블을 이름을 바꿔서 가져옴 - user.getFollowers, user.getFollowings 같은 관계 메소드 사용 가능
                            // include 시에도 as에 넣은 값을 넣으면 관계 쿼리가 작동함
            through: 'Follow', // 생성할 테이블 이름 , 유저-테이블 -유저, 특정 유저의 팔로잉/팔로워 목록이 저장됨
        });
        db.User.belongsToMany(db.User, {
            foreignKey: 'followerId', // user2에게 생기는 follower
            as: 'Followings',
            through: 'Follow', 
        });
    }
}