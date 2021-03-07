import bcrypt from "bcrypt";
import csv from "csv-parser";
import Router from "express";
import fs from "fs";
import passport from "passport";
import yahooFinance from "yahoo-finance";
import connection from "./db";
import { security } from "./security";

var jwt = require("jsonwebtoken");

const saltRounds = 10;

const Api = Router();
Api.use((req, res, next) => {
  req.app.use(passport.initialize());
  req.app.use(passport.session());
  security(passport);
  next();
})

  .get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    connection
      .query("SELECT * FROM trade WHERE userId = ?", [req.user.id])
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

  .post("/", passport.authenticate("jwt", { session: false }), (req, res) => {
    req.body.userId = req.user.id;
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

  .delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
      connection
        .query("DELETE FROM trade WHERE id = ? AND userId = ?", [
          req.params.id,
          req.user.id,
        ])
        .then((results, error, fields) => {
          if (error) {
            res.status(500).send(error);
          } else {
            res.send(results);
          }
        });
    }
  )

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
  })

  .post("/login", (req, res) => {
    connection
      .query(
        "SELECT * FROM users WHERE username = ? LIMIT 1",
        req.body.username
      )
      .then(async (results, error, fields) => {
        if (!results || results.length === 0) {
          res.status(401).send();
        } else {
          try {
            const passwordOk = await bcrypt.compare(
              req.body.password,
              results[0].password
            );
            if (passwordOk) {
              var payload = { id: results[0].id };
              var opts = { secretOrKey: "lincoin-manager" };
              var token = jwt.sign(payload, opts.secretOrKey, {
                expiresIn: "1y",
              });
              res.json({ message: "ok", token: token });
            } else {
              res.status(401).send();
            }
          } catch (error) {
            console.log("Error bcrypt", error);
            res.status(401).send();
          }
        }
      });
  })

  .get("/exchange/:key", async (req, res) => {
    try {
      const from = "2021/02/01";
      const to = new Date();
      connection
        .query(
          "SELECT * FROM history WHERE date BETWEEN ? AND ? ORDER BY date",
          [from, to]
        )
        .then((results, error, fields) => {
          res.send(results);
        });
      /*const quotes = await yahooFinance.historical({
        symbol: req.params.key,
        from: "01/01/2021",
        to: new Date(),
        period: "d",
      });
      res.send(quotes);
      */
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
  })

  .get("/import", async (req, res) => {
    try {
      fs.createReadStream("data.csv")
        .pipe(csv({ separator: "," }))
        .on("data", (data) =>
          connection.query("INSERT INTO history SET ?", data)
        )
        .on("end", () => {
          res.send("ok");
        });
    } catch (error) {
      console.error("Error importing: ", error);
    }
  });

export default Api;
