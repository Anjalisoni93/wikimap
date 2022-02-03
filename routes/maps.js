const express = require('express');
const router  = express.Router();
const {getuserByID,getAllMaps} = require('../helper/helper');

module.exports = (db) => {
  //this route is to show all maps
  const tempVariable = {}
  router.get("/", (req, res) => {
        const id = req.session.user_id;
        getAllMaps(db)
        .then(maps =>{
          tempVariable.maps = maps
          getuserByID(db,id)
            .then(user =>{
            tempVariable.user = user
            res.render('showMaps',tempVariable);
          })
        })

        // res.json(showMaps[0]);
      })

    //route to get specific map with id

  return router;
};

