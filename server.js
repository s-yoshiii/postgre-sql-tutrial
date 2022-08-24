const express = require("express");
const pool = require("./db");
const app = express();
const PORT = 5000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello Express");
});
// データのすべて取得
app.get("/persons", (req, res) => {
  pool.query("SELECT * FROM persons", (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});
// IDを指定して取得
app.get("/persons/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM persons WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    return res.status(200).json(results.rows);
  });
});
// personを追加する
app.post("/persons", (req, res) => {
  const { name, emeil, age } = req.body;
  pool.query(
    "SELECT s from persons WHERE s.email = $1",
    [emeil],
    (error, results) => {
      if (results.rows.length) {
        res.send("すでに存在します");
      }
      pool.query(
        "INSERT INTO persons(name,email,age) values($1,$2,$3)",
        [name, emeil, age],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("ユーザーの作成に成功しました");
        }
      );
    }
  );
});
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
