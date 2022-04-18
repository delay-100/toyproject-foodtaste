const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select, User } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
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

    // 전체 food를 가져옴
    const foods = await Food.findAll({ 
      raw: true,
      order: [
        ["categorynumber", "asc"],
        ["id", "asc"],
      ],
    });
 
    const mylist = foods;

    // foods에다가 자신의 선택 정보를 넣음
    for(let i=0; i<foods.length; i++) {
      for(let j=0; j<myselects.length; j++) {
        if(mylist[i].id==myselects[j].foodSelected){
          mylist[i].like = myselects[j].like;
          mylist[i].userSelected = myselects[j].userSelected;
        }
      }
    }
    if(myselects.length!==0){
      mylist.user = req.user.id;
    }
    
    console.log(mylist);
    const followinglist = [];
    
    // follower의 선택 정보를 넣음, 0이면 실행x니까 list가 비어있음
    for(let k=0; k<req.user.Followings.length; k++){
      const followingID = req.user.Followings[k].id;
      const followingfoods = await Food.findAll({ 
        raw: true,
        order: [
          ["categorynumber", "asc"],
          ["id", "asc"],
        ],
      });
      const followingfood = followingfoods;
      const followingselects = await Select.findAll({
        raw: true,
        where: {
          userSelected: followingID,
        },
        order: [
          ["foodSelected", "asc"]
        ],
      });
    // console.log(mylist);
      for(let i=0; i<foods.length; i++) {
        for(let j=0; j<followingselects.length; j++) {
          if(followingfood[i].id==followingselects[j].foodSelected){
            followingfood[i].like = followingselects[j].like;
            followingfood[i].userSelected = followingselects[j].userSelected;
          }
        }
      }
      if(followingselects.length!==0){
        followingfood.user = followingID;
      }
      // console.log("---------------------------------------------");
      followinglist.push(followingfood);
      
      // console.log(followingfood);
    }
    // console.log(followinglist);
    // foodlist: food 정보, myselectlist: 내 선택 정보, friendSelectlist: 팔로우의 선택 정보
    res.render('mypage', { title: '마이페이지', myfoodSelectlist: mylist, followfoodSelectlist: followinglist });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;