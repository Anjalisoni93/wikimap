const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    req.session.user_id = req.params.id;
    db.query(`SELECT * FROM users
              WHERE id = ${req.session.user_id}`)
      .then(data => {
        const users = data.rows[0];
        res.render('showUser', {users});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
