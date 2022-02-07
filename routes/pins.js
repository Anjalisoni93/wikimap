const express = require('express');
const { render } = require('express/lib/response');
const router  = express.Router();
const {showPinsByUser,getuserByID,showPinById} = require('../helper/helper');
//index route for pins
module.exports = (db) => {
  router.get('/',(req,res)=>{
    const tempVariable = {}
    const id = req.session.user_id;
    if(!id){
      res.send('not authorized to view pins');
    } else{
      getuserByID(db,id)
      .then(user =>{
        tempVariable.user = user;
        showPinsByUser(db,id)
        .then(pins =>{
          tempVariable.pins = pins
          res.render('pinIndex',tempVariable);
        })
      })
    }
  })

  //route to get particuler pin by id
  router.get('/:id',(req,res)=>{
    const pinId = req.params.id;
    const tempVariable = {}
    const id = req.session.user_id;
    if(!id){
      res.send('not authorized to view pins');
    } else{
      getuserByID(db,id)
      .then(user =>{
        tempVariable.user = user;
        showPinById(db,pinId)
        .then(pin =>{
          tempVariable.pin = pin;
          return res.render('pinshow',tempVariable);
        })

    });
  }
  })




  return router;
}
