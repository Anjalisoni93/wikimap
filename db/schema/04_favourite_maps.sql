-- Drop and recreate favourite_maps table (Example)

DROP TABLE IF EXISTS favourite_maps CASCADE;
CREATE TABLE favourite_maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  map_id INTEGER NOT NULL REFERENCES maps(id) ON DELETE CASCADE,
  created_at DATE NOT NULL,
  removed_at DATE DEFAULT NULL
);
