const express = require('express'); 
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const router = express.Router();
const { Food, Select, User } = require('../models');


router.get('/:id', async (req, res, next) => {
    // console.log(req.params.id);
    const id = await User.findOne({
        raw: true,
        where:{
            localId: req.params.id,
        },
        attributes: ['id','nick'],
    });

    const Selects = await Select.findAll({
        raw: true,
        where:{
            userSelected: id.id,
        },
        order: [["foodSelected", "asc"]], 
      });

    for(let i=0; i<Selects.length; i++){
        // console.log(Selects[i].foodSelected);
        const category = await Food.findOne({
            raw: true,
            where:{
                id: Selects[i].foodSelected,
            },
            attributes: ['categorynumber','name'],
        })

        // console.log(category.categorynumber);

        Selects[i].categorynumber = category.categorynumber;
        Selects[i].name = category.name;
    }

    
    // console.log(Selects);

    res.render('member', {nick: id.nick,foodSelectlist: Selects});
});


module.exports = router;