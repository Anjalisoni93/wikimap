const express = require('express');
const router  = express.Router();
const {getuserByID} = require('../helper/helper')

module.exports = (db) => {
  const tempVariable = {}
  router.get("/:id", (req, res) => {
    const id = req.params.id;
    req.session.user_id = id;
    getuserByID(db,id)
      .then(user => {
       tempVariable.user = user
        res.render('showUser',tempVariable);
      })

  });
  return router;
};
