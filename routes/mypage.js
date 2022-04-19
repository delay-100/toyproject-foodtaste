const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select, User } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    
    const categorynumber = 2;
    const categorydic = {'1': 10, '2': 5};

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

      const dic = {};

      let sameNum = 0;
      for(let i=1; i<categorynumber+1; i++){
        for(j in foods){
          if(foods[j].categorynumber==i){
            if((foods[j].userlike[followingID]==1) && (foods[j].userlike[req.user.id]==1)){
              // console.log(foods[j]);
              sameNum=sameNum+1;
            }
          }
        }
        // 카테고리별로 퍼센트 계산
        dic[i.toString()] = (sameNum/categorydic[i])*100;
      }

      // // 팔로잉 퍼센트 객체 생성
      const user = {
        id: followingID,
        categorypercent: dic, 
      };
      // // userpercent에 팔로잉 퍼센트 객체 추가
      userpercent.push(user);
    }
    foods.user =req.user.id;


    console.log(userpercent);
    // foodlist: food 정보, foodSelectlist: 각 user(자신, 팔로잉, 팔로워)의 food - 선택 정보
    res.render('mypage', { title: '마이페이지', foodSelectlist: foods, percentlist: userpercent });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;