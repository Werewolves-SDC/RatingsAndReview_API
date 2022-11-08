require('dotenv').config();
const { Pool } = require('pg');

const p = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

pool.connect()
  .then(() => console.log('Connection to database has been made'))
  .catch((err) => console.log(err));

module.exports = pool;