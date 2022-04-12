const express = require('express'); // node web framework
const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 
const router = express.Router();
const { Food } = require('../models');

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
  try {
    const foods = await Food.findAll({ // db에서 게시글을 조회 
      order: [["createdAt", "DESC"]], // 게시글의 순서를 최신순으로 정렬
    });
    res.render('index', {
      title: '음식취향 %',
      foodlist: foods, // 조회 후 views/main.html 페이지를 렌더링할 때 전체 게시글을 twits 변수로 저장 
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/form', (req, res) => {
  res.render('form', { title: '호불호 선택 폼'});
});

// http://127.0.0.1:8000/profile 에 get요청이 왔을 때
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - sns" });
});



module.exports = router;