const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select, User } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
  try {
    // console.log(req.user.id); // userid

    // 현재 로그인한 유저의 선택 정보를 가져옴
    const myselects = await Select.findAll({
      where: {
        userSelected: req.user.id,
      },
      order: [
        ["foodSelected", "asc"]
      ],
    });

    // 전체 food를 가져옴
    const foods = await Food.findAll({ 
      order: [
        ["categorynumber", "asc"],
        ["id", "asc"],
      ],
    });


    const mylist = foods;

    // foodlist: food 정보, myselectlist: 내 선택 정보, friendSelectlist: 팔로우의 선택 정보
    res.render('mypage', { title: '마이페이지', myfoodSelectlist: mylist,  });
  } catch (err) {
    console.error(err);
    next(err);
  }
});



router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;