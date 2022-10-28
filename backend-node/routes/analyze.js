const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select, User } = require('../models');

const router = express.Router();

// console.log('11');

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('analyze' ,{ title: 'TASTEYOM : 알아보기'});
});

router.post('/result', isLoggedIn, async (req, res, next) => {
    try{
        // const { result }= req.body;
        // const keylist = Object.keys(req.body).toString(); // name={{food.id}}
        const valuelist = Object.values(req.body).toString(); // value=following.id"
        const userid = req.user.id;

        if(valuelist==""){
            return  res.redirect('/analyze');

        }
        const list = [];
        let j = 0;
        let num = "";
        for(let i=0; i<valuelist.length; i++){
          if(valuelist[i]==','){
            list[j] = num;
            j++;
            num = "";
          }
          else{
            num += valuelist[i];
            // console.log(num);
          }
        }
        list[j] = num;

        // for(let i=0; i<list.length; i++){
        //     console.log(list[i]); // 팔로워들의 id list
        // }

        const foods = await Food.findAll({
            raw:true,
            order: [["id", "ASC"]],
        });

        const myselects = await Select.findAll({
            raw:true,
            where:{
                userSelected: userid,
            },
            order: [["foodSelected", "ASC"]],
        });

        for(let i=0; i<foods.length; i++){
            foods[i].userlike = 0;
        }

        j=0;
        // req.user.id 관련 넣기
        for(let i=0; i<foods.length; i++){
            if(j==myselects.length){
                break;
            }
            else{
                if(myselects[j].foodSelected==foods[i].id){
                    // console.log(myselects[j].like);
                    foods[i].userlike = myselects[j].like;
                    j++;
                }
            }
        }

        for(let i=0; i<list.length; i++){
            // console.log(food[i].id);

            const followings = await Select.findAll({
                raw:true,
                where:{
                    userSelected: parseInt(list[i], 10),
                },
                order: [["foodSelected", "ASC"]],
            }); 
            
            let a=0;
            for(let j=0; j<foods.length; j++){
                if((followings[i]!=undefined)&& (a==followings[i].length)){
                    break;
                }
                else{
                    if(followings[a]!=undefined){
                        if(followings[a].foodSelected==foods[j].id){
                            foods[j].userlike = (foods[j].userlike & followings[a].like);
                            // console.log(foods[j]);
                        }
                        a++;
                    }
                }
            }
        }

        let nick = [];

        const nicktmp = await User.findOne({
                raw: true,
                where: {
                        id: userid,
                },
        }); 

        // console.log(nicktmp);

        nick[0] = nicktmp.nick;

        for(let i=0; i<list.length; i++){
            const nicktemp = await User.findOne({
                raw: true,
                where: {
                    id: parseInt(list[i]),
                },
            });
            nick[i+1] = nicktemp.nick;
        }
        // for(let i=0; i<nick.length; i++)
        //     console.log(nick[i]);

        res.render('analyzeresult', {title: 'TASTEYOM : 결과', foodSelectlist: foods, nicklist : nick});
    } catch(err){
        console.error(err);
    }

});

module.exports = router;