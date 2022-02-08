const axios = require('axios');
require("dotenv").config();


//get coordinates of first Row to show on homepage
const getcoordinates = (db) =>{
  const queryString = `SELECT maps.longitude as longitude,maps.latitude as latitude
      FROM maps
      ORDER BY maps.id
      LIMIT 1;
  `
  return db.query(queryString)
  .then( (data)=>{
    return data.rows[0];
  })
}
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
//get map by id

const getMapById = (db,mapId)=>{
  const queryString = `SELECT * FROM maps WHERE maps.id = $1;`
  const values = [mapId];
  return db.query(queryString,values)
  .then(data =>{
    //console.log(data.rows[0]);
    return data.rows[0];
  })
}



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
//get all pins for particuler map
const showAllpins = (db,mapID)=>{
  const queryString = `SELECT * FROM pins WHERE map_id = $1;`
  const values = [mapID];
  return db.query(queryString,values)
  .then(allpins =>{
    return allpins.rows;
  })
}
//get all pins by particuler user

const showPinsByUser = (db,userId)=>{
  const queryString = `SELECT * FROM pins WHERE user_id = $1;`
  const values = [userId];
  return db.query(queryString,values)
  .then(res =>{
    return res.rows;
  })
}
//show pin by its ID
const showPinById = (db,pinId) =>{
  const queryString = `SELECT * FROM pins WHERE id = $1;`
  const values = [pinId];
  return db.query(queryString,values)
  .then(res =>{
    return res.rows[0];
  })
}

//Get Coordinates
const getCoordinates = (city,country)=>{
 return  axios.get(`https://open.mapquestapi.com/geocoding/v1/address?key=UzrC4CYhwxbQx9VZwS7xsISrm0khxg7m&inFormat=kvp&outFormat=json&location=${city}%2C+${country}`)
}

//creating new map
const createMap = (db,map) =>{
  const queryString = `INSERT INTO maps(user_id,title,country,city,latitude,longitude,created_at)
  VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *;`
  const values = [map.user_id,map.title,map.country,map.city,map.latitude,map.longitude,map.created_at]
  return db.query(queryString,values)
  .then(res =>{
    return res.rows[0];
  })
}


module.exports = {getuserByID,getAllMaps,getMapsByUser,getMapById,getfavouriteMapByUser,getcoordinates,showAllpins,showPinsByUser,showPinById,createMap,getCoordinates};


