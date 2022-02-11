const axios = require('axios');
const Geo_Api = process.env.GEOCODE_API;
require("dotenv").config();


//get coordinates of first Row to show on homepage
const getHomePageMap = (db) => {
  const queryString = `SELECT maps.longitude as longitude,maps.latitude as latitude
      FROM maps
      ORDER BY maps.id
      LIMIT 1;
  `;
  return db.query(queryString)
    .then((data) => {
      return data.rows[0];
    });
};
//get user with the id
const getuserByID = (db, givenId) => {
  const queryString = `SELECT * FROM users
  WHERE id = $1;`;
  const values = [givenId];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      return undefined;
    });

};

//get map by id
const getMapById = (db, mapId) => {
  const queryString = `SELECT * FROM maps WHERE maps.id = $1;`;
  const values = [mapId];
  return db.query(queryString, values)
    .then(data => {
      //console.log(data.rows[0]);
      return data.rows[0];
    });
};

//get all maps along with their creator
const getAllMaps = (db) => {
  const queryString = `SELECT maps.title as map ,maps.id as id , users.name as created_by
  FROM maps
  JOIN users ON users.id = user_id
  WHERE maps.removed_at IS NULL
  ;`;
  return db.query(queryString)
    .then(res => {
      return res.rows;
    });

};

//get all created maps by particuler user
const getMapsByUser = (db, provided_id) => {
  const queryString = `SELECT * FROM maps
  WHERE user_id = $1 AND
  maps.removed_at IS NULL
  ;`;
  const values = [provided_id];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

//update Map
const updateMap = (db, mapID, newMap) => {
  const queryString = `UPDATE maps SET title = $1
      WHERE id = $2;
    `;
  const values = [newMap.title, mapID];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

//DELETE MAP
const deleteMap = (db, mapID) => {
  const queryString = `UPDATE maps SET removed_at = now()::date
  WHERE id = $1;`;
  const values = [mapID];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

//get all pins for particuler map
const showAllpins = (db, mapID) => {
  const queryString = `SELECT * FROM pins WHERE map_id = $1
                        AND pins.removed_at IS NULL ;`;
  const values = [mapID];
  return db.query(queryString, values)
    .then(allpins => {
      return allpins.rows;
    });
};
//get mapID from pinID
const findMapOfPin = (db, pinID) => {
  const queryString = `SELECT maps.city as city, maps.title as title ,
   maps.created_at as created_at,pins.longitude as longitude,
   pins.latitude as latitude,pins.id as pin_id
   FROM pins
   JOIN maps ON maps.id = map_id
   WHERE pins.id = $1;
  `;
  const values = [pinID];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};
//get all pins by particuler user
const showPinsByUser = (db, userId) => {
  const queryString = `SELECT * FROM pins WHERE user_id = $1
                        AND pins.removed_at IS NULL ;`;
  const values = [userId];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

//show pin by its ID
const showPinById = (db, pinId) => {
  const queryString = `SELECT * FROM pins WHERE id = $1;`;
  const values = [pinId];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};


//Get Coordinates
const getCoordinates = (city, country) => {
  return axios.get(`https://open.mapquestapi.com/geocoding/v1/address?key=${Geo_Api}&inFormat=kvp&outFormat=json&location=${city}%2C+${country}`);
};

// Create PIN
const createPin = (db, pin) => {
  const queryString = `INSERT INTO pins (user_id, map_id, title, description, image_url, longitude, latitude, created_at)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`;
  const values = [pin.user_id, pin.map_id, pin.title, pin.description, pin.image_url, pin.longitude, pin.latitude, pin.created_at];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

//UPDATE PIN
const editPin = (db, pinID, newPin) => {
  const queryString = `UPDATE pins SET title = $1, description = $2, image_url = $3
  WHERE id = $4;`;
  const values = [newPin.title, newPin.description, newPin.image_url, pinID];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};
//DELETE PIN
const deletePin = (db, pinID) => {
  const queryString = `UPDATE pins SET removed_at = now()::date
  WHERE id = $1;`;
  const values = [pinID];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

//creating new map
const createMap = (db, map) => {
  const queryString = `INSERT INTO maps(user_id,title,country,city,latitude,longitude,created_at)
  VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *;`;
  const values = [map.user_id, map.title, map.country, map.city, map.latitude, map.longitude, map.created_at];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

// Show favorites of user
const showFavorites = (db, userId) => {
  const queryString = `SELECT maps.id, maps.title, favourite_maps.id as favouriteId
                        FROM favourite_maps
                        JOIN maps ON favourite_maps.map_id = maps.id
                        WHERE favourite_maps.user_id = $1
                        AND favourite_maps.removed_at IS NULL
                        AND maps.removed_at IS NULL;`;
  const values = [userId];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

// Delete favoutites
const deleteFavourite = (db, favouriteId) => {
  const queryString = `UPDATE favourite_maps SET removed_at = now()::date
  WHERE favourite_maps.id = $1;`;
  const values = [favouriteId];
  return db.query(queryString, values)
    .then(res => {
      return res.rows;
    });
};

// Add Favourites
const addFavourite = (db, favourite) => {
  const queryString = `INSERT INTO favourite_maps (user_id, map_id, created_at)
                        VALUES ($1, $2, $3);`;
  const values = [favourite.user_id, favourite.map_id, favourite.created_at];
  return db.query(queryString, values)
    .then(res => {
      return res.rows[0];
    });
};

module.exports = { getuserByID, getAllMaps, getMapsByUser, getMapById, getHomePageMap, showAllpins, showPinsByUser, showPinById, createMap, getCoordinates, updateMap, deleteMap, createPin, editPin, deletePin, findMapOfPin, showFavorites, deleteFavourite, addFavourite };


