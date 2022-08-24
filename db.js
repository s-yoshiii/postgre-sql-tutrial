const Pool = require("pg").Pool;
const dotenv = require("dotenv");
dotenv.config();
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: process.env.PASS,
  port: 5432,
});

module.exports = pool;
