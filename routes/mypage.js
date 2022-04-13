const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      const foods = await Food.findAll({ // db에서 게시글을 조회 
        order: [["createdAt", "DESC"]], // 게시글의 순서를 최신순으로 정렬
      });
      const selects = await Select.findAll({  
        order: [["foodSelected", "asc"]], 
      });
      res.render('mypage', { title: '마이페이지', foodlist: foods, select: selects });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;