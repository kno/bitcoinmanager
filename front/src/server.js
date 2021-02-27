import App from "./App";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import connection from "./db.js";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server.use(express.json());

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
        if (!results) {
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

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))

  .get("/api", security, (req, res) => {
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

  .post("/api", security, (req, res) => {
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

  .delete("/api/:id", security, (req, res) => {
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

  .get("/*", (req, res) => {
    const context = {};
    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    );

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(
        `<!doctype html>
    <html lang="">
    <head>
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta charset="utf-8" />
        <title>Welcome to Bitcoin</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        ${
          assets.client.css
            ? `<link rel="stylesheet" href="${assets.client.css}">`
            : ""
        }
        ${
          process.env.NODE_ENV === "production"
            ? `<script src="${assets.client.js}" defer></script>`
            : `<script src="${assets.client.js}" defer crossorigin></script>`
        }
    </head>
    <body>
        <div id="root">${markup}</div>
    </body>
</html>`
      );
    }
  });

export default server;
