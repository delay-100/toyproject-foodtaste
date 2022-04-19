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
    
    // console.log(mylist);

    const followingfoods = await Food.findAll({ 
      raw: true,
      order: [
        ["categorynumber", "asc"],
        ["id", "asc"],
      ],
    });
 
    for(let i=0; i <foods.length; i++){ // 푸드 수 만큼 반복 
      followingfoods[i].userlike = {};
    }

    // follower의 선택 정보를 넣음, 0이면 실행x니까 list가 비어있음
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


    // console.log(mylist);
      for(let i=0; i<foods.length; i++) { // 푸드 수 만ㄴ큼 반복
       for(let j=0; j<followingselects.length; j++) { // DB level name = foodSelected
        if(followingfoods[i].id==followingselects[j].foodSelected){
          followingfoods[i].userlike[followingID] = followingselects[j].like;
            // followingfood[i].like = followingselects[j].like;
            // followingfood[i].userSelected = followingselects[j].userSelected;
        }
        }
      }
      // console.log("---------------------------------------------");
      // followinglist.push(followingfoods);
      
      // console.log(followingfood);
    }
    // console.log(followingfoods);
    // foodlist: food 정보, myselectlist: 내 선택 정보, friendSelectlist: 팔로우의 선택 정보
    res.render('mypage', { title: '마이페이지', myfoodSelectlist: mylist, followfoodSelectlist: followingfoods });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;