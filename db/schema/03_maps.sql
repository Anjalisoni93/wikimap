-- Drop and recreate maps table (Example)

DROP TABLE IF EXISTS maps CASCADE;
CREATE TABLE maps (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL,
  created_at DATE NOT NULL,
  removed_at DATE DEFAULT NULL
);
