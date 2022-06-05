const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select } = require('../models');

const router = express.Router();


router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {
      // console.log(parseInt(req.params.id));
      const foods = await Food.findAll({ // db에서 게시글을 조회 
        raw: true,
        where:{
            categorynumber : parseInt(req.params.id),
        },
        order: [["createdAt", "DESC"]],
      });
      const category = foods[0].categoryname;
      console.log(foods[0].categoryname);
      res.render('form', { title: 'TASTEYOM : 호불호 선택 폼', foodlist: foods, category});
    } catch (err) {
      console.error(err);
      next(err);
    }
  });
  
  router.post('/save', isLoggedIn, async (req, res, next) => {// upload2.none(): 데이터 형식이 multipart지만 이미지 데이터가 들어있지 않으므로 none 메서드 사용(이미지 주소가 온 것이고 데이터는 이미 POST /post/img 라우터에 저장됨)
    try {
      const keylist = Object.keys(req.body).toString(); // name={{food.id}}
      const valuelist = Object.values(req.body).toString(); // value="t"/"f"
  
      // console.log("-----------------------");
      // console.log(keylist);
      // console.log("-----------------------");
      // console.log(valuelist);
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
          // console.log(num);
        }
      }
      list[j] = num;
      // console.log('--------------------');
      // console.log(list); // [ '1', '2', '3', '4', '5', ~ '10' ]
      // console.log('--------------------');

      let z = 0;
      for(let i=0; i<list.length; i++) {
        // console.log("=========================");
        // console.log(parseInt(list[i],10));
        // console.log(typeof(parseInt(list[i],10)));
        // console.log("==============");
        // console.log(valuelist[z]);
        // console.log("==============");
  
        const isExist = await Select.findOne({
          raw: true,
          where: {
            userSelected: req.user.id,
            foodSelected: parseInt(list[i],10),
          }
        });
        // console.log('i='+i);
        // console.log(isExist);

        // 이미 값이 있는 경우
        if(isExist!== null){
          // 수정이 있는 경우(!수정이 없는 경우)
          if(!((valuelist[z] == 't' && isExist.like == true)||(valuelist[z] == 'f' && isExist.like == false))){
            // 이미 있는 값이 false일 때 
            if(isExist.like == false){
              await Select.update({
                like: true,
              },{
                where:{
                  userSelected: req.user.id,
                  foodSelected: parseInt(list[i],10),
                }
              });
            }
            // 이미 있는 값이 true 일 때 
            else{
              await Select.update({
                like: false,
              },{
                where:{
                  userSelected: req.user.id,
                  foodSelected: parseInt(list[i],10),
                }
              });
            }
          }
        }
        // 값이 없는 경우
        else {
          if(valuelist[z]==='t'){
            await Select.create({
              like: true,
              userSelected: req.user.id,
              foodSelected: parseInt(list[i],10),
            });
          } else {
            await Select.create({
              like: false,
              userSelected: req.user.id,
              foodSelected: parseInt(list[i],10),
            });
          }  
        }
        z+=2;
      }
      res.redirect('/mypage');
    } catch (error) {
        console.error(error);
        next(error);
    }
  });

  router.get('/update/:id', isLoggedIn, async (req, res, next) => {
    try {
      // console.log(parseInt(req.params.id));

      const Selects = await Select.findAll({
        raw: true,
        where:{
            userSelected: req.user.id,
        },
        order: [["foodSelected", "asc"]], 
      });

      const foods = await Food.findAll({ // db에서 게시글을 조회 
        raw: true,
        where:{
            categorynumber : parseInt(req.params.id),
        },
        order: [["id", "asc"]], 
      });

      for(let i=0; i<foods.length; i++){
        for(let j=0; j<Selects.length; j++){
          if(foods[i].id==Selects[j].foodSelected){
            foods[i].like = Selects[j].like;
            break;
          }
        }
      }
      // console.log(foods);
      const category = foods[0].categoryname;
      res.render('form', { title: 'TASTEYOM : 호불호 선택 폼', foodlist: foods, category });
    } catch (err) {
      console.error(err);
      next(err);
    }
});

  router.post('/remove', isLoggedIn, async (req, res, next) => {
    try{
        const { selectUserid, userid, category }= req.body;
        if(!selectUserid)return res.json({status:'false'});
        if(selectUserid==userid){
          const foods = await Food.findAll({
            raw: true,
            where:  {
              categorynumber: category
            },
          });
          for(let i=0; i<foods.length; i++){
            await Select.destroy({
              where:{
                foodSelected: foods[i].id,
                userSelected: userid,
              },
            });
          }
          return res.json({status:'true'});
        }
        else{
            return res.json({status:'not equal user'});
        }
    } catch(err){
        console.error(err);
    }
    
});
  
module.exports = router;