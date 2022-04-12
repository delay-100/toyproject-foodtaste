const express = require('express'); 
const passport = require('passport');
const { User } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const bcrypt = require('bcrypt');

const router = express.Router();

// GET /join - 회원가입 페이지로 이동 라우터
router.get('/join', (req, res) => {
    res.render('join', { title: '회원 가입'});
});

// Post /join - 회원가입 라우터
router.post('/join', isNotLoggedIn, async (req, res) => {
    console.log(req.body);
    const { localId, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: {localId} });
        if (exUser) {
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            localId,
            nick,
            password : hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로컬 로그인 라우터, /auth/login
router.post('/login', isNotLoggedIn, (req, res, next) =>{ // 콜백 함수 실행
    passport.authenticate('local', (authError, user, info) => { // passport.authenticate('local') 미들웨어가 로컬로그인 전략(passport/localStrategy.js) 수행
                                                                // 미들웨어인데 라우터 미들웨어 안에 들어있음 - 미들웨어에 사용자 정의 기능을 추가하고 싶은 경우
        if(authError){ // 로그인 전략(동작)이 실패한 경우 - authError 에 값이 존재
            console.error(authError);
            return next(authError); // app.js의 에러관련 함수로 이동
        }
        if(!user){  // 2번째 매개변수 값(user)이 존재하지 않는 경우 - db에 계정이 X
            return res.redirect(`/?loginError=${info.message}`);
        }
        // 2번째 매개변수 값(user)이 존재하는 경우 - passport가 req 객체에 login, logout 메서드를 추가함
        // console.log(1);

        return req.login(user, (loginError) => { // req.login은 passport.serializeUser를 호출 - req.login에 제공하는 user 객체가 serializeUser로 넘어가게 됨
            // console.log(req.user);
            
            if(loginError) {
                console.error(loginError);
                return next(loginError);
            }
            // console.log(3);  
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙힘
});

// router.post('/login', isNotLoggedIn, passport.authenticate('local',{
//     failureRedirect:'/?error=${info.message}',
// }),(req,res, next)=>{
//     return res.redirect('/');
// });

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;