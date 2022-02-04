
require("dotenv").config();





//get user with the id
const getuserByID = (db,givenId)=>{
  const queryString = `SELECT * FROM users
  WHERE id = $1;`
  const values = [givenId];
  return db.query (queryString,values)
        .then(res => {
         return  res.rows[0];
        })

};
//get all maps along with their creator
const getAllMaps = (db) =>{
  const queryString = `SELECT maps.title as map ,maps.id as id , users.name as created_by
  FROM maps
  JOIN users ON users.id = user_id;`
  return db.query(queryString)
    .then(res => {
      return res.rows;
    })

}

//get all created maps by particuler user
const getMapsByUser = (db,provided_id)=>{
  const queryString = `SELECT * FROM maps WHERE user_id = $1;`
  const values = [provided_id];
  return db.query(queryString,values)
    .then(res => {
      return res.rows;
    })
}

//get all favourite maps by particuler user
const getfavouriteMapByUser = (db,provided_id)=>{
  const queryString = `SELECT * FROM favourite_maps WHERE user_id = $1;`
  const values = [provided_id];
  return db.query(queryString,values)
    .then(res => {
      return res.rows;
    })
}


module.exports = {getuserByID,getAllMaps,getMapsByUser,getfavouriteMapByUser};


