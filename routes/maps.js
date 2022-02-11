const express = require('express');
const router = express.Router();
const { getuserByID, getAllMaps, getMapById, showAllpins, createMap, getCoordinates, updateMap, deleteMap } = require('../helper/helper');
module.exports = (db) => {
  //this route is to show all maps
  const tempVariable = {};
  router.get("/", (req, res) => {
    const id = req.session.user_id;
    getAllMaps(db)
      .then(maps => {
        tempVariable.maps = maps;
        getuserByID(db, id)
          .then(user => {
            tempVariable.user = user;
            return res.render('mapIndex', tempVariable);
          });
      });
  });
  //POST route for create map
  router.post('/', (req, res) => {
    const country = req.body.Country;
    const city = req.body.City;
    const title = req.body.title;
    const tempVariable = {};
    const id = req.session.user_id;
    if (!id) {
      return res.send('access denied');
    } else {
      getuserByID(db, id)
        .then(user => {
          tempVariable.user = user;
          getCoordinates(city, country)
            .then(result => {
              const outputArray = result.data.results[0];
              const coordinates = outputArray.locations[0].latLng;
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
              };
              createMap(db, map)
                .then(newMap => {
                  return res.redirect(`/maps/${newMap.id}`);
                });
            });
        });
    }
  });

  // route to create a new map
  router.get("/new", (req, res) => {
    const tempVariable = {};
    const id = req.session.user_id;
    if (!id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, id)
        .then(user => {
          tempVariable.user = user;
          return res.render('newMap', tempVariable);
        });
    }
  });



  //route to get specific map with id
  router.get('/:id', (req, res) => {
    const id = req.params.id;
    const tempVariable = {};
    const user_id = req.session.user_id;
    const loggedUser = user_id;
    if (!user_id) {
      tempVariable.user = null;
      getMapById(db, id)
        .then(mapDetails => {
          tempVariable.mapDetails = mapDetails;
          showAllpins(db, id)
            .then(pins => {
              tempVariable.pins = pins;
              return res.render('mapShow', tempVariable);
            });
        });
    } else {

      getuserByID(db, user_id)
        .then(user => {
          getMapById(db, id)
            .then(mapDetails => {
              if (mapDetails.user_id === user.id) {
                tempVariable.user = user;
                tempVariable.mapDetails = mapDetails;
                showAllpins(db, id)
                  .then(pins => {
                    tempVariable.pins = pins;
                    return res.render('mapShow', tempVariable);
                  });
              } else {
                tempVariable.user = user;
                tempVariable.mapDetails = mapDetails;
                showAllpins(db, id)
                  .then(pins => {
                    tempVariable.pins = pins;
                    return res.render('mapShow', tempVariable);
                  });
              }
            });
        });
    }
  });
  //  EDIT ROUTE TO GET EDIT FORM
  router.get('/:id/edit', (req, res) => {
    const tempVariable = {};
    const id = req.session.user_id;
    const mapID = req.params.id;
    if (!id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, id)
        .then(user => {
          tempVariable.user = user;
          getMapById(db, mapID)
            .then(mapDetails => {
              tempVariable.mapDetails = mapDetails;
              return res.render('mapEdit', tempVariable);
            });
        });
    }
  });


  //POST ROUTE FOR UPDATED ROUTE
  router.put('/:id', (req, res) => {
    const mapID = req.params.id;
    const userID = req.session.user_id;
    const title = req.body.title;
    const newmap = {
      title
    };
    updateMap(db, mapID, newmap)
      .then(updatedMap => {
        res.redirect(`/login/${userID}`);
      });
  });

  //ROUTE TO DELETE A MAP
  router.delete('/:id', (req, res) => {
    const user_id = req.session.user_id;
    const mapID = req.params.id;
    if (!user_id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, user_id)
        .then(user => {
          getMapById(db, mapID)
            .then(map => {
              if (user.id === map.user_id) {
                deleteMap(db, mapID)
                  .then(deletedMap => {
                    return res.redirect(`/login/${user_id}`);
                  });
              } else {
                tempVariable.user = null;
                res.render('serverError', tempVariable);
              }
            });
        });
    }
  });

  return router;
};

