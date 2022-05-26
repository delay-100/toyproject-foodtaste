const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { Food, Select, User } = require('../models');

const router = express.Router();

// console.log('11');

router.get('/', isLoggedIn, async (req, res, next) => {
    res.render('analyze' );
});

router.post('/result', isLoggedIn, async (req, res, next) => {
    try{
        // const { result }= req.body;
        // const keylist = Object.keys(req.body).toString(); // name={{food.id}}
        const valuelist = Object.values(req.body).toString(); // value=following.id"
        const userid = req.user.id;

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

        j=0;
        // req.user.id 관련 넣기
        for(let i=0; i<foods.length; i++){
            if(j==myselects.length){
                break;
            }
            else{
                if(myselects[j].foodSelected==foods[i].id){
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
                if(a==followings[i].length){
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

        // console.log(food);

        // 로그인한 사용자
        // for(let i=0; i<result.length)
        // map.push(i:); 

        const selects = await Select.findAll({
            raw: true,
        });

        res.render('analyzeresult', {title: '결과', foodSelectlist: foods});
    } catch(err){
        console.error(err);
    }

});

// router.get('/result', isLoggedIn, async (req, res, next) => {
//     try{
//         const { result }= req.body;
        
//         let map = {};
//         console.log("-------------");
//         console.log(result);
//         console.log("-------------");
//         // 로그인한 사용자
//         // for(let i=0; i<result.length)
//         // map.push(i:); 
        


//         const selects = await Select.findAll({
//             raw: true,
//           });

//         res.render('analyzeresult');
//     } catch(err){
//         console.error(err);
//     }
// });

module.exports = router;