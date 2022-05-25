const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select, User } = require('../models');

const router = express.Router();

// console.log('11');

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('analyze' );
});

router.get('/result', isLoggedIn, async (req, res, next) => {
    try{
        const { result }= req.body;
        
        let map = {};
        console.log("-------------");
        console.log(result);
        console.log("-------------");
        // 로그인한 사용자
        // for(let i=0; i<result.length)
        // map.push(i:); 
        


        const selects = await Select.findAll({
            raw: true,
          });

        res.render('analyzeresult');
    } catch(err){
        console.error(err);
    }
});

module.exports = router;