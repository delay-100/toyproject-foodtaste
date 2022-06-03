const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select, User } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    
    const categorynumber = 5;
    const categorydic = {'1': 40, '2': 20, '3':20, '4':20, '5': 20};

    // console.log(req.user.id); // userid

    // 현재 로그인한 유저의 선택 정보를 가져옴
    const myselects = await Select.findAll({
      raw: true,
      where: {
        userSelected: req.user.id,
      },
      order: [
        ["foodSelected", "asc"]
      ],
    });

    const foods = await Food.findAll({ 
      raw: true,
      order: [
        ["categorynumber", "asc"],
        ["id", "asc"],
      ],
    });
    for(let i=0; i <foods.length; i++){ // 푸드 수 만큼 반복 
      foods[i].userlike = {};
    }

    // req.user.id 관련 
    for(let i=0; i<foods.length; i++) { // 푸드 수 만큼 반복
      for(let j=0; j<myselects.length; j++) {
         if(foods[i].id==myselects[j].foodSelected){
           foods[i].userlike[req.user.id] = myselects[j].like;
         }
       }
     }

    // following 관련
    for(let k=0; k<req.user.Followings.length; k++){ //유저가 팔로우한 수한
      const followingID = req.user.Followings[k].id;
      
      const followingselects = await Select.findAll({
        raw: true,
        where: {
          userSelected: followingID,
        },
        order: [
          ["foodSelected", "asc"]
        ],
      });

      // console.log(followingselects);

      for(let i=0; i<foods.length; i++) { // 푸드 수 만큼 반복
       for(let j=0; j<followingselects.length; j++) { // DB level name = foodSelected
          if(foods[i].id==followingselects[j].foodSelected){
            foods[i].userlike[followingID] = followingselects[j].like;
          }
        }
      }
    }

    // userpercent 계산
    const userpercent = [];
    for(let k=0; k<req.user.Followings.length; k++){
      const followingID = req.user.Followings[k].id;

      const localId = await User.findOne({
        raw:true,
        where: {
          id: followingID,
        },
        attributes: ['localId',],
      });

      const dic = {};
      let sump = 0;
      for(let i=1; i<categorynumber+1; i++){     
        let sameNum = 0;
        
        for(j in foods){
          // 푸드의 카테고리 별로
          if(foods[j].categorynumber==i){
            // 사용자가 like이고 팔로잉이 like이거나 사용자가 0이고 팔로잉이 0인경우 num++ 
            if((foods[j].userlike[followingID]==1 && foods[j].userlike[req.user.id]==1)||
            (foods[j].userlike[followingID]==0 && foods[j].userlike[req.user.id]==0)){
              // console.log(foods[j]);
              sameNum=sameNum+1;
            }
          }
        }
        // 카테고리별로 퍼센트 계산
        dic[i.toString()] = parseInt((sameNum/categorydic[i])*100);
        sump += parseInt((sameNum/categorydic[i])*100);
      }
      sump = parseInt(sump/categorynumber);
      
      // // 팔로잉 퍼센트 객체 생성
      const user = {
        id: followingID,
        localId: localId.localId,
        categorypercent: dic, 
        sumpercent: sump,
      };
      
      // console.log("+==================");
      // console.log(localId);
      // console.log("+==================");
      // // userpercent에 팔로잉 퍼센트 객체 추가
      userpercent.push(user);
    }
    foods.user =req.user.id;


    // console.log(foods);
    // console.log(userpercent);
    // foodlist: food 정보, foodSelectlist: 각 user(자신, 팔로잉, 팔로워)의 food - 선택 정보
    // console.log(userpercent);
    // console.log(userpercent);
    console.log(foods[0]);
    res.render('mypage', { title: 'TASTEYOM : 마이페이지', foodSelectlist: foods, percentlist: userpercent});
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: 'TASTEYOM : 팔로우, 팔로워 목록' });
});


module.exports = router;