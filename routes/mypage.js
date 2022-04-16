const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select } = require('../models');

router.get('/', isLoggedIn, async (req, res, next) => {
    try {
      const foods = await Food.findAll({ 
        order: [["createdAt", "DESC"]], 
      });
      const selects = await Select.findAll({
      });
      const list = foods;

      let k = 0;
      for(let i=0; i< foods.length; i++){
        for (let j=0; j<selects.length; j++){
          if(list[i].id==selects[j].foodSelected){
            list[i].dataValues.like = selects[j].like;
            list[i].dataValues.userSelected = selects[j].userSelected;
            k++;
          }
        }
      }
      if(selects.length!==0){
        list.user = selects[0].userSelected;
      }
      // console.log(list);

      res.render('mypage', { title: '마이페이지', foodSelectlist: list,  });


    } catch (err) {
      console.error(err);
      next(err);
    }
  });

router.get('/follow', isLoggedIn, (req, res) => {
    res.render('follow', { title: '팔로우, 팔로워 목록' });
});


module.exports = router;