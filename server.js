const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 5000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Express");
});
app.get("/users", (req, res) => {
  pool.query("SELECT * FROM users", (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
