import bcrypt from "bcrypt";
import Router from "express";
import connection from "./db.js";

const saltRounds = 10;

const security = async (req, res, next) => {
  const loginData = JSON.parse(req.headers.authorization);
  if (loginData.username && loginData.password) {
    connection
      .query(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        loginData.username
      )
      .then(async (results, error, fields) => {
        if (!results || results.length === 0) {
          res.status(401).send();
        } else {
          try {
            const passwordOk = await bcrypt.compare(
              loginData.password,
              results[0].password
            );
            if (passwordOk) {
              req.params.userId = results[0].id;
              next();
            } else {
              res.status(401).send();
            }
          } catch (error) {
            console.log("Error bcrypt", error);
            res.status(401).send();
          }
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

  .post("/users", async (req, res) => {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);

    connection
      .query("INSERT INTO users SET ?", req.body)
      .then((results, error, fields) => {
        if (error) {
          res.status(500).send();
        } else {
          res.send(results);
        }
      });
  });

export default Api;
