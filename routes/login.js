const express = require('express');
const router = express.Router();
const { getuserByID, getMapsByUser, showPinsByUser, showFavorites, deleteFavourite, addFavourite } = require('../helper/helper');

module.exports = (db) => {
  const tempVariable = {};
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    req.session.user_id = id;
    getuserByID(db, id)
      .then(user => {
        if (!user) {
          tempVariable.user = null;
          res.render('serverError', tempVariable);
        } else {
          tempVariable.user = user;
          getMapsByUser(db, id)
            .then(maps => {
              tempVariable.maps = maps;
              showFavorites(db, id)
                .then(favourites => {
                  console.log(favourites);
                  tempVariable.favourites = favourites;
                  showPinsByUser(db, id)
                    .then(pins => {
                      tempVariable.pins = pins;
                      res.render('showUser', tempVariable);
                    });
                });
            });
        }
      });
  });

  // Add Favourites route
  router.post('/favourite/:id', (req, res) => {
    const map_id = req.params.id;
    const user_id = req.session.user_id;
    const tempVariable = {};
    if (!user_id) {
      tempVariable.user = null;
      res.render('serverError', tempVariable);
    } else {
      const created_at = new Date();
      const favourite = {
        user_id,
        map_id,
        created_at
      };
      addFavourite(db, favourite)
        .then(createdFavourite => {
          return res.redirect(`/login/${user_id}`);
        });
    }

  });

  // Delete favourites route
  router.delete('/favourite/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.session.user_id;
    deleteFavourite(db, id)
      .then(deletedFavourite => {
        return res.redirect(`/login/${userId}`);
      });
  });
  return router;
};
