const express = require('express');
const router  = express.Router();
const {getuserByID,getHomePageMap} = require('../helper/helper')
//user helper function get coordinates to get latitude and longitude
module.exports = (db) => {
  const tempVariable = {}
  getHomePageMap(db)
  .then(data =>{
    let latitude = data.latitude;
    let longitude = data.longitude;
    tempVariable.latitude = latitude;
    tempVariable.longitude = longitude;

  })

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
