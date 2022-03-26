const express = require('express'); // node web framework

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: '음식 취향 %'});
});

module.exports = router;