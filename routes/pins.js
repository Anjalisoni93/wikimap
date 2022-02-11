const express = require('express');
const router = express.Router();
const { showPinsByUser, getuserByID, showPinById, createPin, getMapById, getCoordinates, editPin, deletePin, updateMap, findMapOfPin } = require('../helper/helper');
//index route for pins
module.exports = (db) => {
  router.get('/', (req, res) => {
    const tempVariable = {};
    const id = req.session.user_id;
    if (!id) {
      res.send('not authorized to view pins');
    } else {
      getuserByID(db, id)
        .then(user => {
          tempVariable.user = user;
          showPinsByUser(db, id)
            .then(pins => {
              tempVariable.pins = pins;
              return res.render('pinIndex', tempVariable);
            });
        });
    }
  });

  // Create pin route
  router.get('/maps/:id/newpin', (req, res) => {
    const id = req.session.user_id;
    const map_id = req.params.id;
    const tempVariable = {};
    if (!id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, id)
        .then(user => {
          getMapById(db, map_id)
            .then(map => {
              tempVariable.user = user;
              tempVariable.map = map;
              return res.render('pinNew', tempVariable);
            });
        });
    }
  });

  // Post route for pin
  router.post('/maps/:id', (req, res) => {
    const user_id = req.session.user_id;
    const map_id = req.params.id;
    const title = req.body.title;
    const description = req.body.description;
    const image_url = req.body.image;
    const created_at = new Date();
    const country = req.body.Country;
    const city = req.body.City;
    getCoordinates(city, country)
      .then(result => {
        const outputArray = result.data.results[0];
        const coordinates = outputArray.locations[0].latLng;
        const latitude = coordinates.lat;
        const longitude = coordinates.lng;
        const pin = {
          user_id,
          map_id,
          title,
          description,
          image_url,
          longitude,
          latitude,
          created_at
        };
        createPin(db, pin)
          .then(newPin => {
            return res.redirect(`/maps/${map_id}`);
          });
      });
  });


  //route to get particuler pin by id
  router.get('/:id', (req, res) => {
    const pinId = req.params.id;
    const tempVariable = {};
    const id = req.session.user_id;
    if (!id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, id)
        .then(user => {
          showPinById(db, pinId)
            .then(pin => {
              findMapOfPin(db, pinId)
                .then(mapDetails => {
                  tempVariable.user = user;
                  tempVariable.mapDetails = mapDetails;
                  tempVariable.pin = pin;
                  return res.render('pinshow', tempVariable);
                });

            });
        });
    }
  });

  //EDIT ROUTE to see a form
  router.get('/:id/edit', (req, res) => {
    const pinID = req.params.id;
    const id = req.session.user_id;
    const tempVariable = {};
    if (!id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, id)
        .then(user => {
          showPinById(db, pinID)
            .then(pinDetails => {
              tempVariable.user = user;
              tempVariable.pinDetails = pinDetails;
              return res.render('editPin', tempVariable);
            });

        });
    }
  });

  //PUT REQUEST
  router.put('/:id', (req, res) => {
    const id = req.params.id;
    const userID = req.session.user_id;
    const title = req.body.title;
    const description = req.body.description;
    const image_url = req.body.image;

    const newPin = {
      title,
      description,
      image_url
    }
    editPin(db, id, newPin)
      .then(updatedPin => {
        return res.redirect(`/pins/${id}`);
      });
  });

  //DELETE ROUTE
  router.delete('/:id', (req, res) => {
    const user_id = req.session.user_id;
    const pinID = req.params.id;
    if (!user_id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      getuserByID(db, user_id)
        .then(user => {
          showPinById(db, pinID)
            .then(pin => {
              if (user.id === pin.user_id) {
                deletePin(db, pinID)
                  .then(deletedPin => {
                    return res.redirect(`/pins`);
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
