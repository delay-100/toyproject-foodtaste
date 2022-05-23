const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select, User } = require('../models');

const router = express.Router();

console.log('11');

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('analyze' );
});

router.post('/analyzeSelected', isLoggedIn, async (req, res, next) => {
    try{
        const { result }= req.body;
        if(!result)return res.json({status:'false'});
        

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

        return res.json({status:'true'});
    } catch(err){
        console.error(err);
    }
});

module.exports = router;