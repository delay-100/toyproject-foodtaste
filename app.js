const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

const indexRouter = require('./router/index');
const authRouter = require('./router/auth');

const { sequelize } = require('./models');
const passportConfig = require('./passport'); // passport/index.js

const app = express();

passportConfig(); // 패스포트 설정, 한 번 실행해두면 ()에 있는 deserializeUser 계속 실행 - passport/index.js

app.set('port', process.env.PORT || 8000);

app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
});

app.use(morgan('dev'));

// static
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// express-session, 인수: session에 대한 설정
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));

// passport 사용 - req.session 객체는 express-session에서 생성하므로 express-session 뒤에 작성해야함
app.use(passport.initialize()); // 요청(req 객체)에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport 정보를 저장(요청으로 들어온 세션 값을 서버에 저장한 후, passport 모듈과 연결)

// 라우터 연결
app.use('/', indexRouter);
app.use('/auth', authRouter);

// 라우터가 없을 때 실행 
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

// 에러
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error'); 
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});