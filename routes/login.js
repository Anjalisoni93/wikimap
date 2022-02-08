const express = require('express');
const router  = express.Router();
const {getuserByID,getfavouriteMapByUser,getMapsByUser,showPinsByUser} = require('../helper/helper')

module.exports = (db) => {
  const tempVariable = {}
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    req.session.user_id = id;
    getuserByID(db,id)
      .then(user => {
      if(!user){
        tempVariable.user = null;
        res.send("no user found..");
      }else{
        tempVariable.user = user
        getMapsByUser(db,id)
        .then(maps =>{
          tempVariable.maps = maps
          getfavouriteMapByUser(db,id)
          .then(favourites => {
            tempVariable.favourites = favourites
            showPinsByUser(db,id)
            .then(pins =>{
              tempVariable.pins = pins;
              res.render('showUser',tempVariable);
            })

          })
        })
      }

      })
    });
  return router;
};
