const express = require('express'); // node web framework

const router = express.Router();


router.get('/join', (req, res) => {
    res.render('join', { title: '회원 가입'});
});

module.exports = router;