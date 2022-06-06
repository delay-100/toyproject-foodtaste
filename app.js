const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
// const redis = require('redis');
// const RedisStore = require('connect-redis')(session);

dotenv.config();

// const redisClient = redis.createClient({
//     url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
//     password: process.env.REDIS_PASSWORD,
// });

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const mypageRouter = require('./routes/mypage');
const formRouter = require('./routes/form');
const analyzeRouter = require('./routes/analyze');
const memberRouter = require('./routes/member');
const logger = require('./logger');

const { sequelize } = require('./models');
const passportConfig = require('./passport'); // passport/index.js

const app = express();

passportConfig(); // 패스포트 설정, 한 번 실행해두면 ()에 있는 deserializeUser 계속 실행 - passport/index.js

app.set('port', process.env.PORT || 8080);

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



if (process.env.NODE_ENV === 'production') {
    // app.enable('trust proxy');
    app.use(morgan('combined'));
    app.use(helmet({ contentSecurityPolicy: false })); // -> 얘때문에 에러
    app.use(hpp());
  } else {
    app.use(morgan('dev'));
  }

// static
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(cookieParser(process.env.COOKIE_SECRET));

// express-session, 인수: session에 대한 설정
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
    // store: new RedisStore({ client: redisClient }),
  };
  if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true; // HTTPS 적용을 위해 노드 서버 앞에 다른 서버를 둔 경우 TRUE를 함
    // sessionOption.cookie.secure = true; // HTTPS를 적용시에만 TRUE, 교재 647 sanitize-html이랑 csurf도 하기 -> 설치는 해둠
  }

app.use(session(sessionOption));

// passport 사용 - req.session 객체는 express-session에서 생성하므로 express-session 뒤에 작성해야함
app.use(passport.initialize()); // 요청(req 객체)에 passport 설정을 심음
app.use(passport.session()); // req.session 객체에 passport 정보를 저장(요청으로 들어온 세션 값을 서버에 저장한 후, passport 모듈과 연결)

// 라우터 연결
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/mypage', mypageRouter);
app.use('/form', formRouter);
app.use('/analyze', analyzeRouter);
app.use('/member', memberRouter);

// 라우터가 없을 때 실행 
app.use((req,res,next)=>{
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    logger.info('hello');
    logger.error(error.message);
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
