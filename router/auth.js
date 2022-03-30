const express = require('express'); // node web framework

const router = express.Router();

// GET /join - 회원가입 페이지 라우터
router.get('/join', (req, res) => {
    res.render('join', { title: '회원 가입'});
});

module.exports = router;