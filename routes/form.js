const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select } = require('../models');

const router = express.Router();


router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
      console.log(parseInt(req.params.id));
      const foods = await Food.findAll({ // db에서 게시글을 조회 
        where:{
            categorynumber : parseInt(req.params.id),
        },
        order: [["createdAt", "DESC"]], // 게시글의 순서를 최신순으로 정렬
      });
      
      res.render('form', { title: '호불호 선택 폼', foodlist: foods });
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  
  router.post('/save', isLoggedIn, async (req, res, next) => {// upload2.none(): 데이터 형식이 multipart지만 이미지 데이터가 들어있지 않으므로 none 메서드 사용(이미지 주소가 온 것이고 데이터는 이미 POST /post/img 라우터에 저장됨)
    try {
      const keylist = Object.keys(req.body).toString()
      const valuelist = Object.values(req.body).toString();
  
      const list = [];
      let j = 0;
      let num = "";
      for(let i=0; i<keylist.length; i++){
        if(keylist[i]==','){
          list[j] = num;
          j++;
          num = "";
        }
        else{
          num += keylist[i];
        }
      }
      list[j] = num;
      
      for(let i=0; i<list.length; i++) {
        console.log(parseInt(list[i],10));
        console.log(valuelist[i]);
  
        if(valuelist[i]==='t'){
          await Select.create({
              like: true,
              userSelected: req.user.id,
              foodSelected: parseInt(list[i],10),
          });
        } else{
          await Select.create({
              like: false,
              userSelected: req.user.id,
              foodSelected: parseInt(list[i],10),
          });
        }
      }
      res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
  });
  
  module.exports = router;