const express = require('express');
const router  = express.Router();
const axios = require('axios');
const {getuserByID,getAllMaps,getMapById,showAllpins,createMap,getCoordinates} = require('../helper/helper');

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
            return res.render('mapIndex',tempVariable);
          })
        })
      })
//POST route for create map
router.post('/',(req,res)=>{
  const country = req.body.Country;
  const city = req.body.City;
  const title = req.body.title;
  const tempVariable = {}
  const id = req.session.user_id;
  if(!id){
    return res.send('access denied');
  }else{
    getuserByID(db,id)
    .then(user =>{
      tempVariable.user = user;
      getCoordinates(city,country)
      .then(result =>{
        const outputArray = result.data.results[0];
        const coordinates = outputArray.locations[0].latLng
        const latitude = coordinates.lat;
        const longitude = coordinates.lng;
        const user_id = id;
        const created_at = new Date();
        const map = {
          user_id,
          title,
          country,
          city,
          longitude,
          latitude,
          created_at
        }
        createMap(db,map)
        .then(newMap =>{
         return res.redirect(`/maps/${newMap.id}`);
        })
      })

    })
  }
})

    // route to create a new map
    router.get("/new", (req, res) => {
      const tempVariable = {}
      const id = req.session.user_id;
      if(!id){
        res.send("not Authorized to create")
      } else {
        getuserByID(db,id)
        .then(user =>{
          tempVariable.user = user;
          return res.render('newMap',tempVariable);
        })
      }
      })



    //route to get specific map with id
      router.get('/:id',(req,res)=>{
        const id = req.params.id;
        const tempVariable = {}
        if(!req.session.user_id){
          tempVariable.user = null;
          getMapById(db,id)
            .then(mapDetails =>{
              tempVariable.mapDetails = mapDetails
              showAllpins(db,id)
              .then(pins =>{
                tempVariable.pins = pins;

                return  res.render('mapShow',tempVariable);
              });

        });
        }else{
          getuserByID(db,req.session.user_id)
          .then(user =>{
            tempVariable.user = user
            getMapById(db,id)
            .then(mapDetails =>{
              tempVariable.mapDetails = mapDetails
              showAllpins(db,id)
              .then(pins =>{
                tempVariable.pins = pins;
                return  res.render('mapShow',tempVariable);
              });
            });
          });
        }



      })
  return router;
};

