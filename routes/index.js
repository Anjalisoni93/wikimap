const express = require('express');
const router  = express.Router();
const {getuserByID} = require('../helper/helper')


module.exports = (db) => {
  const tempVariable = {}
  router.get('/', (req, res) => {
  const id = req.session.user_id;
    getuserByID(db,id)
    .then(user => {
    tempVariable.user = user;
    return res.render('index',tempVariable);
    })
  });
    return router;
}
