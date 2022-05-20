const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select, User } = require('../models');

const router = express.Router();

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('analyze' , );
});

module.exports = router;