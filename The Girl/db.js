const { Pool } = require("pg");
const pool = new Pool({
  host: "127.0.0.1",
  user: "postgres",
  port: 5432,
  password: "root",
  database: "blog",
});

const userTable = `CREATE TABLE users(
  user_id SERIAL PRIMARY KEY NOT NULL,
  role VARCHAR(20) NOT NULL,
  username VARCHAR(200) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const postTable = `
 CREATE TABLE posts(
 post_id SERIAL PRIMARY KEY NOT NULL,
 body VARCHAR(200) ,
 title VARCHAR(50) NOT NULL,
 user_id INT,
 created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
 status VARCHAR(20) NOT NULL,
 CONSTRAINT fk_user
    FOREIGN KEY(user_id)
    REFERENCES users(user_id)
    ON DELETE CASCADE
 );
`;

const followTable = `CREATE TABLE follows(
    id SERIAL PRIMARY KEY NOT NULL,
     followed_user_id INT REFERENCES users,
    following_user_id INT REFERENCES users,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW());
`;

const createPostTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(postTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const createUserTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(userTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

const createFollowTable = async () => {
  const client = await pool.connect();
  try {
    await client.query(followTable);
  } catch (err) {
    console.error(err);
  } finally {
    client.release();
  }
};

module.exports = { pool, createUserTable, createPostTable, createFollowTable };
