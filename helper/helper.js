//Create function to get user by email

/* const getUserByEmail = function (db,email) {
  for(const key in db){
    if(db[key].email === email){
      return db[key];
   }
  }
  return undefined;
}; */

const getuserByID = (db,givenId)=>{
  const queryString = `SELECT * FROM users
  WHERE id = $1;`
  const values = [givenId];
  return db.query (queryString,values)
        .then(res => {
         return  res.rows[0];
        })
        .catch(err =>{
          return undefined;
        })
};

const getAllMaps = (db) =>{
  const queryString = `SELECT maps.title as map ,maps.id as id , users.name as created_by
  FROM maps
  JOIN users ON users.id = user_id;`
  return db.query(queryString)
    .then(res => {
      return res.rows;
    })
    .catch(err =>{
      return undefined;
    })
}


module.exports = {getuserByID,getAllMaps};


