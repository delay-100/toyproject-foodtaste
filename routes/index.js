const express = require('express'); // node web framework
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();

// 모든 요청마다 실행
router.use((req, res, next) => {
    res.locals.user = req.user; // 요청으로 온 유저를 넌적스에 연결
    res.locals.followerCount = req.user ? req.user.Followers.length : 0; // 유저가 있는 경우 팔로워 수를 저장
    res.locals.followingCount = req.user ? req.user.Followings.length : 0;
    res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : []; // 팔로워 아이디 리스트를 넣는 이유 -> 팔로워 아이디 리스트에 게시글 작성자의 아이디가 존재하지 않으면 팔로우 버튼을 보여주기 위함
    next();
  });

router.get('/', async (req, res, next) => {
    const howmanyId = await User.findOne({
      raw: true,
      order: [
        ["createdAt", "desc"]
      ],
    });
    let how = 0;
    if(howmanyId) 
      how = howmanyId.id;
    else
      how = 0;  
    res.render('index', { title: '너의 취향은?', num: how});
});

module.exports = router;