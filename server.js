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
// ユーザーを追加する
app.post("/persons", (req, res) => {
  const { name, email, age } = req.body;
  pool.query(
    "SELECT s from persons s WHERE s.email = $1",
    [email],
    (error, results) => {
      if (results.rows.length) {
        return res.send("ユーザーがすでに存在します");
      }
      pool.query(
        "INSERT INTO persons( name , email , age) values($1,$2,$3)",
        [name, email, age],
        (error, results) => {
          if (error) throw error;
          res.status(201).send("ユーザーの作成に成功しました");
        }
      );
    }
  );
});
// ユーザーを削除する
app.delete("/persons/:id", (req, res) => {
  const id = req.params.id;
  pool.query("SELECT * FROM persons WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    const isPersonExist = results.rows.length;
    if (!isPersonExist) {
      return res.status(200).send("ユーザーが存在しません。");
    }
    pool.query("DELETE FROM persons WHERE id = $1", [id], (error, results) => {
      if (error) throw error;
      return res.status(200).send("ユーザーの削除に成功しました");
    });
  });
});
// ユーザーを更新する
app.put("/persons/:id", (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
  pool.query("SELECT * FROM persons WHERE id = $1", [id], (error, results) => {
    if (error) throw error;
    const isPersonExist = results.rows.length;
    if (!isPersonExist) {
      return res.status(200).send("ユーザーが存在しません。");
    }
    pool.query(
      "UPDATE persons SET name = $1 WHERE id = $2",
      [name, id],
      (error, results) => {
        if (error) throw error;
        return res.status(200).send("ユーザーの更新に成功しました");
      }
    );
  });
});
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
