const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT maps.title as map ,maps.id as id , users.name as created_by
              FROM maps
              JOIN users ON users.id = user_id;`)
      .then(data => {
        const maps = data.rows;
        res.render('showMaps', {maps});
        // res.json(showMaps[0]);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};

