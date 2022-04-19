const express = require('express'); // node web framework
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();

// 모든 요청마다 실행
router.use((req, res, next) => {
    // res.locals.user = null;  // res.locals는 변수를 모든 템플릿 엔진에서 공통으로 사용, 즉 user는 전역 변수로 이해하면 됨(아래도 동일)
    // console.log(req.user);
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
    res.render('index', { title: '음식취향 %', num: howmanyId.id});
});

module.exports = router;