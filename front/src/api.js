import Router from "express";
import connection from "./db.js";

const security = (req, res, next) => {
  const loginData = JSON.parse(req.headers.authorization);
  if (loginData.username && loginData.password) {
    connection
      .query(
        "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1",
        [loginData.username, loginData.password]
      )
      .then((results, error, fields) => {
        console.log(error, results, fields);
        if (!results || results.length === 0) {
          res.status(401).send();
        } else {
          req.params.userId = results[0].id;
          next();
        }
      });
  } else {
    res.status(401).send();
  }
};

const Api = Router();
Api.get("/", security, (req, res) => {
  connection
    .query("SELECT * FROM trade WHERE userId = ?", [req.params.userId])
    .then(
      (rows, fields) => {
        console.log("query executed");
        console.log(fields, rows);
        res.json({ rows: rows, fields: fields });
      },
      (err) => {
        console.log(err);
        res.send(err);
      }
    );
})

  .post("/", security, (req, res) => {
    req.body.userId = req.params.userId;
    connection
      .query("INSERT INTO trade SET ?", req.body)
      .then((results, error, fields) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(results);
        }
      });
  })

  .delete("/:id", security, (req, res) => {
    connection
      .query("DELETE FROM trade WHERE id = ? AND userId = ?", [
        req.params.id,
        req.params.userId,
      ])
      .then((results, error, fields) => {
        if (error) {
          res.status(500).send(error);
        } else {
          res.send(results);
        }
      });
  })

  .post("/users", (req, res) => {
    connection
      .query("INSERT INTO users SET ?", req.body)
      .then((results, error, fields) => {
        if (error) {
          res.status(500).send();
        } else {
          res.send(results);
        }
      })
  })

  ;

export default Api;
