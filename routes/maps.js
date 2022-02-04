const express = require('express');
const router  = express.Router();
const {getuserByID,getAllMaps,getMapById} = require('../helper/helper');

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
            res.render('mapIndex',tempVariable);
          })
        })
      })

    //route to get specific map with id
      router.get('/:id',(req,res)=>{
        const id = req.params.id;
        const tempVariable = {}
        if(!req.session.user_id){
          tempVariable.user = null;
        }else{
          getuserByID(db,req.session.user_id)
          .then(user =>{
            tempVariable.user = user
          });
        }
        getMapById(db,id)
        .then(mapDetails =>{
          tempVariable.mapDetails = mapDetails
         return  res.render('mapShow',tempVariable);
        })

      })
  return router;
};

